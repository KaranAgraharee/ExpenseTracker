import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AddExpense } from '../store/slicer/expenseSlice';

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
                {Add && (
                    <Motion.div
                        key="contact-expense-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
                    >
                        <Motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 flex flex-col gap-4 relative"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-800 font-semibold">Add Contact Expense</h3>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Motion.input
                                    whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                                    whileHover={{ scale: 1.02 }}
                                    placeholder="Description"
                                    className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                                    type="text"
                                    {...register("Item")}
                                />
                                <Motion.input
                                    whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                                    whileHover={{ scale: 1.02 }}
                                    placeholder="Price"
                                    className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    {...register("Price")}
                                />
                                <div className="relative">
                                    <Motion.input
                                        id="date"
                                        placeholder=" "
                                        className="peer border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                                        type="date"
                                        {...register('Date')}
                                        whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                                        whileHover={{ scale: 1.02 }}
                                    />
                                    <label htmlFor="date" className="absolute left-26 top-2 text-gray-500 pointer-events-none">DATE</label>
                                </div>
                                <div className="relative">
                                    <Motion.input
                                        id="time"
                                        placeholder=" "
                                        {...register('Time')}
                                        className="peer border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                                        type="time"
                                        whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                                        whileHover={{ scale: 1.02 }}
                                    />
                                    <label htmlFor="time" className="absolute left-24 top-2 text-gray-500 pointer-events-none">TIME</label>
                                </div>
                                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 mt-1">
                                    <span className="text-gray-700 text-sm">Paid by</span>
                                    <label className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                        <input {...register("paidBy")} type="radio" value={user?._id} className="accent-teal-600" />
                                        <span className="text-gray-700 text-sm">{user?.name}</span>
                                    </label>
                                    <label className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                        <input {...register("paidBy")} type="radio" value={contact?._id} className="accent-teal-600" />
                                        <span className="text-gray-700 text-sm">{contact?.name}</span>
                                    </label>
                                </div>
                                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 mt-2">
                                    <Motion.input
                                        whileTap={{ scale: 0.97 }}
                                        className="bg-teal-700 text-white px-4 py-2 w-full sm:w-auto rounded-md font-semibold shadow hover:bg-teal-800 transition text-sm sm:text-base"
                                        type="submit"
                                        value="Add Expense"
                                    />
                                    <Motion.button
                                        whileTap={{ scale: 0.97 }}
                                        className='bg-slate-700 text-white px-4 py-2 w-full sm:w-auto rounded-md font-semibold shadow hover:bg-slate-800 transition text-sm sm:text-base'
                                        type="button"
                                        onClick={() => setAdd(false)}
                                    >
                                        Cancel
                                    </Motion.button>
                                </div>
                            </form>
                            <Motion.button
                                whileTap={{ scale: 0.97 }}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                                onClick={() => setAdd(false)}
                                aria-label="Close"
                            >
                                ×
                            </Motion.button>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
            {!Add && (
                <Motion.button
                    key="add-expense-btn"
                    whileTap={{ scale: 0.97 }}
                    className='mb-2 bg-teal-700 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center justify-center gap-2 hover:bg-teal-800 transition w-full'
                    onClick={() => setAdd(true)}
                >
                    <span className="text-2xl">+</span> Add Expense
                </Motion.button>
            )}
        </div>
    )
}

export default ContactExpense
