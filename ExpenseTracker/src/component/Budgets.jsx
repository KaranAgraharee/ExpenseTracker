import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { setBudget } from '../store/slicer/Budgetslice'

const API = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app'

const Budgets = () => {
  const dispatch = useDispatch()


  const user = useSelector((state)=> state.user?.user)
  const Bill = useSelector((state)=> state.Bills?.Bills || [])
  const expense = useSelector((state) => state.expense?.expense || [])
  const Budget = useSelector((state)=> state.Budget?.Budget || 0)
  
  console.log(Bill)

  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState(Budget)

  
  const now = useMemo(() => new Date(), [])
  const Today = useMemo(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()), [now])
  const thisMonth = useMemo(() => Today.getMonth(), [Today])
  const lastMonth = useMemo(() => thisMonth - 1, [thisMonth])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'No date'
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const thisMonthExpenses = useMemo(() => {
    return expense.filter((E) => {
      if (!E.Members || !E.Date) return false
      const expenseDate = new Date(E.Date)
      return E.Members.some((m) => m._id === user?._id) && 
             expenseDate.getMonth() === thisMonth &&
             expenseDate.getFullYear() === now.getFullYear()
    })
  }, [expense, user?._id, thisMonth, now])

  const lastMonthExpenses = useMemo(() => {
    return expense.filter((E) => {
      if (!E.Members || !E.Date) return false
      const expenseDate = new Date(E.Date)
      return E.Members.some((m) => m._id === user?._id) && 
             expenseDate.getMonth() === lastMonth &&
             expenseDate.getFullYear() === now.getFullYear()
    })
  }, [expense, user?._id, lastMonth, now])

  const todayExpenses = useMemo(() => {
    return expense.filter((E) => {
      if (!E.Members || !E.Date) return false
      const expenseDate = new Date(E.Date)
      return E.Members.some((m) => m._id === user?._id) && 
             expenseDate.getDate() === Today.getDate() &&
             expenseDate.getMonth() === Today.getMonth() &&
             expenseDate.getFullYear() === Today.getFullYear()
    })
  }, [expense, user?._id, Today])

  const thisMonthTotal = thisMonthExpenses.reduce((sum, E) => {
    const memberCount = E.Members?.length || 1
    return sum + (E.Price / memberCount)
  }, 0)

  const lastMonthTotal = lastMonthExpenses.reduce((sum, E) => {
    const memberCount = E.Members?.length || 1
    return sum + (E.Price / memberCount)
  }, 0)

  const todayTotal = todayExpenses.reduce((sum, E) => {
    const memberCount = E.Members?.length || 1
    return sum + (E.Price / memberCount)
  }, 0)

  const budgetRemaining = Budget - thisMonthTotal
  const budgetPercentage = Budget > 0 ? (thisMonthTotal / Budget) * 100 : 0

  const handleBudgetUpdate = () => {
    setIsEditingBudget(false)
  }
  const UpdateBudget = async (e) => {
    try {
      const amount = e.currentTarget.value
      const res = await fetch(`${API}/auth/set_budget`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(amount)
      })
      console.log(res.json())
      dispatch(setBudget(amount))
      setBudgetInput(amount)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen sm:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-200 mb-2">Budget Overview</h1>
              <p className="text-slate-300">Track your spending and manage your Budget</p>
            </div>
            
            {/* Budget Setting */}
            <div className="bg-slate-700/60 rounded-xl p-4 min-w-[300px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-200">Monthly Budget</h3>
                <button
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  {isEditingBudget ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {isEditingBudget ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={budgetInput} 
                    onChange={UpdateBudget}
                    className="flex-1 bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter Budget amount"
                  />
                  <button
                    onClick={handleBudgetUpdate}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(Budget)}
                </div>
              )}
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Spent this month</span>
              <span className="text-sm font-semibold text-slate-200">
                {formatCurrency(thisMonthTotal)} / {formatCurrency(Budget)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${
                  budgetPercentage > 100 ? 'bg-red-500' : 
                  budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm font-medium ${
                budgetRemaining >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {budgetRemaining >= 0 ? 'Remaining' : 'Over Budget'}: {formatCurrency(Math.abs(budgetRemaining))}
              </span>
              <span className="text-xs text-slate-400">
                {budgetPercentage.toFixed(1)}% used
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-200">This Month</h3>
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-lg">📅</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {formatCurrency(thisMonthTotal)}
            </div>
            <div className="text-sm text-slate-400">
              {thisMonthExpenses.length} transactions
            </div>
          </motion.div>

          {/* Last Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-200">Last Month</h3>
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-lg">📊</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {formatCurrency(lastMonthTotal)}
            </div>
            <div className="text-sm text-slate-400">
              {lastMonthExpenses.length} transactions
            </div>
          </motion.div>

          {/* Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-200">Today</h3>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-lg">⚡</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {formatCurrency(todayTotal)}
            </div>
            <div className="text-sm text-slate-400">
              {todayExpenses.length} transactions
            </div>
          </motion.div>

          {/* Bills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-200">Bills</h3>
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400 text-lg">💳</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {Bill.length}
            </div>
            <div className="text-sm text-slate-400">
              {Bill.filter(b => b.Paid==="false").length} pending
            </div>
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-blue-200 mb-4">This Month Expenses</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              <AnimatePresence>
                {thisMonthExpenses.length === 0 ? (
                  <div className="text-slate-300 text-center py-8">No expenses this month</div>
                ) : (
                  thisMonthExpenses.map((expense, idx) => (
                    <motion.div
                      key={expense._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-slate-700/60 rounded-xl p-4 hover:bg-slate-700/80 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{expense.Item}</h4>
                          <p className="text-sm text-slate-300">
                            {formatDate(expense.Date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            {formatCurrency(expense.Price / (expense.Members?.length || 1))}
                          </div>
                          <div className="text-xs text-slate-400">
                            per person
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bills Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-orange-200 mb-4">Bills & Payments</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              <AnimatePresence>
                {Bill.length === 0 ? (
                  <div className="text-slate-300 text-center py-8">No bills to display</div>
                ) : (
                  Bill.map((bill, idx) => (
                    <motion.div
                      key={bill._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl p-4 transition-colors ${
                        bill.Paid==="false" 
                          ? 'bg-green-700/30 border border-green-500/30' 
                          : 'bg-red-700/30 border border-red-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{bill.Description}</h4>
                          <p className="text-sm text-slate-300">
                            {formatDate(bill.Date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {formatCurrency(bill.Price)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            bill.Paid 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {bill.Paid ? 'Paid' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Budgets
