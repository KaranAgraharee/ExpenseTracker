import React, { useState, useEffect } from 'react'

const Budgets = () => {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user info (budget, totalSpending)
        const userRes = await fetch('http://localhost:7000/auth/verify-user', {
          credentials: 'include',
        });
        const userData = await userRes.json();
        if (userData.success !== false) {
          setBudget(userData.budget || 0);
          setBudgetInput(userData.budget || 0);
          setTotalSpending(userData.totalSpending || 0);
        }
        // Fetch expenses for activity board
        const expRes = await fetch('http://localhost:7000/home/expense', {
          credentials: 'include',
        });
        const expData = await expRes.json();
        if (expData.success && Array.isArray(expData.expenses)) {
          setExpenses(expData.expenses);
        } else {
          setError('Failed to fetch expenses');
        }
      } catch {
        setError('Error fetching data');
      }
      setLoading(false);
    };
    fetchUserAndExpenses();
  }, []);

  // Handler for updating budget
  const handleBudgetUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:7000/auth/set-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ budget: budgetInput }),
      });
      const data = await res.json();
      if (data.success) {
        setBudget(budgetInput);
      }
    } catch {
      setError('Error updating budget');
    }
  };

  // Progress calculation
  const progress = budget > 0 ? Math.min((totalSpending / budget) * 100, 100) : 0;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200/45 via-gray-300/25 to-gray-400/15 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 mt-4">Budgets Overview</h1>
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 justify-center items-start">
        {/* Left: Budgets */}
        <div className="flex flex-col gap-8 w-full md:w-1/2">
          {/* Budget */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Your Budget</h2>
            <form onSubmit={handleBudgetUpdate} className="flex gap-2 mb-4">
              <input
                type="number"
                className="border rounded px-2 py-1 w-32"
                value={budgetInput}
                min={0}
                onChange={e => setBudgetInput(Number(e.target.value))}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Set</button>
            </form>
            <div className="mb-2">Spent: <span className="font-semibold">${Math.round(totalSpending)}</span> / <span className="font-semibold">${Math.round(budget)}</span></div> <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${progress < 100 ? 'bg-blue-400' : 'bg-red-400'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {progress >= 100 && <div className="text-red-500 mt-2">Budget exceeded!</div>}
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
                    {expenses.sort((a, b) => new Date(expenses.Date) - new Date(Date.now())).map((exp, idx) => (
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
