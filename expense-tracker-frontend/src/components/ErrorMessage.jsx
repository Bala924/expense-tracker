import { AlertCircle, WifiOff } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  const isConnectionError = message && message.includes('connect');

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
        {isConnectionError ? (
          <WifiOff className="w-8 h-8 text-red-400" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-400" />
        )}
      </div>
      <div className="text-center max-w-sm">
        <p className="text-gray-800 font-semibold text-base mb-1">
          {isConnectionError ? 'Connection Failed' : 'Something went wrong'}
        </p>
        <p className="text-gray-500 text-sm">{message}</p>
        {isConnectionError && (
          <p className="text-gray-400 text-xs mt-2">
            Please make sure Spring Boot is running on port 8080
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-sm py-2 px-4"
          id="retry-btn"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
