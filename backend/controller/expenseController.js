import { Expense } from '../model/expense.js';
import { groupModel } from '../model/group.js';
import { Contact } from '../model/Contact.js';


export const createExpense = async (req, res) => {
    try {
        const { Group, Date, Time, Item, Price, Members, PaidBy, isGroupExpense} = req.body
        const userId = req.user
        const expense = new Expense({ Members, PaidBy, Group, Date, Time,  Item, Price })
        await expense.save()

        try {
            const expenseType = Group.GroupName;
            const allMembers = [...Members]
            
            const contacts = await Contact.find({
                Users: { $all: allMembers },
                $expr: { $eq: [{ $size: "$Users" }, allMembers.length] }
            })
            for (const contact of contacts) {
                if (expenseType === 'non-group') {
                    if (!contact.Non_GroupExpense.includes(expense._id)) {
                        contact.Non_GroupExpense.push(expense._id);
                    }
                } else {
                    if (!contact.GroupExpense.includes(expense._id)) {
                        contact.GroupExpense.push(expense._id);
                    }
                }
                const groupMem = Members.length()
                const groupExpenses = await Expense.find({ _id: { $in: contact.GroupExpense } });
                const nonGroupExpenses = await Expense.find({ _id: { $in: contact.Non_GroupExpense } });
                
                contact.totalGroupSpending = groupExpenses.reduce((sum, exp) => sum + exp.Price, 0);
                contact.totalNonGroupSpending = nonGroupExpenses.reduce((sum, exp) => sum + exp.Price, 0);
                contact.lastUpdated = new Date()
                
                await contact.save()
            }
        } catch (contactError) {
            console.error('Error updating contacts:', contactError);
        }

        res.status(201).json({
            message: 'Expense created successfully',
            success: true,
            expense,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        })
    }
}
export const getExpenses = async (req, res) => {
    try {
        const userId = req.user._id
        const expenses = await Expense.find({ Members:userId }).populate('PaidBy', 'name email') 
        .populate('Members', 'name email')
        .populate('Group', 'GroupName')

        res.status(200).json({
            message: 'Expenses fetched successfully',
            success: true,
            expenses
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
}
export const updateExpense = async (req, res) => {
    try { 
        const userId = req.user
        const expenseId = req._id
        const {user, Date, Time, Item, Price } = req.body
        const expense = await Expense.findOneAndUpdate(
            { _id:expenseId, user:userId },
            req.body,
            { new: true },
        );

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found or unauthorized',
                success: false
            })
        }
        res.status(200).json({
            message: 'Expense updated successfully',
            success: true,
            expense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        })
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const userId = req.user
        const expenseId = req._id
        
        const expense = await Expense.findOneAndDelete({ _id:expenseId })

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found or unauthorized',
                success: false
            })
        }
        res.status(200).json({
            message: 'Expense deleted successfully',
            success: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}
