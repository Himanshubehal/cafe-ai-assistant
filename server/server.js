import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
import  mongoose  from "mongoose"
import Message from "./models/Message.js"
import dns from "dns"
dns.setServers(["8.8.8.8"])


dotenv.config()
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const cafeInfo = `
You are the friendly assistant for Brew & Bite, a small cafe.
Menu: Cappuccino ₹120, Cold Coffee ₹150, Masala Chai ₹60,
Veg Sandwich ₹110, Paneer Wrap ₹160, Chocolate Brownie ₹90.
Timings: 9 AM to 10 PM, every day.
Only answer questions about the cafe. Keep replies short and friendly.
`


const app = express()
app.use(cors())
app.use(express.json())





app.get("/", (req, res) => {
    res.send("Server running")
})


app.post("/api/chat", async (req, res) => {
    try {
        const { message, sessionId } = req.body
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message,
            config: {systemInstruction: cafeInfo}
        })
        await Message.create({sessionId, role: "user", text:message})
        await Message.create({sessionId, role: "bot", text: response.text})
        res.json({ reply: response.text })
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong"})
    }
})

app.get("/api/chat/:sessionId", async (req, res) => {
    try {
        const {sessionId} = req.params
        const msg = await Message.find({sessionId}).sort({createdAt: 1})
        res.json(msg)
    } catch (error) {
        console.error(error)
        res.status(500).json({error : "Something went wrong"})
    }
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error(err))

app.listen(process.env.PORT || 500, () => {
    console.log("Server running on 5000")
})