// Format number as Indian Rupee
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date from YYYY-MM-DD to "09 Aug 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get category badge color classes
export const getCategoryColor = (category) => {
  const colors = {
    Food: 'bg-orange-100 text-orange-700',
    Travel: 'bg-blue-100 text-blue-700',
    Shopping: 'bg-pink-100 text-pink-700',
    Bills: 'bg-red-100 text-red-700',
    Education: 'bg-green-100 text-green-700',
    Others: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

// Get chart fill color for category
export const getCategoryChartColor = (category) => {
  const colors = {
    Food: '#f97316',
    Travel: '#3b82f6',
    Shopping: '#ec4899',
    Bills: '#ef4444',
    Education: '#22c55e',
    Others: '#94a3b8',
  };
  return colors[category] || '#94a3b8';
};
