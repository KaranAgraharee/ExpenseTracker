
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

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
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