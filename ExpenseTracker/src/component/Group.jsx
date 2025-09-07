import React, { useEffect } from 'react'
import { Groups } from '../store/slicer/GroupSlice'
import { useDispatch, useSelector } from 'react-redux'
import CreateGrp from './CreateGroup'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { SetCurrent_Group } from '../store/slicer/CurrentGroup'
import { SetCurrent_Expense } from '../store/slicer/CurrentExpense'
import GroupExpense from './GroupExpense'

const Group = () => {
  const dispatch = useDispatch()
  const Group = useSelector((state) => state.Group?.Group)
  const Current_Group = useSelector((state) => state.Current_Group?.Current_Group)
  const Current_Expense = useSelector((state) => state.Current_Expense?.Current_Expense)
  const Expense = useSelector((state) => state.expense?.expense)
  const user = useSelector((state)=> state.user?.user)


  useEffect(() => {
    const groupData = async () => {
      const res = await fetch('http://localhost:7000/Home/group', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await res.json();
      if (data.success && data.Group) {
        dispatch(Groups(data.Group))
      } else {
        dispatch(Groups(null))
      }
    }
    groupData()
  }, [dispatch])

  const CurrentGroup = (e) => {
    try {
      const Show = e.currentTarget.id
      
      const selectedGroup = Group.find((grp) => String(grp._id) === String(Show))
      
      const GroupExpense = Expense.filter(
        (exp) => String(exp.Group?._id) === String(Show)
      )   
      console.log(GroupExpense, Show)
      dispatch(SetCurrent_Expense(GroupExpense))


      if (!selectedGroup) {
        console.log("No group found with id:", Show, "in", Group)
      }

      dispatch(SetCurrent_Group(selectedGroup))
    } catch (error) {
      console.log(error)
    }

  }
  console.log(Expense)
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', staggerChildren: 0.1 } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3 } }
  }
  const groupCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  }

  return (
    <Motion.div
      className='min-h-screen p-6 sm:p-8 text-white'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group List */}
        <Motion.div
          className='bg-slate-800/70 min-h-[60vh] w-full p-4 rounded-2xl flex flex-col shadow-xl border border-slate-700 backdrop-blur-sm'
          variants={groupCardVariants}
        >
          <h1 className='text-2xl font-bold font-sans rounded-lg py-2 mb-2'>Groups</h1>
          <div className="flex flex-col gap-3 min-h-60 max-h-[75vh] mb-4 overflow-y-auto pr-1">
            <AnimatePresence>
              {Array.isArray(Group) && Group.length > 0 ? (
                Group.map((Grp) => (
                  <Motion.button
                    id={Grp._id}
                    key={Grp._id}
                    className={`w-full text-left p-3 rounded-xl border transition bg-slate-700/60 border-slate-600 hover:bg-slate-700`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.05 }}
                    onClick={CurrentGroup}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold'>
                        {(Grp.GroupName?.[0] || 'G').toUpperCase()}
                      </div>
                      <span className="font-semibold text-lg truncate">{Grp.GroupName}
                      </span>
                    </div>
                  </Motion.button>
                ))
              ) : (
                <Motion.p className="text-slate-300 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No groups found.
                </Motion.p>
              )}
            </AnimatePresence>
            <CreateGrp />
          </div>
        </Motion.div>
        <Motion.div
          className='bg-slate-800/70 min-h-[60vh] w-full p-4 rounded-2xl flex flex-col shadow-xl border border-slate-700 backdrop-blur-sm'
          variants={groupCardVariants}
        >
          <GroupExpense
            group={Current_Group}
            expenses={Current_Expense}
            user={user}
          />
        </Motion.div>
      </div>
    </Motion.div>
  )
}

export default Group
