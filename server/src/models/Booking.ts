import * as mongoose from "mongoose"
import { ObjectType, Field, ID } from "type-graphql"
import { UserType } from "./User"
import { IProcedureWithInfo } from "./ProceduresForBooking"
import { ProcedureWithInfoType } from "../graphql/types/ProcedureTypes"

export interface IBooking extends mongoose.Document {
  start_time: Date
  duration: number
  user: string
}

@ObjectType()
export class BookingType {
  @Field(() => ID)
  _id: string
  @Field()
  start_time: Date
  @Field()
  duration: Number
  @Field()
  user: UserType
  @Field(() => [ProcedureWithInfoType])
  procedures: IProcedureWithInfo[]
}

const bookingSchema = new mongoose.Schema({
  start_time: {
    type: Date,
    nullable: false,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Booking = mongoose.model<IBooking>("Booking", bookingSchema)

export default Booking
