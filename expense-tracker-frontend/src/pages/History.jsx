import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, CheckCircle } from 'lucide-react';
import { getUser } from '../utils/auth';
import { getFilteredExpenses, updateExpense, deleteExpense } from '../services/expenseService';
import { EditExpenseModal, DeleteConfirmModal } from '../components/ExpenseModal';
import ExpenseTable from '../components/ExpenseTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Others'];

const History = () => {
  const user = getUser();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    fromDate: '',
    toDate: '',
  });
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpenseItem, setDeleteExpenseItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const res = await getFilteredExpenses(user.id, params);
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expense history.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchExpenses();
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [fetchExpenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: 'All', fromDate: '', toDate: '' });
  };

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.fromDate || filters.toDate;

  const handleEditSave = async (formData) => {
    if (!editExpense) return;
    setEditLoading(true);
    try {
      await updateExpense(editExpense.id, { ...formData, userId: user.id });
      await fetchExpenses();
      setEditExpense(null);
      showSuccess('Expense updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expense.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteExpenseItem) return;
    setDeleteLoading(true);
    try {
      await deleteExpense(deleteExpenseItem.id, user.id);
      await fetchExpenses();
      setDeleteExpenseItem(null);
      showSuccess('Expense deleted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="page-title">Expense History</h1>
        <p className="text-gray-500 text-sm mt-1">Search and filter all your past expenses</p>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-700">Search & Filter</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              id="clear-filters-btn"
              className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="history-search"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search description..."
              className="input-field pl-9"
            />
          </div>

          <select
            id="history-category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div>
            <input
              id="history-from-date"
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="From date"
            />
          </div>

          <div>
            <input
              id="history-to-date"
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="To date"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Expenses
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({expenses.length} result{expenses.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <Loading message="Loading history..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchExpenses} />
        ) : (
          <ExpenseTable
            expenses={expenses}
            onEdit={(expense) => setEditExpense(expense)}
            onDelete={(expense) => setDeleteExpenseItem(expense)}
            showActions={true}
          />
        )}
      </div>

      <EditExpenseModal
        expense={editExpense}
        onSave={handleEditSave}
        onClose={() => setEditExpense(null)}
        loading={editLoading}
      />
      <DeleteConfirmModal
        expense={deleteExpenseItem}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteExpenseItem(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default History;
