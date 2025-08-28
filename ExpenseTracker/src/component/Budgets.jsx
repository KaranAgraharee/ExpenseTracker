import React, { useState, useEffect } from 'react'

const Budgets = () => {
  const [weeklyBudget, setWeeklyBudget] = useState(500);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  // State for input fields
  const [weeklyInput, setWeeklyInput] = useState(weeklyBudget);
  const [monthlyInput, setMonthlyInput] = useState(monthlyBudget);

  // Activity board state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses for activity board
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:7000/home/expense', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.expenses)) {
          setExpenses(data.expenses);
        } else {
          setError('Failed to fetch expenses');
        }
      } catch {
        setError('Error fetching expenses');
      }
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  // Mock expenses for budget progress
  const weeklyExpenses = 320;
  const monthlyExpenses = 1450;

  // Handlers
  const handleWeeklyBudgetUpdate = (e) => {
    e.preventDefault();
    setWeeklyBudget(Number(weeklyInput));
  };
  const handleMonthlyBudgetUpdate = (e) => {
    e.preventDefault();
    setMonthlyBudget(Number(monthlyInput));
  };

  // Progress calculations
  const weeklyProgress = Math.min((weeklyExpenses / weeklyBudget) * 100, 100);
  const monthlyProgress = Math.min((monthlyExpenses / monthlyBudget) * 100, 100);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200/45 via-gray-300/25 to-gray-400/15 flex flex-col items-center py-10">
      
      <h1 className="text-3xl font-bold mb-8 mt-4">Budgets Overview</h1>
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 justify-center items-start">
        {/* Left: Budgets */}
        <div className="flex flex-col gap-8 w-full md:w-1/2">
          {/* Weekly Budget */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Weekly Budget</h2>
            <form onSubmit={handleWeeklyBudgetUpdate} className="flex gap-2 mb-4">
              <input
                type="number"
                className="border rounded px-2 py-1 w-32"
                value={weeklyInput}
                min={0}
                onChange={e => setWeeklyInput(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Set</button>
            </form>
            <div className="mb-2">Spent: <span className="font-semibold">${weeklyExpenses}</span> / <span className="font-semibold">${weeklyBudget}</span></div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${weeklyProgress < 100 ? 'bg-blue-400' : 'bg-red-400'}`}
                style={{ width: `${weeklyProgress}%` }}
              ></div>
            </div>
            {weeklyProgress >= 100 && <div className="text-red-500 mt-2">Budget exceeded!</div>}
          </div>
          {/* Monthly Budget */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>
            <form onSubmit={handleMonthlyBudgetUpdate} className="flex gap-2 mb-4">
              <input
                type="number"
                className="border rounded px-2 py-1 w-32"
                value={monthlyInput}
                min={0}
                onChange={e => setMonthlyInput(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Set</button>
            </form>
            <div className="mb-2">Spent: <span className="font-semibold">${monthlyExpenses}</span> / <span className="font-semibold">${monthlyBudget}</span></div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${monthlyProgress < 100 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>
            {monthlyProgress >= 100 && <div className="text-red-500 mt-2">Budget exceeded!</div>}
          </div>
        </div>
        {/* Right: Activity Board */}
        <div className="w-full md:w-1/2">
          <div className="w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Activity Board</h2>
            {loading ? (
              <div className="text-gray-500">Loading activity...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : expenses.length === 0 ? (
              <div className="text-gray-500">No expenditures or bills found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp, idx) => (
                      <tr key={exp._id || idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{exp.Item}</td>
                        <td className="px-4 py-2">${exp.Price}</td>
                        <td className="px-4 py-2">{exp.Date ? new Date(exp.Date).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-2">{exp.Time || '-'}</td>
                        <td className="px-4 py-2 text-green-600 font-semibold">Paid</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Budgets
