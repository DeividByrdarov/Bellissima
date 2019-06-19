import * as mongoose from "mongoose"
import { ObjectType, Field, ID } from "type-graphql"

export interface IConfig extends mongoose.Document {
  start_work_day: Date
  end_work_day: Date
}

@ObjectType()
export class ConfigType {
  @Field(() => ID)
  _id: string
  @Field()
  start_work_day: Date
  @Field()
  end_work_day: Date
}

const configSchema = new mongoose.Schema({
  start_work_day: {
    type: Date,
    required: true,
  },
  end_work_day: {
    type: Date,
    required: true,
  },
})

const Config = mongoose.model<IConfig>("Config", configSchema)

export default Config
