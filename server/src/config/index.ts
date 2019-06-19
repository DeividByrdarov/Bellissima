import * as mongoose from "mongoose"

const PORT = process.env.PORT || 4000

export const db = async () => {
  await mongoose.connect(`mongodb://localhost:27017/bellissima`, {
    useNewUrlParser: true,
  })
}

export default {
  PORT,
}
