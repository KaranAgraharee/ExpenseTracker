import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AddExpense } from '../store/slicer/expenseSlice';
import { object } from 'motion/react-client';

const ContactExpense = ({ contact, user }) => {

    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()

    const [Add, setAdd] = useState(false)


    const refetchExpenses = async () => {
        try {
            const res = await fetch('http://localhost:7000/Home/expense', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success && data.expenses) {
                dispatch(AddExpense(data.expenses))
            }
        } catch (error) {
            console.log('Error refetching expenses:', error)
        }
    }
    const onSubmit = async (data) => {
        try {
            const paidByMember = data.paidBy
            const UserData = Object.fromEntries(Object.entries(user).filter(([key]) => !["message"].includes(key)))
            const expensedata = {
                Item: data.Item,
                Price: Number(data.Price),
                Date: data.Date,
                Time: data.Time,
                PaidBy: paidByMember,
                Members: [contact, UserData],
                Group: 'non-group'
            }
            console.log(expensedata)
            const response = await fetch('http://localhost:7000/Home/expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(expensedata)
            })

            if (response.ok) {
                const result = await response.json();
                console.log('Expense added successfully:', result);

                await refetchExpenses();

                reset();
                setAdd(false)

            } else {
                const error = await response.json();
                console.error('Error adding expense:', error);
            }
        }
        catch (err) {
            console.log(err, "Error on submitting data")
        }
    }
    return (
        <div className="w-full flex justify-center items-center min-h-[200px] p-4">
            <AnimatePresence>
                {Add ? (
                    <motion.form
                        key="expense-form"
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
                    >
                        <input {...register("Item")} placeholder='Description' className="bg-gray-100 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" />
                        <input {...register("Price")} placeholder='Price' className="bg-gray-100 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" min="0" step="0.01" />
                        <div className="flex gap-2 flex-col sm:flex-row">
                            <input {...register("Date")} className="bg-gray-100 rounded px-3 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="date" />
                            <input {...register("Time")} className="bg-gray-100 rounded px-3 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" type="time" />
                        </div>
                        <div className="flex gap-4 items-center flex-wrap">
                            <span className="text-gray-700 text-sm">Paid By:</span>
                            <label className="flex items-center gap-1">
                                <input
                                    {...register("paidBy")}
                                    type="radio"
                                    value={user?._id}
                                    className="accent-blue-500"
                                />
                                <span className="text-gray-700 text-sm">{user?.name}</span>
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    {...register("paidBy")}
                                    type="radio"
                                    value={contact?._id}
                                    className="accent-blue-500"
                                />
                                <span className="text-gray-700 text-sm">{contact?.name}</span>
                            </label>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setAdd(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition">Add</button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.button
                        key="add-expense-btn"
                        onClick={() => setAdd(true)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition w-full"
                    >
                        Add Expense
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ContactExpense
