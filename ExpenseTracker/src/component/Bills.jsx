import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setBills } from '../store/slicer/billslice';
import { cardVariants, containerVariants } from "../constants";

const API = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app';

// Constants
const DEFAULT_FORM_VALUES = {
  Description: '',
  Price: '',
  Date: '',
  Notes: '',
  Paid: 'false'
};

const BILL_TYPES = {
  UPCOMING: 'upcoming',
  PENDING: 'pending',
  PAID: 'paid'
};

const Bills = () => {
  const bills = useSelector((state) => state.Bills?.Bills || []);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editBill, setEditBill] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();

  // Memoize categorized bills instead of using state
  const { upcomingBills, pendingBills, paidBills } = useMemo(() => {
    const now = Date.now();
    const upcoming = [];
    const pending = [];
    const paid = [];

    bills.forEach(bill => {
      const billDate = new Date(bill.Date).getTime();
      const isUnpaid = bill.Paid === 'false';
      
      if (bill.Paid === 'true') {
        paid.push(bill);
      } else if (isUnpaid && billDate > now) {
        upcoming.push(bill);
      } else if (isUnpaid && billDate <= now) {
        pending.push(bill);
      }
    });

    return { upcomingBills: upcoming, pendingBills: pending, paidBills: paid };
  }, [bills]);

  // Reset form when editBill changes
  useEffect(() => {
    if (editBill) {
      reset({
        Description: editBill.Description || '',
        Price: editBill.Price || '',
        Date: editBill.Date ? editBill.Date.slice(0, 10) : '',
        Notes: editBill.Notes || '',
        Paid: editBill.Paid || 'false'
      });
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [editBill, reset]);
  
  const fetchBills = useCallback(async () => {
    try {
      const res = await fetch(`${API}/Home/getBill`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'GET',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch bills: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success && data.Bill) {
        dispatch(setBills(data.Bill));
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = editBill ? `${API}/Home/UpdateBill` : `${API}/Home/CreateBill`;
      const method = editBill ? 'PUT' : 'POST';
      const body = editBill ? { ...data, _id: editBill._id } : data;
      
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method,
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to ${editBill ? 'update' : 'create'} bill: ${res.status}`);
      }
      
      await fetchBills();
      setShowModal(false);
      setEditBill(null);
      reset(DEFAULT_FORM_VALUES);
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = useCallback((bill) => {
    setEditBill(bill);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (bill) => {
    if (!window.confirm('Delete this bill?')) return;
    
    try {
      const res = await fetch(`${API}/Home/deleteBill`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: bill._id })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete bill: ${res.status}`);
      }
      
      await fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  }, [fetchBills]);
  
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditBill(null);
    reset(DEFAULT_FORM_VALUES);
  }, [reset]);

  // Memoized BillCard component
  const BillCard = React.memo(({ bill, type, onEdit, onDelete }) => {
    const cardStyles = {
      [BILL_TYPES.UPCOMING]: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      [BILL_TYPES.PENDING]: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      [BILL_TYPES.PAID]: 'bg-green-50 border-green-200 hover:bg-green-100'
    };

    return (
      <Motion.div
        className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${cardStyles[type] || cardStyles[BILL_TYPES.PAID]}`}
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
              className="btn-link text-sm"
              aria-label={`Edit ${bill.Description}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(bill)}
              className="text-red-600 hover:text-red-800 text-sm transition-colors duration-300"
              aria-label={`Delete ${bill.Description}`}
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
  });

  BillCard.displayName = 'BillCard';

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
          {/* Bill Columns - Reusable structure */}
          {[
            { 
              type: BILL_TYPES.UPCOMING, 
              bills: upcomingBills, 
              title: 'Upcoming Bills', 
              icon: '📅', 
              iconBg: 'bg-blue-500',
              emptyMessage: 'No upcoming bills'
            },
            { 
              type: BILL_TYPES.PENDING, 
              bills: pendingBills, 
              title: 'Pending Bills', 
              icon: '⚠️', 
              iconBg: 'bg-yellow-500',
              emptyMessage: 'No pending bills'
            },
            { 
              type: BILL_TYPES.PAID, 
              bills: paidBills, 
              title: 'Paid Bills', 
              icon: '✅', 
              iconBg: 'bg-green-500',
              emptyMessage: 'No paid bills',
              showAddButton: true
            }
          ].map((section) => (
            <Motion.div
              key={section.type}
              className="bg-white/70 min-h-[90vh] p-6 rounded-2xl flex flex-col shadow-xl border border-slate-200 backdrop-blur-sm"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${section.iconBg} flex items-center justify-center text-white text-sm`}>
                  {section.icon}
                </div>
                {section.title}
              </h2>
              <div className={`flex flex-col gap-3 min-h-60 max-h-[75vh] overflow-y-auto pr-1 ${section.showAddButton ? 'mb-4' : ''}`}>
                <AnimatePresence>
                  {section.bills.length > 0 ? (
                    section.bills.map((bill) => (
                      <BillCard
                        key={bill._id}
                        bill={bill}
                        type={section.type}
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
                      {section.emptyMessage}
                    </Motion.p>
                  )}
                </AnimatePresence>
              </div>
              {section.showAddButton && (
                <Motion.button
                  className="btn-primary"
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  + Add New Bill
                </Motion.button>
              )}
            </Motion.div>
          ))}
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
                      className="input-field-gray p-3 focus:border-blue-500"
                    />
                    {errors.Description && (
                      <p className="error-text">{errors.Description.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Price', { required: 'Price is required' })}
                      placeholder="Amount"
                      type="number"
                      step="0.01"
                      className="input-field-gray p-3 focus:border-blue-500"
                    />
                    {errors.Price && (
                      <p className="error-text">{errors.Price.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Date', { required: 'Date is required' })}
                      type="date"
                      className="input-field-gray p-3 focus:border-blue-500"
                    />
                    {errors.Date && (
                      <p className="error-text">{errors.Date.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('Notes')}
                      placeholder="Notes (optional)"
                      className="input-field-gray p-3 focus:border-blue-500"
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
                      onClick={handleCloseModal}
                      className="btn-secondary-slate flex-1 p-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex-1 p-3"
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
