import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'



import authRoute from './routes/auth.js'

const app = express()
dotenv.config()


const PORT = process.env.PORT || 3002
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME


app.use(cors())
app.use(express.json())


//Routes
app.use('/api/auth', authRoute)


async function start() {
        try{
            await mongoose.connect(
                `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.u5huw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
            )
            app.listen(PORT, () => console.log(`server started on port: ${PORT}`)
        )
        } catch (error) {
            console.log(error)
        }
}

start()

