import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet, TrendingDown, TrendingUp, ArrowRight,
  PieChart as PieChartIcon, BarChart2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { getUser } from '../utils/auth';
import { getDashboardSummary, getCategorySummary, getMonthlySummary, getRecentExpenses } from '../services/expenseService';
import { formatCurrency, formatDate, getCategoryColor, getCategoryChartColor } from '../utils/formatters';
import SummaryCard from '../components/SummaryCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const user = getUser();
  const [summary, setSummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [summaryRes, categoryRes, monthlyRes, recentRes] = await Promise.all([
        getDashboardSummary(user.id),
        getCategorySummary(user.id),
        getMonthlySummary(user.id),
        getRecentExpenses(user.id),
      ]);
      setSummary(summaryRes.data);
      setCategorySummary(categoryRes.data);
      setMonthlySummary(monthlyRes.data);
      setRecentExpenses(recentRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const pieData = categorySummary.map((item) => ({
    name: item.category,
    value: parseFloat(item.amount),
    fill: getCategoryChartColor(item.category),
  }));

  if (loading) return (
    <div className="flex-1 p-6">
      <Loading message="Loading dashboard..." />
    </div>
  );

  if (error) return (
    <div className="flex-1 p-6">
      <ErrorMessage message={error} onRetry={fetchDashboardData} />
    </div>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm">{getGreeting()},</p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Here's your financial overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Monthly Salary"
          amount={formatCurrency(summary?.totalSalary)}
          icon={Wallet}
          color="indigo"
          subtext="This month's income"
        />
        <SummaryCard
          title="Total Expenses"
          amount={formatCurrency(summary?.totalExpense)}
          icon={TrendingDown}
          color="red"
          subtext="Total spent so far"
        />
        <SummaryCard
          title="Balance"
          amount={formatCurrency(summary?.balance)}
          icon={TrendingUp}
          color={parseFloat(summary?.balance) >= 0 ? 'green' : 'red'}
          subtext="Remaining balance"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Category Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Expense by Category</h2>
          </div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No expense data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: '12px', color: '#64748b' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Monthly Expenses</h2>
          </div>
          {monthlySummary.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No monthly data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlySummary} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => val.slice(0, 3)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recent Expenses</h2>
          <Link
            to="/history"
            id="view-all-expenses-link"
            className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <span className="text-3xl">💸</span>
            <p className="text-gray-500 text-sm">No expenses yet. Start tracking!</p>
            <Link to="/expenses" className="btn-primary text-sm py-2 px-4">
              Add Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ backgroundColor: getCategoryChartColor(expense.category) + '20' }}
                  >
                    {expense.category === 'Food' ? '🍔' :
                      expense.category === 'Travel' ? '✈️' :
                      expense.category === 'Shopping' ? '🛍️' :
                      expense.category === 'Bills' ? '📄' :
                      expense.category === 'Education' ? '📚' : '💰'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{expense.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(expense.amount)}</p>
                  <span className={`badge text-xs ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
