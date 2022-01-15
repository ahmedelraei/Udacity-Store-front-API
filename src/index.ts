import express, { Application } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { loggerMiddleware } from './middlewares/logger'
import { requestNotFound404 } from './middlewares/404Request'
import { handleErrors } from './middlewares/handleErrors'
import { routes } from './routes'

dotenv.config()
const PORT = process.env.PORT || 3000

const app: Application = express()

// enable cors
const corsOption = {
  optionsSuccessStatus: 200, // for some lagacy browsers
}
app.use(cors(corsOption))
// add json parser
app.use(express.json())
// console log all requests
app.use(loggerMiddleware)
// set routes
routes(app)
// handle unknown requests
app.use(requestNotFound404)
// handle errors
app.use(handleErrors)

export const server = app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`)
})
export default app
