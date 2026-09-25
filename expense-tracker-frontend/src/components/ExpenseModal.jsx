import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { getTodayDate } from '../utils/formatters';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Others'];

// Edit Modal
export const EditExpenseModal = ({ expense, onSave, onClose, loading }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: getTodayDate(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description || '',
        amount: expense.amount ? expense.amount.toString() : '',
        category: expense.category || '',
        date: expense.date || getTodayDate(),
      });
      setErrors({});
    }
  }, [expense]);

  if (!expense) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-animate">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Edit Expense</h2>
          <button
            onClick={onClose}
            id="close-edit-modal"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label" htmlFor="edit-description">Description</label>
            <input
              id="edit-description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="label" htmlFor="edit-amount">Amount (₹)</label>
            <input
              id="edit-amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`input-field ${errors.amount ? 'border-red-400' : ''}`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="label" htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'border-red-400' : ''}`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="label" htmlFor="edit-date">Date</label>
            <input
              id="edit-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`input-field ${errors.date ? 'border-red-400' : ''}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              id="cancel-edit-btn"
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-edit-btn"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
export const DeleteConfirmModal = ({ expense, onConfirm, onClose, loading }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm modal-animate">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Expense</h2>
          <p className="text-gray-500 text-sm mb-1">
            Are you sure you want to delete this expense?
          </p>
          <p className="text-gray-700 font-semibold text-sm bg-gray-50 rounded-lg py-2 px-3 mt-3">
            "{expense.description}"
          </p>
          <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            id="cancel-delete-btn"
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            id="confirm-delete-btn"
            disabled={loading}
            className="btn-danger flex-1"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
