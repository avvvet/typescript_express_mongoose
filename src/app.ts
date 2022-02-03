import express, {Express, Request, Response } from 'express'
import helmet from 'helmet'
import dontenv from 'dotenv'
import userRoute from './routes/userRoute'
import dbConnect from './config/db'
import departmentRoute from './routes/departmentRoute'
import roleRoute from './routes/roleRoute'
import authRoute from './routes/authRoute'

const app:Express = express()
const PORT = process.env.PORT || 4000

dontenv.config()
dbConnect()

app.use(helmet())
app.use(express.json())

app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/departments', departmentRoute)
app.use('/roles', roleRoute)

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('service is running')
})

app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`)
})