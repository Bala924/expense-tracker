const SummaryCard = ({ title, amount, icon: Icon, color, subtext }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      border: 'border-indigo-100',
      amount: 'text-indigo-700',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-100',
      amount: 'text-green-700',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100',
      amount: 'text-red-600',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
      amount: 'text-amber-700',
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`card border ${c.border} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${c.amount}`}>{amount}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
