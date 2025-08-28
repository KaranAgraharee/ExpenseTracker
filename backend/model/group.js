import mongoose from "mongoose"
const GroupSchema = new mongoose.Schema({
    GroupName: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
}, { timestamps: true })

export const groupModel = mongoose.model("groupModel", GroupSchema)