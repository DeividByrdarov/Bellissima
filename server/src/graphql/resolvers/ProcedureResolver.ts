import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql"
import Procedure, { ProcedureType } from "../../models/Procedure"

@Resolver()
export default class ProcedureResolver {
  @Authorized()
  @Query(() => [ProcedureType])
  async getProcedures() {
    return await Procedure.find({}).lean()
  }

  @Authorized(true)
  @Mutation(() => ProcedureType)
  async createProcedure(
    @Arg("name") name: string,
    @Arg("price") price: number,
    @Arg("required_time") required_time: number
  ) {
    const procedure = new Procedure({
      name,
      price,
      required_time,
    })

    await procedure.save()
    return procedure
  }
}
