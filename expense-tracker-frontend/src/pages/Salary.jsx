import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Edit3 } from 'lucide-react';
import { getUser, updateUser } from '../utils/auth';
import { updateSalary } from '../services/userService';
import { formatCurrency } from '../utils/formatters';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Salary = () => {
  const [user, setUserState] = useState(getUser());
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [salaryError, setSalaryError] = useState('');

  useEffect(() => {
    if (user) {
      setSalary(user.salary?.toString() || '');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalaryError('');
    setError('');
    setSuccess('');

    if (!salary || isNaN(salary) || parseFloat(salary) <= 0) {
      setSalaryError('Salary must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const res = await updateSalary(user.id, parseFloat(salary));
      const updatedUser = updateUser({ salary: res.data.salary });
      setUserState(updatedUser);
      setSuccess('Salary updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update salary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="page-title">Salary Management</h1>
        <p className="text-gray-500 text-sm mt-1">Update your monthly salary</p>
      </div>

      <div className="max-w-lg">
        {/* Current Salary Card */}
        <div className="card border border-indigo-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Current Monthly Salary</p>
              <p className="text-3xl font-bold text-indigo-700 mt-0.5">
                {formatCurrency(user?.salary)}
              </p>
            </div>
          </div>
        </div>

        {/* Update Salary Form */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Update Salary</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="new-salary">New Monthly Salary (₹)</label>
              <input
                id="new-salary"
                type="number"
                value={salary}
                onChange={(e) => {
                  setSalary(e.target.value);
                  setSalaryError('');
                }}
                placeholder="e.g. 50000"
                min="1"
                step="1"
                className={`input-field text-lg ${salaryError ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {salaryError && <p className="text-red-500 text-xs mt-1">{salaryError}</p>}
              <p className="text-gray-400 text-xs mt-2">
                This will update your salary which is used for balance calculations.
              </p>
            </div>

            <button
              type="submit"
              id="update-salary-btn"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Update Salary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-blue-700 text-sm font-medium mb-1">💡 How salary is used</p>
          <p className="text-blue-600 text-xs leading-relaxed">
            Your monthly salary is used to calculate your remaining balance on the dashboard.
            Formula: Balance = Salary - Total Expenses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Salary;
