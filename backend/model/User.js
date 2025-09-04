import mongoose from "mongoose"
const UserSchema =new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    totalSpending:{type: Number, required: true},
    budget:{type: Number, required: true},
},{timestamp: true})
export const UserModel = mongoose.model('Users', UserSchema)