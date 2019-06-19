import * as mongoose from "mongoose"
import { ObjectType, Field, ID } from "type-graphql"

export interface IProcedure extends mongoose.Document {
  name: string
  price: number
  required_time: number
  slug: string
  info?: string
}

@ObjectType()
export class ProcedureType {
  @Field(() => ID)
  _id: string
  @Field()
  name: string
  @Field()
  price: number
  @Field({ description: "Time required to perform procedures (in minutes)" })
  required_time: number
  @Field()
  slug: string
  @Field({ nullable: true })
  info?: string
}

export const proceduresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  required_time: {
    type: Number,
    required: true,
  },
  info: {
    type: String,
    default: "",
  },
})

const Procedure = mongoose.model<IProcedure>("Procedure", proceduresSchema)

export default Procedure
