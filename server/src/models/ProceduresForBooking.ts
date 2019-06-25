import * as mongoose from "mongoose"
import { ObjectType, Field, ID } from "type-graphql"
import { IBooking, BookingType } from "./Booking"
import { ProcedureWithInfoType } from "../../src/graphql/types/ProcedureTypes"

export interface IProceduresForBooking extends mongoose.Document {
  booking: IBooking
  procedures: [IProcedureWithInfo]
}

export interface IProcedureWithInfo {
  procedure: string
  info?: string
  image_url?: string
}

@ObjectType()
export class ProceduresForBookingType {
  @Field(() => ID)
  _id: string
  @Field(() => BookingType)
  booking: IBooking
  @Field(() => [ProcedureWithInfoType])
  procedures: [IProcedureWithInfo]
}

export const proceduresForBookingSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  procedures: [
    {
      procedure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Procedure",
        required: true,
      },
      info: String,
      image_url: String,
    },
  ],
})

const ProceduresForBooking = mongoose.model<IProceduresForBooking>(
  "ProceduresForBooking",
  proceduresForBookingSchema
)

export default ProceduresForBooking
