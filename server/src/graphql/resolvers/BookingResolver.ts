import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql"
import * as moment from "moment"
import Booking, { BookingType, IBooking } from "../../models/Booking"
import Procedure, { ProcedureType } from "../../models/Procedure"
import { UserType } from "../../models/User"
import Config from "../../models/Config"
import { AvailableDaysResponse, HourMinute } from "../types/BookingTypes"
import ProceduresForBooking, {
  IProcedureWithInfo,
  IProceduresForBooking,
} from "../../models/ProceduresForBooking"
import {
  ProcedureWithInfoInputType,
  ProcedureWithInfoType,
} from "../types/ProcedureTypes"

@Resolver(() => BookingType)
export default class BookingResolver {
  mapBulgarian(weekday: string) {
    switch (weekday) {
      case "Monday":
        return "Понеделник"
      case "Tuesday":
        return "Вторник"
      case "Wednesday":
        return "Сряда"
      case "Thursday":
        return "Четвъртък"
      case "Friday":
        return "Петък"
      case "Saturday":
        return "Събота"
      case "Sunday":
        return "Неделя"
      default:
        return ""
    }
  }

  @Authorized(true)
  @Query(() => [BookingType])
  async getBookings() {
    return await Booking.find({})
      .populate(["procedures", "user"])
      .lean()
  }

  @Authorized()
  @Query(() => AvailableDaysResponse)
  async getAvailableDays() {
    const working_hours = await Config.findOne(
      {},
      { start_work_day: 1, end_work_day: 1 }
    ).lean()

    const available_dates = []
    const curr_date = moment.utc()
    if (curr_date.hour() >= 4) {
      curr_date.add(1, "day")
    }

    for (let i = 0; i < 30; i++) {
      if (curr_date.day() === 0) {
        curr_date.add(1, "day")
        i--
        continue
      }
      available_dates.push({
        day: curr_date.date(),
        month: curr_date.month(),
        weekday: this.mapBulgarian(curr_date.format("dddd")),
      })
      curr_date.add(1, "day")
    }

    return {
      available_dates,
      start_work_day: working_hours.start_work_day,
      end_work_day: working_hours.end_work_day,
    }
  }

  @Authorized()
  @Query(() => [HourMinute], {
    description: "dayMonth argument should be in format 'DD.MM'",
  })
  async getHoursForDay(
    @Arg("dayMonth") dayMonth: string,
    @Arg("duration") duration: number
  ) {
    const working_hours = await Config.findOne(
      {},
      { start_work_day: 1, end_work_day: 1 }
    ).lean()
    const [day, month] = dayMonth.split(".")
    const new_booking_date = moment
      .utc(working_hours.start_work_day, "HH:mm:ss.SSS")
      .date(Number(day))
      .month(Number(month) - 1)
    const end_time = moment.utc(working_hours.end_work_day, "HH:mm:ss.SSS")

    const available_times = []
    const day_bookings = await Booking.find({
      start_time: {
        $gte: moment.utc(new_booking_date).format(),
        $lt: moment
          .utc(new_booking_date)
          .add(1, "day")
          .format(),
      },
    }).lean()

    while (true) {
      let free = true

      for (let booking of day_bookings) {
        const booking_time = moment.utc(booking.start_time)
        const end_booking = moment
          .utc(booking_time)
          .add(booking.duration, "minutes")

        if (
          new_booking_date.isBetween(
            moment.utc(booking_time).subtract(duration, "minutes"),
            end_booking
          )
        ) {
          free = false
        }
      }

      if (free) {
        available_times.push({
          hour: new_booking_date.hours(),
          minutes: new_booking_date.minutes(),
        })
      }

      if (new_booking_date.hour() >= end_time.hour()) {
        break
      }

      new_booking_date.add(10, "minutes")
    }

    return available_times
  }

  @Authorized()
  @Mutation(() => Boolean)
  async createBooking(
    @Arg("start_time") start_time: string,
    @Arg("procedures", () => [ProcedureWithInfoInputType])
    procedures: IProcedureWithInfo[],
    @Ctx("req") { user }: { user: UserType }
  ) {
    try {
      const procedures_ids = procedures.reduce<string[]>(
        (acc, pr): string[] => [...acc, pr.procedure],
        []
      )
      const fetchProcedures = await Procedure.find(
        {
          _id: { $in: procedures_ids },
        },
        { required_time: 1 }
      ).lean()
      const duration = fetchProcedures.reduce(
        (acc: number, pr: ProcedureType) => acc + pr.required_time,
        0
      )
      const booking = new Booking({
        start_time: moment.utc(start_time),
        user: user._id,
        duration,
      })

      await booking.save()

      const procedureForBooking = new ProceduresForBooking({
        booking: booking._id,
        procedures,
      })

      await procedureForBooking.save()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  @FieldResolver(() => [ProcedureWithInfoType])
  async procedures(@Root() booking: IBooking) {
    const prWithInfo: IProceduresForBooking = await ProceduresForBooking.findOne(
      {
        booking: booking._id,
      }
    )
      .populate("procedures.procedure")
      .lean()
    return prWithInfo.procedures
  }

  // @Authorized()
  // @Mutation(() => BookingType)
  // async addProcedureToBooking(
  //   @Arg("booking_id") booking_id: string,
  //   @Arg("procedure_slug") procedure_slug: string
  // ) {
  //   const booking = await Booking.findById(booking_id)
  //     .populate(["procedures", "user"])
  //     .exec()
  //   const procedure = await Procedure.findOne({ slug: procedure_slug }).lean()

  //   if (booking && procedure) {
  //     booking.procedures.push(procedure)
  //     booking.duration = booking.duration + procedure.required_time
  //     booking.save()
  //   }

  //   return booking
  // }
}
