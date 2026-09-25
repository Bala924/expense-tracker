import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const ExpenseTable = ({ expenses, onEdit, onDelete, showActions = true }) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-3xl">
          💸
        </div>
        <p className="text-gray-700 font-semibold text-base">No expenses found</p>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Start tracking your expenses by adding your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              #
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              Description
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              Category
            </th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              Amount
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              Date
            </th>
            {showActions && (
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {expenses.map((expense, index) => (
            <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-100">
              <td className="py-3.5 px-4 text-sm text-gray-400">{index + 1}</td>
              <td className="py-3.5 px-4 text-sm font-medium text-gray-800 max-w-xs">
                {expense.description}
              </td>
              <td className="py-3.5 px-4">
                <span className={`badge ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </td>
              <td className="py-3.5 px-4 text-sm font-semibold text-gray-800 text-right">
                {formatCurrency(expense.amount)}
              </td>
              <td className="py-3.5 px-4 text-sm text-gray-500">{formatDate(expense.date)}</td>
              {showActions && (
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      id={`edit-expense-${expense.id}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      id={`delete-expense-${expense.id}`}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
                <p className="text-gray-400 text-xs mt-0.5">{formatDate(expense.date)}</p>
              </div>
              <p className="text-base font-bold text-gray-800 ml-3">{formatCurrency(expense.amount)}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`badge ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
              {showActions && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;
