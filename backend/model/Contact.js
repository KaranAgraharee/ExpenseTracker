import mongoose from "mongoose";    

const ContactSchema = new mongoose.Schema({
    Users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
    GroupExpense: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
    Non_GroupExpense: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
    totalGroupSpending: {
        type: Number,
        default: 0
    },
    totalNonGroupSpending: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

export const Contact = mongoose.model("Contact", ContactSchema)