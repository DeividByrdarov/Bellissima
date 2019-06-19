import * as mongoose from "mongoose"
import { ObjectType, Field, ID } from "type-graphql"
import { BookingType, IBooking } from "./Booking"

export interface IUser extends mongoose.Document {
  firstname: string
  lastname: string
  password: string
  email: string
  admin: boolean
  bookings: [IBooking]
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  _id: string
  @Field()
  firstname: string
  @Field()
  lastname: string
  @Field()
  password: string
  @Field()
  email: string
  @Field()
  admin: boolean
  @Field(() => [BookingType])
  bookings: [BookingType]
}

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
  ],
})

const User = mongoose.model<IUser>("User", userSchema)

export default User
