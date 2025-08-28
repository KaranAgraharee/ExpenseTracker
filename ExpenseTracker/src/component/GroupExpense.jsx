import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  console.log(expenses)
  
  const [selectedFilter, setSelectedFilter] = useState('All')
  if (!group) {
    console.log("No group selected")
  } else if (!group.members) {
    console.log("Group has no members",)
  } else {
    console.log("Group members:", group.members.length)
  }


  const getFilteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.Date);
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
  }, [expenses, selectedFilter]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

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
      <h2 className="text-xl  sm:text-2xl font-bold text-gray-800 mb-4 text-center">
        {group ? `Expenses for ${group.GroupName}` : 'Select a group to view expenses'}
        <div className='flex gap-2 p-1'>{group?.members?.map((mem)=> (<p className='text-sm  bg-gradient-to-br px-2 rounded-lg  from-yellow-500 via-yellow-200 to-yellow-500'>{(mem.name).toUpperCase()}</p>))}</div>
        {selectedFilter !== 'All' && (
          <span className="block text-sm font-normal text-gray-600 mt-1">
            Filtered by: {selectedFilter}
          </span>
        )}
      </h2>
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
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={expense.avatar || '/icon/groupAv.png'}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover border bg-white"
                    />
                    <div>{expense.Item}</div>
                    <div>
                      <div className="font-semibold text-gray-700 text-base">{expense.item}</div>
                      <div className="text-xs text-gray-500 flex gap-2">
                        <span>Date: {dateStr}</span>
                        <span>Time: {expense.Time}</span>
                      </div>
                      <div className=" text-gray-500 mt-1">
                        Paid by: <span className="font-semibold text-gray-700">{expense.PaidBy.name || 'Unknown'}</span>
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
    </motion.div>
  );
};

export default GroupExpense;
