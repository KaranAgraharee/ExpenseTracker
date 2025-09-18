import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { AddExpense, SetExpense } from '../store/slicer/expenseSlice'
import { SetCurrent_Expense } from '../store/slicer/CurrentExpense'

const API = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app'

const CreatExpense = () => {
  const dispatch = useDispatch()
  const [Add, setAdd] = useState(false)
  const [Cancel, setCancel] = useState(false)
  const [split_between, setsplit_between] = useState([])

  const user = useSelector((state) => state.user?.user)
  const Current_Group = useSelector((state) => state.Current_Group?.Current_Group)
  
  useEffect(() => {
    if (Current_Group?.members) {
      setsplit_between(Current_Group.members)
    }
  }, [Current_Group])
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm()

  const Item = watch('Item')
  const Price = watch('Price')
  const Date = watch('Date')
  const Time = watch('Time')

  useEffect(() => {
    if (Item && Price) {
      setCancel(true)
    } else {
      setCancel(false)
    }
  }, [Item, Price])

  const split = (e) => {
    const memberId = e.target.id
    const member = Current_Group.members.find(m => m._id === memberId)
    if (split_between.some(m => m._id === memberId)) {
      setsplit_between(prev => prev.filter(m => m._id !== memberId))
    } else {
      setsplit_between(prev => [...prev, member])
    }
  }  

  const refetchExpenses = async () => {
    try {
      console.log('Refetching expenses...')
      const res = await fetch(`${API}/Home/expense`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      console.log('API Response:', data)
      
      if (data.success && data.expenses) {
        console.log('Dispatching SetExpense with:', data.expenses)
        dispatch(SetExpense(data.expenses))
        
        if (Current_Group?._id) {
          console.log('Current Group ID:', Current_Group._id)
          const groupExpenses = data.expenses.filter(exp => {
            const hasGroup = exp.Group && exp.Group._id
            const matchesGroup = hasGroup && String(exp.Group._id) === String(Current_Group._id)
            console.log('Expense Group ID:', exp.Group?._id, 'Matches:', matchesGroup)
            return matchesGroup
          })
          console.log('Filtered group expenses:', groupExpenses)
          dispatch(SetCurrent_Expense(groupExpenses))
        }
      } else {
        console.log('API response indicates failure or no expenses:', data)
      }
    } catch (error) {
      console.error('Error refetching expenses:', error)
    }
  }

  const onSubmit = async (data) => {
    try {
      const paidByMember = data.paidBy

      const expensedata = {
        Item: data.Item,
        Price: Number(data.Price),
        Date: data.Date,
        Time: data.Time,
        PaidBy: paidByMember,
        Members: split_between,
        Group: Current_Group?._id,
      }
      console.log(expensedata)
      const response = await fetch(`${API}/Home/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expensedata)
      })

      if (response.ok) {
        const result = await response.json();
        console.log('Expense added successfully:', result);
        
        // Refetch all expenses to ensure we have the latest data
        await refetchExpenses();
        
        reset();
        setAdd(false);
      } else {
        const error = await response.json();
        console.error('Error adding expense:', error);
      }
    }
    catch (err) {
      console.log(err, "Error on submitting data")
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } }
  }

  return (
    <div className="w-full flex flex-col items-end">
      <motion.button
        key="add-expense-btn"
        whileTap={{ scale: 0.97 }}
        className='mb-2 bg-teal-700 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center gap-2 hover:bg-teal-800 transition'
        onClick={() => setAdd(true)}
      >
        <span className="text-2xl">+</span> Add Expense
      </motion.button>
      <AnimatePresence>
        {Add && (
          <motion.div
            key="expense-modal"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 flex flex-col gap-4 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="font-semibold text-gray-700">Paid by</span>
                  <div className="flex-1">
                    {Current_Group && Current_Group.members && Current_Group.members.length > 0 ? (
                      <select
                        {...register("paidBy")}
                        className="border rounded px-2 py-1 text-sm mr-2 w-full text-gray-800 bg-white"
                        defaultValue={user._id}
                      >
                        {Current_Group.members.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name || member.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-500 text-sm">No members available</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="font-semibold text-gray-700">Split between</span>
                  <div className="flex-1">
                    {Current_Group && Current_Group.members && Current_Group.members.length > 0 ? (
                      <div className="flex flex-wrap gap-2"
                      >
                        {Current_Group.members.map((member) => (
                          <motion.button
                          whileHover={{ scale: 1.02}}
                          whileTap={{ scale: 0.97}}
                          animate={{
                            backgroundColor: split_between.some(m => m._id === member._id) ? "#3498db" : "#d6eaf8",
                            color: split_between.some(m => m._id === member._id) ? "white" : "#2c3e50"
                          }}
                          transition={{ duration: 0.2 }}
                          className="place-items-center bg-gradient-to-r rounded-full font-semibold shadow p-1"
                          id={member._id}
                          onClick={split}
                          >
                          <label className="text-center px-4" key={member._id} id={member._id}>{member.name}</label>
                               {/* <motion.div
                               whileHover={{ scale: 1.08 }}
                               whileTap={{scale: 0.97}}
                               className=" rounded-full"
                               ><img src="\icon\remove-user.png" className=" rounded-full w-8 h-8" alt="" />
                             </motion.div> */}
                              </motion.button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No members available</span>
                    )}
                  </div>
                </div>
              </div>
              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <motion.input
                  whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                  whileHover={{ scale: 1.02 }}
                  placeholder="ADD ITEM"
                  className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                  type="text"
                  {...register("Item")}
                />
                <motion.input
                  whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                  whileHover={{ scale: 1.02 }}
                  placeholder="PRICE"
                  className="border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                  type="number"
                  {...register("Price")}
                />
                <div className="relative">
                  <motion.input
                    id="time"
                    placeholder=" "
                    {...register('Time')}
                    className="peer border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                    type="time"
                    whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <label
                    htmlFor="time"
                    className="absolute left-24 top-2 text-gray-500  pointer-events-none"
                  >
                    TIME
                  </label>
                </div>
                <div className="relative">
                  <motion.input
                    id="date"
                    placeholder=" "
                    className="peer border border-gray-300 px-3 py-2 rounded text-black w-full focus:outline-none focus:border-teal-600 transition"
                    type="date"
                    {...register('Date')}
                    whileFocus={{ scale: 1.04, borderColor: '#14b8a6' }}
                    whileHover={{ scale: 1.02 }}
                  />
                  <label
                    htmlFor="date"
                    className="absolute left-26 top-2 text-gray-500  pointer-events-none"
                  >
                    DATE
                  </label>
                </div>
                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-2 mt-2">
                  <motion.input
                    whileTap={{ scale: 0.97 }}
                    className="bg-teal-700 text-white px-4 py-2 w-full sm:w-auto rounded-md font-semibold shadow hover:bg-teal-800 transition text-sm sm:text-base"
                    type="submit"
                    value="Add Expense"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className='bg-slate-700 text-white px-4 py-2 w-full sm:w-auto rounded-md font-semibold shadow hover:bg-slate-800 transition text-sm sm:text-base'
                    type="button"
                    onClick={() => {
                      setAdd(false)
                      reset()
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setAdd(false)}
                aria-label="Close"
              >
                ×
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreatExpense