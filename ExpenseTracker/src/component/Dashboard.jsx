import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { DashboardcardVariants } from '../constants'


const Dashboard = () => {

    const expenses = useSelector((state) => state.expense.expense)
    const user = useSelector((state) => state.user.user)
    const userExpenses = expenses.filter(exp => exp.PaidBy?._id === user?._id)
    const otherPersonExpenses = expenses.filter(exp => exp.PaidBy?._id !== user?._id)
    
    const thisMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.Date)
        const now = new Date()
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear() && exp.PaidBy._id === user._id
    }).reduce((sum, exp) => sum + (exp.Price || 0), 0)

    const lastMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.Date)
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
        return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear() && exp.PaidBy._id === user._id
    }).reduce((sum, exp) => sum + (exp.Price || 0), 0)


    const totalExpenses = userExpenses.reduce((sum, exp) => sum + (exp.Price || 0), 0)

    const NetTotal = totalExpenses - otherPersonExpenses.reduce((sum, exp) => sum + (exp.Price || 0), 0)

    const recentExpenses = expenses

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50/25 to-indigo-100/15 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="max-w-7xl mx-auto"
            >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Total Expenses',
                            value: `₹${totalExpenses.toFixed(2)}`,
                            color: 'from-red-500 to-pink-500',
                            icon: '💰',
                        },
                        {
                            title: 'This Month',
                            value: `₹${thisMonthExpenses.toFixed(2)}`,
                            color: 'from-green-500 to-emerald-500',
                            icon: '📅',
                        },
                        {
                            title: 'Last Month',
                            value: `₹${lastMonthExpenses.toFixed(2)}`,
                            color: 'from-purple-500 to-violet-500',
                            icon: '📊',
                        },
                        {
                            title: 'Budget',
                            value: `₹${NetTotal.toFixed(2)}`,
                            color: 'from-orange-500 to-red-500',
                            icon: '🧑',
                        }
                    ].map((card, i) => (
                        <motion.div
                            key={card.title}
                            custom={i + 1}
                            variants={DashboardcardVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl`}>
                                    {card.icon}
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    {card.change}
                                </span>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <motion.div
                        custom={5}
                        variants={DashboardcardVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
                            <button className="btn-link font-medium">View All</button>
                        </div>
                        <div className='h-[50vh] overflow-y-scroll'>
                            {recentExpenses.length === 0 ? (
                                <div className="text-center py-12 ">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses yet</h3>
                                    <p className="text-gray-500">Start tracking your expenses to see them here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentExpenses.map((expense, index) => (
                                        <motion.div
                                            key={expense._id || index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">
                                                    {expense.Item?.charAt(0)?.toUpperCase() || 'E'}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{expense.Item || 'Expense'}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {expense.Date ? new Date(expense.Date).toLocaleDateString() : 'No date'} • {expense.Time || 'No time'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">₹{expense.Price || 0}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions & Stats */}
                    <motion.div
                        custom={6}
                        variants={DashboardcardVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                                    📊 View Reports
                                </button>
                                <button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                                    🎯 Set Budget
                                </button>
                                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                                    📱 Export Data
                                </button>
                            </div>
                        </div>

                        {/* Monthly Overview */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">This Month</span>
                                        <span className="font-semibold">₹{thisMonthExpenses.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((thisMonthExpenses / 2000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Last Month</span>
                                        <span className="font-semibold">₹{lastMonthExpenses.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((lastMonthExpenses / 2000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Dashboard