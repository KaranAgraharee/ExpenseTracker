import React, { useEffect } from 'react'
import Navbar from '../component/Navbar'
import Dashboard from '../component/Dashboard'
import Budgets from '../component/Budgets'
import Contact from '../component/Contact'
import Group from '../component/Group'
import { Open } from '../store/slicer/navButton'
import { useSelector } from 'react-redux'
import Bills from '../component/Bills'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slicer/userSlice'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { SetExpense } from '../store/slicer/expenseSlice'
import { setBills } from '../store/slicer/billslice'
import { setBudget } from '../store/slicer/Budgetslice'

const API = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app'

const Home = () => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.navButton?.component)
  const user = useSelector((state) => state.user?.user)
  const Current_Expense = useSelector((state) => state.Current_Expense?.Current_Expense)
  const navigate = useNavigate()
  useEffect(() => {
    fetch(`${API}/auth/verify-user`, {
      method: "GET",
      credentials: 'include'
    })
    .then(res => {
      if (res.status === 401) {
        console.log("Not logged in")
        navigate('/Auth')
      } else if (res.status === 403) {
        console.log("Invalid token")
        navigate('/Auth')
      } else if (res.status === 500) {
        console.log("Error! User not found")
        navigate('/Auth')
      } else {
        return res.json()
        }
      })
      .then(data => {
        if (data) {
          dispatch(setUser(data))
          dispatch(setBudget(data.budget))
        }
      })
      .catch(error => {
        console.log("Fetch error:", error)
      })
    }, [navigate, dispatch])
    
    useEffect(() => {
      const Get_Expense = async () => {
        try {
          const res = await fetch(`${API}/Home/expense`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          const data = await res.json()
          console.log('Expenses fetched:', data)
          if (data.success && data.expenses) {
            dispatch(SetExpense(data.expenses))
          } else {
            console.error('Failed to fetch expenses:', data.message)
          }
        } catch (error) {
          console.error('Error fetching expenses:', error)
        }
      }

      if (user) {
        Get_Expense()
      }
    }, [user, dispatch, API])
    
    
    
    useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`${API}/Home/getBill`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json();
        if (data.success && data.Bill) {
          const B = [...data.Bill]
          dispatch(setBills(B))
        } else {
          console.error('Failed to fetch bills:', data.message)
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    }
    
    if (user) {
      fetchBills()
    }
  }, [user, dispatch, API])
  const Logout = async () => {
    try {
      const res= await fetch(`${API}/auth/logout`, {
        method: "GET",
        credentials: 'include'
      })
      if (res.ok) {
        navigate('/Auth', { replace: true }) 
        return console.log('logout sucessFully')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="bg-[url('/background.jpg')] bg-cover min-h-screen w-full relative">
      {/* Navbar with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute left-4 top-10 z-10"
      >
        <Navbar />
      </motion.div>

      {/* Main Content Area with proper spacing */}
      <div className="ml-28 sm:ml-32 md:ml-36">
        {/* Component Transitions with AnimatePresence */}
        <AnimatePresence mode="wait">
          {open === 'Dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Dashboard />
            </motion.div>
          )}
          {open === 'Budgets' && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Budgets />
            </motion.div>
          )}
          {open === 'Contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Contact />
            </motion.div>
          )}
          {open === 'Group' && (
            <motion.div
              key="group"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Group />
            </motion.div>
          )}
          {open === 'Bills' && (
            <motion.div
              key="bills"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Bills />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={Logout}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className='fixed top-4 right-6 z-20 group flex  items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 shadow-lg shadow-teal-900/20 ring-1 ring-white/10 hover:from-red-500 hover:to-emerald-500 text-white'
        >
          <span className='text-sm font-semibold tracking-wide'>Logout</span>
          <motion.img
            src="/icon/logout1.png"
            width='28px'
            alt="logout"
            className='pointer-events-none select-none'
            whileHover={{ rotate: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
        </motion.button>
      </div>
    </div>
  )
}

export default Home
