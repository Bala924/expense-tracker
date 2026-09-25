import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { getTodayDate } from '../utils/formatters';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Others'];

const ExpenseForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: getTodayDate(),
  });
  const [errors, setErrors] = useState({});

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await onSubmit({
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
    });

    if (success) {
      setForm({ description: '', amount: '', category: '', date: getTodayDate() });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        Add New Expense
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="expense-description">Description</label>
          <input
            id="expense-description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Lunch at restaurant"
            className={`input-field ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="label" htmlFor="expense-amount">Amount (₹)</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`input-field ${errors.amount ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="label" htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`input-field ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="label" htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`input-field ${errors.date ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            id="add-expense-btn"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Adding...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Add Expense
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;
