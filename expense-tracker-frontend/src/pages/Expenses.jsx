import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { getUser } from '../utils/auth';
import { getExpensesByUser, addExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { EditExpenseModal, DeleteConfirmModal } from '../components/ExpenseModal';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Expenses = () => {
  const user = getUser();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpenseItem, setDeleteExpenseItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchExpenses = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await getExpensesByUser(user.id);
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (formData) => {
    setAddLoading(true);
    try {
      await addExpense({ ...formData, userId: user.id });
      await fetchExpenses();
      showSuccess('Expense added successfully!');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
      return false;
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSave = async (formData) => {
    if (!editExpense) return;
    setEditLoading(true);
    try {
      await updateExpense(editExpense.id, { ...formData, userId: user.id });
      await fetchExpenses();
      setEditExpense(null);
      showSuccess('Expense updated successfully!');
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
      showSuccess('Expense deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="page-title">Expenses</h1>
        <p className="text-gray-500 text-sm mt-1">Add, edit, and manage your expenses</p>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm animate-pulse">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add Expense Form */}
      <div className="mb-6">
        <ExpenseForm onSubmit={handleAddExpense} loading={addLoading} />
      </div>

      {/* Expense List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            All Expenses
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({expenses.length} total)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <Loading message="Loading expenses..." />
        ) : error && expenses.length === 0 ? (
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

      {/* Modals */}
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

export default Expenses;
