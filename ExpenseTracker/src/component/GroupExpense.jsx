import React, { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { SetExpense } from '../store/slicer/expenseSlice';
import { SetCurrent_Expense } from '../store/slicer/CurrentExpense';
import CreatExpense from './CreateExpense';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring' } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.2 } }
};

const filterBtnVariants = {
  hover: { scale: 1.07, backgroundColor: '#38bdf8', color: '#fff' },
  tap: { scale: 0.97 }
};

const GroupExpense = ({ group, expenses, user }) => {
  
  const [selectedFilter, setSelectedFilter] = useState('All')
  const dispatch = useDispatch()
  const API = 'http://localhost:7000/Home/'
  const [editOpen, setEditOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [form, setForm] = useState({ Item: '', Price: '', Date: '', Time: '' })

  const getFilteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.Date)
      const expenseDateOnly = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

      switch (selectedFilter) {
        case 'Today':
          return expenseDateOnly.getTime() === today.getTime();
        case 'This Week':
          return expenseDateOnly >= startOfWeek && expenseDateOnly <= today;
        case 'This Month':
          return expenseDateOnly >= startOfMonth && expenseDateOnly <= today;
        case 'Last Month':
          return expenseDateOnly >= startOfLastMonth && expenseDateOnly <= endOfLastMonth;
        default:
          return true;
      }
    });
  }, [expenses, selectedFilter])

  const totalFilteredExpense = useMemo(() => {
    return getFilteredExpenses.reduce((sum, expense) => sum + (expense.Price || 0), 0);
  }, [getFilteredExpenses])

  const memberExpenses = useMemo(() => {
    const expensesByMember = {}
    const memberCount = group?.members?.length || 0
    let totalExpense = 0
    if (!group?.members) return expensesByMember
    group.members.forEach(member => {
      expensesByMember[member._id] = 0
    });
    getFilteredExpenses.forEach(expense => {
      totalExpense += (expense.Price || 0)
      if (expense.PaidBy && expense.PaidBy._id) {
        expensesByMember[expense.PaidBy._id] = (expensesByMember[expense.PaidBy._id] + (expense.Price || 0));
        console.log(expensesByMember[expense.PaidBy._id])       
      }
    });
    return {expensesByMember, totalExpense, memberCount };
  }, [getFilteredExpenses, group]);
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const openEdit = (expense) => {
    setSelectedExpense(expense)
    setForm({
      Item: expense.Item || '',
      Price: expense.Price || 0,
      Date: expense.Date ? new Date(expense.Date).toISOString().slice(0, 10) : '',
      Time: expense.Time || ''
    })
    setEditOpen(true)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submitEdit = async (e) => {
    e.preventDefault()
    if (!selectedExpense) return
    try {
      const body = {
        _id: selectedExpense._id,
        Item: form.Item,
        Price: Number(form.Price),
        Date: form.Date,
        Time: form.Time,
        Members: (selectedExpense.Members || []).map(m => m._id || m),
        PaidBy: selectedExpense.PaidBy?._id || selectedExpense.PaidBy
      }
      const res = await fetch(`${API}expense`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = res.json()
      console.log(data)
      if (res.ok) {
        const ref = await fetch(`${API}expense`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const data = await ref.json()
        if (data.success && data.expenses) {
          dispatch(SetExpense(data.expenses))
          if (group?._id) {
            const groupExpenses = data.expenses.filter(exp => String(exp.Group._id) === String(group._id))
            dispatch(SetCurrent_Expense(groupExpenses))
          }
        }
        setEditOpen(false)
        setSelectedExpense(null)
      } else {
        console.error('Failed to update expense')
      }
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  const filterOptions = ['All', 'Today', 'This Week', 'This Month', 'Last Month'];

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-lg mt-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
    >
      <motion.div
        className="flex flex-wrap gap-2 justify-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        {filterOptions.map((label) => (
          <motion.button
            key={label}
            className={`border px-3 py-1 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition ${selectedFilter === label
                ? 'bg-sky-500 text-white'
                : 'bg-slate-400 text-white hover:bg-slate-500'
              }`}
            variants={filterBtnVariants}
            whileHover="hover"
            whileTap="tap"
            initial={false}
            animate="visible"
            onClick={() => handleFilterClick(label)}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
      {/* Total and Individual Expenses Section */}
      <div className="mb-2">
        <div className="font-bold  text-teal-800 text-lg text-center">
          Total Expense ({selectedFilter}): ₹{totalFilteredExpense}
        </div>
        <div className="flex flex-wrap  justify-center gap-4 mt-2">
          {group?.members?.map(member => (
            <div key={member._id} className="bg-slate-200 rounded-lg px-3 py-1 text-sm text-blue-700">
              <span className="font-semibold">{(member.name).toUpperCase()}:</span>₹{memberExpenses.expensesByMember[member._id] || 0} ||
              <span className="text-xs text-gray-500"> ₹{(memberExpenses.expensesByMember[member._id])-(memberExpenses.totalExpense/memberExpenses.memberCount) || 0}</span>
              
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col max-h-[70vh] gap-4 overflow-y-scroll">
        <AnimatePresence>
          {getFilteredExpenses && getFilteredExpenses.length > 0 ? (
            getFilteredExpenses.map((expense) => {
              const dateObj = new Date(expense.Date);
              const dateStr = dateObj.toLocaleDateString();

              
              return (
                <motion.div
                  key={expense._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-slate-100 rounded-xl p-4 shadow group hover:bg-slate-200 transition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <div className="flex text-teal-800 items-center gap-3 w-full sm:w-auto">
                    <img
                      src={expense.avatar || '/icon/groupAv.png'}
                      alt="avatar"
                      className="h-10 w-10rounded-full object-cover border bg-white"
                    />
                    <div>{expense.Item}</div>
                    <div>
                      <div className="font-semibold text-gray-700 text-base">{expense.item}</div>
                      <div className="text-xs text-gray-500 flex gap-2">
                        <span>Date: {dateStr}</span>
                        <span>Time: {expense.Time}</span>
                      </div>
                      <div className=" text-gray-500 mt-1">
                        Paid by: <span className="font-semibold text-black">{expense.PaidBy.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  {!group || !group.members || group.members.length === 0 ? (
                    <p className="text-red-500">No members in group</p>
                  ) : (
                    <div className="mt-2 sm:mt-0 text-right">
                      {expense.PaidBy._id === user?._id ? (
                        <div className="text-md font-bold text-emerald-600">
                          ₹{(Math.round((expense.Price)*100 / (group.members.length)))/100}
                        </div>
                      ) : (
                        <div className="text-md font-bold text-red-600">
                          ₹{(Math.round((expense.Price)*100 / (group.members.length)))/100}
                        </div>
                      )}
                      <div className="text-sm text-emerald-500">
                        Total: ₹{expense.Price}
                      </div>
                      {expense.PaidBy._id === user._id&&(<button
                        onClick={() => openEdit(expense)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div
              className="text-gray-400 text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedFilter !== 'All'
                ? `No expenses found for ${selectedFilter}.`
                : 'No expenses found for this group.'
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CreatExpense />
      {editOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-200"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Expense</h3>
            <form onSubmit={submitEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="Item"
                value={form.Item}
                onChange={onChange}
                placeholder="ITEM"
                className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                type="text"
              />
              <input
                name="Price"
                value={form.Price}
                onChange={onChange}
                placeholder="PRICE"
                className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                type="number"
              />
              <input
                name="Time"
                value={form.Time}
                onChange={onChange}
                className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                type="time"
              />
              <input
                name="Date"
                value={form.Date}
                onChange={onChange}
                className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                type="date"
              />
              <div className="col-span-1 sm:col-span-2 flex gap-2 mt-2">
                <button
                  className="bg-teal-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-800 transition"
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="bg-slate-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-slate-800 transition"
                  type="button"
                  onClick={() => { setEditOpen(false); setSelectedExpense(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GroupExpense;
