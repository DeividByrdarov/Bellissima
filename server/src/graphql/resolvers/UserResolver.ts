import * as bcryptjs from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { Resolver, Mutation, Arg, Authorized } from "type-graphql"
import User, { UserType } from "../../models/User"
import { LoginResponse } from "../types/UserTypes"

@Resolver()
export default class UserResolver {
  @Authorized(true)
  @Mutation(() => UserType)
  async register(
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string,
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("admin", { defaultValue: false }) admin: boolean
  ) {
    const genPassword = randomDigits(6)
    const user = new User({
      firstname,
      lastname,
      username,
      email,
      password: await bcryptjs.hash(genPassword, 10),
      admin,
    })

    await user.save()
    return {
      ...user,
      password: genPassword,
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await User.findOne({ email }).lean()

    if (user) {
      if (await bcryptjs.compare(password, user.password)) {
        return {
          ok: true,
          token: jwt.sign({ ...user }, "SECRET"),
        }
      }
    }

    return {
      ok: false,
      msg: "Invalid credentials",
    }
  }
}

const randomDigits = (length: number) => {
  let res = ""

  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 9)
    res += num
  }

  return res
}
