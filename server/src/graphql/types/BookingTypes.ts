import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class AvailableDaysResponse {
  @Field(() => [DayMonth])
  available_dates: [DayMonth]
  @Field()
  start_work_day: String
  @Field()
  end_work_day: String
}

@ObjectType()
export class DayMonth {
  @Field()
  day: number
  @Field()
  month: number
  @Field()
  weekday: string
}

@ObjectType()
export class HourMinute {
  @Field()
  hour: number
  @Field()
  minutes: number
}
