import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setBills } from '../store/slicer/billslice';

const Bills = () => {
  const Bills = useSelector((state)=> state.Bills?.Bills)
  console.log(Bills)
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editBill, setEditBill] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();
  const API = 'http://localhost:7000/Home/';
  const now = Date.now();

  useEffect(() => {
    if (editBill) {
      reset({
        Description: editBill.Description,
        Price: editBill.Price,
        Date: editBill.Date ? editBill.Date.slice(0, 10) : '',
        Notes: editBill.Notes || '',
        Paid: editBill.Paid
      });
    } else {
      reset({
        Description: '',
        Price: '',
        Date: '',
        Notes: '',
        Paid: 'false'
      });
    }
  }, [editBill, reset]);
  
  
  const categorizeBills = useCallback((billsData) => {
    const upcoming = billsData.filter(bill => 
      bill.Paid === 'false' && new Date(bill.Date).getTime() > now
    )
    const pending = billsData.filter(bill => 
      bill.Paid === 'false' && new Date(bill.Date).getTime() <= now
    )
    const paid = billsData.filter(bill => bill.Paid === 'true');
    
    setUpcomingBills(upcoming);
    setPendingBills(pending);
    setPaidBills(paid);
  }, [now]);
  
  const fetchBills = useCallback(async () => {
    try {
      const res = await fetch(`${API}getBill`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'GET',
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setBills([...data.Bill]));
        categorizeBills(data.Bill);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, API, categorizeBills])
  
  useEffect(() => {
    fetchBills();
  }, [])
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = editBill ? `${API}UpdateBill` : `${API}CreateBill`;
      const method = editBill ? 'PUT' : 'POST';
      const body = editBill ? { ...data, _id: editBill._id } : data;
      
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: method,
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const result = await res.json();
        console.log(editBill ? "Bill Updated" : "Bill Created", result);
        fetchBills()
        setShowModal(false);
        setEditBill(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bill) => {
    setEditBill(bill)
    setShowModal(true)
  };

  const handleDelete = async (bill) => {
    if (!window.confirm('Delete this bill?')) return;
    try {
      const res = await fetch(`${API}deleteBill`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: bill._id })
      })
      if (res.ok) {
        fetchBills()
      }
    } catch (error) {
      console.log(error)
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', staggerChildren: 0.1 } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const BillCard = ({ bill, type, onEdit, onDelete }) => (
    <Motion.div
      key={bill._id}
      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
        type === 'upcoming' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
        type === 'pending' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
        'bg-green-50 border-green-200 hover:bg-green-100'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{bill.Description}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(bill)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(bill)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">₹{bill.Price}</p>
      <p className="text-sm text-gray-600">
        {new Date(bill.Date).toLocaleDateString()}
      </p>
      {bill.Notes && (
        <p className="text-sm text-gray-500 mt-1">{bill.Notes}</p>
      )}
    </Motion.div>
  );

  return (
    <Motion.div
      className="min-h-screen p-6 sm:p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-7xl mx-auto">
        <Motion.h1 
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </Motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Bills */}
          <Motion.div
            className="bg-white/70 min-h-[90vh] p-6 rounded-2xl flex flex-col shadow-xl border border-slate-200 backdrop-blur-sm"
            variants={cardVariants}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">📅</div>
              Upcoming Bills
            </h2>
            <div className="flex flex-col gap-3 min-h-60 max-h-[75vh] overflow-y-auto pr-1">
              <AnimatePresence>
                {upcomingBills.length > 0 ? (
                  upcomingBills.map((bill) => (
                    <BillCard
                      key={bill._id}
                      bill={bill}
                      type="upcoming"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <Motion.p 
                    className="text-gray-500 py-8 text-center" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    No upcoming bills
                  </Motion.p>
                )}
              </AnimatePresence>
            </div>
          </Motion.div>

          {/* Pending Bills */}
          <Motion.div
            className="bg-white/70 min-h-[90vh] p-6 rounded-2xl flex flex-col shadow-xl border border-slate-200 backdrop-blur-sm"
            variants={cardVariants}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm">⚠️</div>
              Pending Bills
            </h2>
            <div className="flex flex-col gap-3 min-h-60 max-h-[75vh] overflow-y-auto pr-1">
              <AnimatePresence>
                {pendingBills.length > 0 ? (
                  pendingBills.map((bill) => (
                    <BillCard
                      key={bill._id}
                      bill={bill}
                      type="pending"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <Motion.p 
                    className="text-gray-500 py-8 text-center" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    No pending bills
                  </Motion.p>
                )}
              </AnimatePresence>
            </div>
          </Motion.div>

          {/* Paid Bills & Add Bill */}
          <Motion.div
            className="bg-white/70 min-h-[90vh] p-6 rounded-2xl flex flex-col shadow-xl border border-slate-200 backdrop-blur-sm"
            variants={cardVariants}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✅</div>
              Paid Bills
            </h2>
            <div className="flex flex-col gap-3 min-h-3/4 max-h-[75vh] overflow-y-auto pr-1 mb-4">
              <AnimatePresence>
                {paidBills.length > 0 ? (
                  paidBills.map((bill) => (
                    <BillCard
                      key={bill._id}
                      bill={bill}
                      type="paid"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <Motion.p 
                    className="text-gray-500 py-8 text-center" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                  >
                    No paid bills
                  </Motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Add Bill Button */}
            <Motion.button
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + Add New Bill
            </Motion.button>
          </Motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <Motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Motion.div
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editBill ? 'Edit Bill' : 'Add New Bill'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register('Description', { required: 'Description is required' })}
                      placeholder="Bill Description"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    {errors.Description && (
                      <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Price', { required: 'Price is required' })}
                      placeholder="Amount"
                      type="number"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    {errors.Price && (
                      <p className="text-red-500 text-sm mt-1">{errors.Price.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Date', { required: 'Date is required' })}
                      type="date"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    {errors.Date && (
                      <p className="text-red-500 text-sm mt-1">{errors.Date.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Notes')}
                      placeholder="Notes (optional)"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        {...register('Paid')}
                        type="radio"
                        value="true"
                        className="text-blue-500"
                      />
                      <span>Paid</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        {...register('Paid')}
                        type="radio"
                        value="false"
                        className="text-blue-500"
                      />
                      <span>Unpaid</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditBill(null);
                      }}
                      className="flex-1 p-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : (editBill ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
};

export default Bills
