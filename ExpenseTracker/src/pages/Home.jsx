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
import { AnimatePresence, motion } from 'motion/react'
import { SetExpense } from '../store/slicer/expenseSlice'
import { setBills } from '../store/slicer/billslice'

const Home = () => {

  const API = 'http://localhost:7000/'
  const dispatch = useDispatch()

  const open = useSelector((state) => state.navButton?.component)
  const user = useSelector((state) => state.user?.user)
  const expense = useSelector((state) => state.expense?.expense)
  const Current_Expense = useSelector((state) => state.Current_Expense?.Current_Expense)
  const navigate = useNavigate()


  useEffect(() => {
    const Get_Expense = async () => {
      try {
        const res = await fetch('http://localhost:7000/Home/expense', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const data = await res.json()
        dispatch(SetExpense(data.expenses))
      } catch (error) {
        console.log(error)
      }
    }

    if (user) {
      Get_Expense()
    }
  }, [])


  useEffect(() => {
    fetch(`{API}auth/verify-user`, {
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
        }
      })
      .catch(error => {
        console.log("Fetch error:", error)
      })
  }, [])

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`${API}getBill`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          method: 'GET',
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setBills(data.Bill));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchBills()
  }, [])



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
      </div>
    </div>
  )
}

export default Home
