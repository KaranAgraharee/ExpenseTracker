import { Expense } from "../model/expense.js";
import { groupModel } from "../model/group.js";
import { Contact } from "../model/Contact.js";
import { UserModel } from "../model/User.js";



export const createExpense = async (req, res, next) => {
  try {
    const { Date, Time, Item, Price, Members, PaidBy } =
    req.body
    const user = req.user
    if(req.body.Group){
      const Group = req.body.Group
      const expense = new Expense({
        Members,
        PaidBy,
        Group,
        Date,
        Time,
        Item,
        Price,
      });
      await expense.save();
      res.status(201).json({
        message: "Expense created successfully",
        success: true,
        expense,
      })
}else{               
const expense = new Expense({
      Members,
      PaidBy,
      Date,
      Time,
      Item,
      Price,
      })
      await expense.save();
      res.status(201).json({
        message: "Expense created successfully",
        success: true,
        expense,
    })
  }
    
    try {
      await UserAccount(req, res);
    } catch (accountError) {
      console.error("Error updating user account:", accountError);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getExpenses = async (req, res) => {
  try {
    const user = req.user._id;
    const expenses = await Expense.find({ Members: user })
      .populate("PaidBy", "name email")
      .populate("Members", "name email")
      .populate("Group", "GroupName");

    res.status(200).json({
      message: "Expenses fetched successfully",
      success: true,
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updateExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenseId = req.body._id;
    const { Members ,PaidBy } = req.body;

    const isMember = Array.isArray(Members)
      ? Members.some((m) => String(m?._id || m) === String(userId))
      : false;
    const isPayer = String(PaidBy?._id || PaidBy) === String(userId);

    if (isMember && isPayer) {
      const expense = await Expense.findOneAndUpdate(
        { _id: expenseId },
        req.body,
        { new: true }
      )
      if (!expense) {
        return res.status(404).json({
          message: "Expense not found",
          success: false,
        });
      }
      res.status(200).json({
        message: "Expense updated successfully",
        success: true,
        expense,
      });
    } else if (isMember && !isPayer) {
      return res.status(404).json({
        message: "User not allowed",
        success: false,
      });  
    
    } else {
        return res.status(404).json({
          message: "Unauthorised",
          success: false,
        });  
      }
      next();
    }catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const user = req.user;
    const {_id, Members, PaidBy} = req.body
    const User = Members.some((m)=>m._id === user)
    if (PaidBy===user &&  User) {
      const expense = await Expense.findOneAndDelete({ _id: _id });
      if (!expense) {
        return res.status(404).json({
          message: "Expense not found.",
          success: false,
        });
      }
      res.status(200).json({
        message: "Expense deleted successfully",
        success: true,
      })
      next()
    } else if(User && PaidBy!==user){
      return res.status(404).json({
        message: "User not allowed",
        success: false,
      })
    }else{
      return res.status(404).json({
        message: "Unauthorised",
        success: false,
      })

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



export const UserAccount = async (req, res, next) => {
  try {
    const user = req.user._id;
    const GroupExpenseTotal = await Expense.aggregate([
      {
        $match: {
          Members: user,
          Group: { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          memberCount: { $size: "$Members" },
        },
      },
      {
        $project: {
          value: {
            $cond: [
              { $eq: ["$PaidBy", user] },
              {
                $subtract: ["$Price", { $divide: ["$Price", "$memberCount"] }],
              },
              { $multiply: [-1, { $divide: ["$Price", "$memberCount"] }] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    const NonGroupContactExpenseTotal = await Expense.aggregate([
      {
        $match: {
          Members: user,
          Group: { $exists: false },
        },
      },
      {
        $project: {
          value: {
            $cond: [
              { $eq: ["$PaidBy", user] },
              { $divide: ["$Price", 2] },
              { $multiply: [-1, { $divide: ["$Price", 2] }] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    const BillTotal = await Expense.aggregate([
      { $match: { User: user } },
      { $group: { _id: null, total: { $sum: "$Price" } } },
    ]);

    const groupTotal = GroupExpenseTotal[0]?.total || 0;
    const nonGroupTotal = NonGroupContactExpenseTotal[0]?.total || 0;
    const billTotal = BillTotal[0]?.total || 0;

    const totalSpending = groupTotal + nonGroupTotal + billTotal;

    await UserModel.findOneAndUpdate(
      { _id: user },
      { $set: { totalSpending } },
      { new: true }
    );

    const userDoc = await UserModel.findById(user);

    res.status(200).json({
      message: "User Found",
      email: userDoc.email,
      name: userDoc.name,
      _id: userDoc._id,
      totalSpending: userDoc.totalSpending,
      budget: userDoc.budget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}


export const setBudget = async (req, res, next) => {
  try {
    const user = req.user._id;
    const { budget } = req.body;
    await UserModel.findOneAndUpdate(
      { _id: user },
      { $set: { budget } },
      { new: true }
    )
    res.status(200).json({
        message: "Budget set successfully",
        success: true,
        budget: budget,
    })
  }catch(error){
    res.status(500).json({
        message: "Internal server error",
        success: false,
    })
  }
}