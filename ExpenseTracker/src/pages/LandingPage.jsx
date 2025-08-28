import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'


const LandingPage = () => {
  const navigate = useNavigate()

  const handleClick = () =>{
    navigate('/Auth')
  }

  return (
    <div className="bg-white text-gray-800 font-sans">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 bg-gradient-to-br from-blue-100 to-purple-200"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Take Control of Your Finances
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl">
          Track expenses, split bills, and manage budgets — all in one place.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={handleClick} className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </motion.section>
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Easy to Use",
              desc: "Add expenses in seconds. No learning curve."
            },
            {
              title: "Group Tracking",
              desc: "Perfect for roommates, families, or trips."
            },
            {
              title: "Real-Time Insights",
              desc: "Visual reports that help you save better."
            }
          ].map(({ title, desc }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 text-center">
        <p>&copy; {new Date().getFullYear()} ExpenseTracker.</p>
      </footer>
    </div>
  )
}

export default LandingPage
