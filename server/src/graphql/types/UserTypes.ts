import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class LoginResponse {
  @Field()
  ok: boolean
  @Field({ nullable: true })
  token?: string
  @Field({ nullable: true })
  msg?: string
}
