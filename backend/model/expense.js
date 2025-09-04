import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema(
  {
    PaidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    Members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    Group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groupModel" 
      },
    Date: {
      type: Date,
      required: [true, "Enter the Date"],
    },
    Time: {
      type: String,
      required: [true, "Enter Time"],
    },
    Item: {
      type: String,
      required: [true, "Enter the Purchased Item"],
    },
    Price: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: (props) =>
          `${props.value} is not a valid price. Price must be greater than 0.`,
      },
      required: [true, "Enter the Price"],
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", ExpenseSchema);
