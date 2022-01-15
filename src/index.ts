import express, { Application } from 'express'
import * as dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 3000

const app: Application = express()

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`)
})
export default app
