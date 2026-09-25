import { useState, useEffect } from 'react';
import { Wallet, TrendingDown, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { getUser } from '../utils/auth';
import { getDashboardSummary, getCategorySummary, getMonthlySummary } from '../services/expenseService';
import { formatCurrency, getCategoryChartColor } from '../utils/formatters';
import SummaryCard from '../components/SummaryCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Summary = () => {
  const user = getUser();
  const [summary, setSummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        getDashboardSummary(user.id),
        getCategorySummary(user.id),
        getMonthlySummary(user.id),
      ]);
      setSummary(summaryRes.data);
      setCategorySummary(categoryRes.data);
      setMonthlySummary(monthlyRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load summary data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = categorySummary.map((item) => ({
    name: item.category,
    value: parseFloat(item.amount),
    fill: getCategoryChartColor(item.category),
  }));

  if (loading) return (
    <div className="flex-1 p-6">
      <Loading message="Loading summary..." />
    </div>
  );

  if (error) return (
    <div className="flex-1 p-6">
      <ErrorMessage message={error} onRetry={fetchData} />
    </div>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="page-title">Financial Summary</h1>
        <p className="text-gray-500 text-sm mt-1">Complete overview of your financial health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Monthly Salary"
          amount={formatCurrency(summary?.totalSalary)}
          icon={Wallet}
          color="indigo"
        />
        <SummaryCard
          title="Total Expenses"
          amount={formatCurrency(summary?.totalExpense)}
          icon={TrendingDown}
          color="red"
        />
        <SummaryCard
          title="Balance"
          amount={formatCurrency(summary?.balance)}
          icon={TrendingUp}
          color={parseFloat(summary?.balance) >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pie Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Expense by Category</h2>
          </div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No expense data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
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

        {/* Bar Chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Monthly Trend</h2>
          </div>
          {monthlySummary.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No monthly data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlySummary} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Category Breakdown</h2>
        {categorySummary.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No expense data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                    Category
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                    Amount
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categorySummary.map((item) => {
                  const total = parseFloat(summary?.totalExpense) || 1;
                  const pct = ((parseFloat(item.amount) / total) * 100).toFixed(1);
                  return (
                    <tr key={item.category} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getCategoryChartColor(item.category) }}
                          />
                          <span className="text-sm font-medium text-gray-800">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-800 text-right">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: getCategoryChartColor(item.category),
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-100">
                  <td className="py-3.5 px-4 text-sm font-bold text-gray-900">Total</td>
                  <td className="py-3.5 px-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(summary?.totalExpense)}
                  </td>
                  <td className="py-3.5 px-4 text-sm font-bold text-gray-900 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
