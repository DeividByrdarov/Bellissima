import { Field, InputType, ObjectType } from "type-graphql"
import { IProcedure, ProcedureType } from "../../models/Procedure"

@InputType()
export class ProcedureWithInfoInputType {
  @Field()
  procedure: string
  @Field({ nullable: true })
  info?: string
  @Field({ nullable: true })
  image_url?: string
}

@ObjectType()
export class ProcedureWithInfoType {
  @Field(() => ProcedureType)
  procedure: IProcedure
  @Field({ nullable: true })
  info?: string
  @Field({ nullable: true })
  image_url?: string
}
