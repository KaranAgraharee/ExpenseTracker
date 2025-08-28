import React from "react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: "spring", stiffness: 60 },
  }),
};

const Bills = ({
  upcomingBills = [],
  paidBills = [],
  onAddBill = () => {},
  onBillClick = () => {},
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 grid gap-8 md:grid-cols-3" aria-label="Bills Overview">
      {/* Upcoming Bills */}
      <motion.section
        className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={sectionVariants}
        aria-label="Upcoming Bills"
      >
        <h2 className="text-lg font-semibold mb-4" id="upcoming-bills-title">Upcoming Bills</h2>
        <ul aria-labelledby="upcoming-bills-title" className="flex-1 space-y-3">
          {upcomingBills.length === 0 ? (
            <li className="text-gray-400">No upcoming bills</li>
          ) : (
            upcomingBills.map((bill, idx) => (
              <li key={bill.id || idx}>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => onBillClick(bill)}
                  aria-label={`View details for ${bill.name}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{bill.name}</span>
                    <span className="text-sm text-gray-500">{bill.dueDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">${bill.amount}</div>
                </button>
              </li>
            ))
          )}
        </ul>
      </motion.section>

      {/* Paid Bills */}
      <motion.section
        className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={sectionVariants}
        aria-label="Paid Bills"
      >
        <h2 className="text-lg font-semibold mb-4" id="paid-bills-title">Bills Paid</h2>
        <ul aria-labelledby="paid-bills-title" className="flex-1 space-y-3">
          {paidBills.length === 0 ? (
            <li className="text-gray-400">No bills paid</li>
          ) : (
            paidBills.map((bill, idx) => (
              <li key={bill.id || idx}>
                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => onBillClick(bill)}
                  aria-label={`View details for ${bill.name}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{bill.name}</span>
                    <span className="text-sm text-gray-500">{bill.paidDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">${bill.amount}</div>
                </button>
              </li>
            ))
          )}
        </ul>
      </motion.section>

      {/* Add Bill */}
      <motion.section
        className="bg-blue-50 rounded-lg shadow-md p-6 flex flex-col items-center justify-center"
        initial="hidden"
        animate="visible"
        custom={2}
        variants={sectionVariants}
        aria-label="Add Bill"
      >
        <h2 className="text-lg font-semibold mb-4">Add Bill</h2>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onAddBill}
          aria-label="Add a new bill"
        >
          + Add Bill
        </button>
      </motion.section>
    </div>
  );
};

export default Bills;
