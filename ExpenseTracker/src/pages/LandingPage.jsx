import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { landingPage, landingPage_cards } from "../constants";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-gradient-to-br bg-[url('/background.jpg')] bg-cover"
      >
        <span className="mb-4 px-4 py-1 text-white  bg-orange-300/40 rounded-full text-sm">
          Built for students, flatmates & shared expenses
        </span>

        <h1 className="text-4xl text-gray-500 md:text-6xl font-bold leading-tight max-w-4xl">
          Stop Arguing About Money.  
          <span className="block text-orange-600">Track & Split Expenses Effortlessly.</span>
        </h1>

        <p className="text-lg md:text-xl text-white mt-6 max-w-2xl">
          Track daily expenses, split bills fairly, and know exactly who owes whom —  
          no spreadsheets, no confusion.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/Auth")}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition text-lg"
          >
            Start Tracking Free
          </button>

        </div>
      </motion.section>

      {/* FEATURES */}
      <section className="py-20 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Everything You Need — Nothing You Don't
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {landingPage.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {landingPage_cards.map((item, i) => (
            <div key={i}>
              <div className="text-5xl font-bold text-orange-500 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-6 md:px-20 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Designed for Real-Life Money Problems
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Whether you're managing hostel expenses, shared rent, or trip budgets —
          this tool keeps things transparent and stress-free.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Take Control of Your Money Today
        </h2>
        <p className="text-lg mb-8 opacity-90">
          It's free to start. No credit card required.
        </p>
        <button
          onClick={() => navigate("/Auth")}
          className="px-10 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
        © {new Date().getFullYear()} ExpenseTracker. Built with ❤️ for shared living.
      </footer>
    </div>
  );
};

export default LandingPage;
