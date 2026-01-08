/**
 * API Utility Functions
 * Centralized API calls for better code organization and reusability
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app';

/**
 * Generic API fetch wrapper with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Bills API
 */
export const billsAPI = {
  getAll: () => apiRequest('/Home/getBill', { method: 'GET' }),
  
  create: (billData) => apiRequest('/Home/CreateBill', {
    method: 'POST',
    body: JSON.stringify(billData),
  }),
  
  update: (billData) => apiRequest('/Home/UpdateBill', {
    method: 'PUT',
    body: JSON.stringify(billData),
  }),
  
  delete: (billId) => apiRequest('/Home/deleteBill', {
    method: 'DELETE',
    body: JSON.stringify({ _id: billId }),
  }),
};

/**
 * Expenses API
 */
export const expensesAPI = {
  getAll: () => apiRequest('/Home/expense', { method: 'GET' }),
  
  create: (expenseData) => apiRequest('/Home/expense', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  }),
  
  update: (expenseData) => apiRequest('/Home/expense', {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  }),
};

/**
 * Contacts API
 */
export const contactsAPI = {
  getAll: () => apiRequest('/Home/contacts', { method: 'GET' }),
};

/**
 * Groups API
 */
export const groupsAPI = {
  getAll: () => apiRequest('/Home/group', { method: 'GET' }),
  
  create: (groupData) => apiRequest('/Home/group', {
    method: 'POST',
    body: JSON.stringify(groupData),
  }),
};

/**
 * Auth API
 */
export const authAPI = {
  verifyUser: () => apiRequest('/auth/verify-user', { method: 'GET' }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  signup: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => apiRequest('/auth/logout', { method: 'GET' }),
  
  sendOTP: (email) => apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  verifyOTP: (otpData) => apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(otpData),
  }),
  
  setBudget: (amount) => apiRequest('/auth/set_budget', {
    method: 'POST',
    body: JSON.stringify(amount),
  }),
};

export default { billsAPI, expensesAPI, contactsAPI, groupsAPI, authAPI };

