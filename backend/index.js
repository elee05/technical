import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {MongoClient} from 'mongodb'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000



const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `Given a location, with no intro, give a short numbered list of  places in a totally different part of the world have a sunset at the same time Before the list give the time range.`,
})

app.post('/chat', async (req, res) => {
    const userInput = req.body.userInput
    let responseMessage
    try {
        const result = await model.generateContent(userInput)
        responseMessage = result.response.text()
    } catch(e) {
        responseMessage = 'Oops, something went wrong!'
    }
    res.json({
        message: responseMessage,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.get('/logs', async (req, res) => {
    try {
        const logs = await mongoclient.db('Cluster0').collection('logs').find({}).toArray()
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Error'})
    }
})

app.post('/add', async (req, res) => {
    try {
        const log = req.body
        if (!log.input || !log.response || Object.keys(log).lenth !== 2) {
            res.status(400).json({message: 'Bad Request'})
            return
        }
        await mongoclient.db('Cluster0').collection('logs').insertOne(log)
        res.status(201).json({messsage: 'Success'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Error'})
    }
})