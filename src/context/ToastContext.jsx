import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-safe left-0 right-0 z-[9999] flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    levelup: 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
  };

  return (
    <div className={`${bgColors[toast.type] || 'bg-gray-800'} text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between w-full max-w-sm pointer-events-auto transition-all animate-bounce`}>
      <span className="font-semibold text-[15px]">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 opacity-70 hover:opacity-100 text-xl font-bold">
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
