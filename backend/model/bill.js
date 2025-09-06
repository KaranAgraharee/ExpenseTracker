import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    Price: {
      type: Number,
      required: true,
      min: 0,
    },
    Date: {
      type: Date,
      required: true,
    },
    Paid:{
      type: String,
      required: true,
    },
    Notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
);

const Bill = mongoose.model("Bill", BillSchema);

export default Bill;
 