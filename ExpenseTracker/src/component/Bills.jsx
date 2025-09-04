import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: "spring", stiffness: 60 },
  }),
};

const Bills = ({
  upcomingBills: initialUpcomingBills = [],
  paidBills: initialPaidBills = [],
  onAddBill = () => {},
  onBillClick = () => {},
}) => {
  const [upcomingBills, setUpcomingBills] = useState(initialUpcomingBills);
  const [paidBills, setPaidBills] = useState(initialPaidBills);
  const [showModal, setShowModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });

  const handleAddBill = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewBill({ name: '', amount: '', dueDate: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;
    const bill = {
      id: Date.now(),
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      status: 'pending',
    };
    setUpcomingBills((prev) => [...prev, bill]);
    setShowModal(false);
    setNewBill({ name: '', amount: '', dueDate: '' });
    if (onAddBill) onAddBill(bill);
  };

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
                  aria-label={`View details for ₹{bill.name}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{bill.name}</span>
                    <span className="text-sm text-gray-500">{bill.dueDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">₹{bill.amount}</div>
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
                  aria-label={`View details for ₹{bill.name}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{bill.name}</span>
                    <span className="text-sm text-gray-500">{bill.paidDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">₹{bill.amount}</div>
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
          onClick={handleAddBill}
          aria-label="Add a new bill"
        >
          + Add Bill
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <form className="bg-white p-6 rounded-lg shadow-lg w-80" onSubmit={handleCreateBill}>
              <h3 className="text-lg font-bold mb-4">Create New Bill</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Bill Name</label>
                <input
                  type="text"
                  name="name"
                  value={newBill.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newBill.amount}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newBill.dueDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-3 py-1 rounded bg-gray-200" onClick={handleModalClose}>Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Create</button>
              </div>
            </form>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Bills;
