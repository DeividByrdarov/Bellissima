import "reflect-metadata"

import * as express from "express"
import * as path from "path"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import * as jwtMw from "express-jwt"
import * as jwt from "jsonwebtoken"
import * as cors from "cors"

import config, { db } from "./config"
import { UserType } from "./models/User"

const main = async () => {
  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "graphql", "resolvers", "**.ts")],
    authChecker: ({ context: { req } }, [shouldBeAdmin]) => {
      const token = req.headers.authorization
      if (token) {
        const user = jwt.verify(token.split(" ")[1], "SECRET") as UserType

        if (shouldBeAdmin) {
          return !!user.admin
        }

        return true
      }

      return false
    },
  })

  await db()

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        req,
        user: req.user, // `req.user` comes from `express-jwt`
      }
      return context
    },
  })

  const app = express()

  app.use(cors())

  app.use(
    "/graphql",
    jwtMw({
      secret: "SECRET",
      credentialsRequired: false,
    })
  )

  server.applyMiddleware({ app })

  app.listen(config.PORT, () =>
    console.log(`Server running on port ${config.PORT}`)
  )
}

main()
