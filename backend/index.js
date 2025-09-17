
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import 'dotenv/config'
import { connectDB } from "./model/db.js"

import './model/User.js'
import './model/group.js'
import './model/expense.js'

import { AuthRouter } from "./Routes/AuthRouter.js"
import { ExpenseRouter } from "./Routes/expenseRouter.js"
import { GroupRouter } from "./Routes/GroupRouter.js"
import { ContactRouter } from "./Routes/contactRouter.js"
import { BillRouter } from "./Routes/billRouter.js"



const app = express() 
const port = process.env.PORT || 7000

connectDB()

// trust proxy so "secure" cookies work behind reverse proxies (e.g., Vercel/Render)
app.set('trust proxy', 1)

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // allow REST tools or same-origin requests with no Origin header
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS not allowed for origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
}))

app.use(cookieParser()) 
app.use(express.json())
app.use(bodyParser.json())
app.use('/auth', AuthRouter )
app.use('/Home', GroupRouter)
app.use('/Home', ExpenseRouter)
app.use('/Home', ContactRouter)
app.use('/Home', BillRouter)

// Root route handler
app.get('/', (req, res) => {
    res.json({ 
        message: 'Expense Tracker API is running!', 
        status: 'success',
        endpoints: {
            auth: '/auth',
            home: '/Home'
        }
    })
})

app.listen(port, () =>{
    console.log(`server running on port ${port}`)
})