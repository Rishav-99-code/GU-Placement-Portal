import React, { createContext, useContext, useState } from 'react';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from '../components/ui/toast';

const ToastContext = createContext({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastWrapper = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, description, variant = 'info', duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  React.useEffect(() => {
    const handleToast = (event) => {
      showToast(event.detail);
    };

    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastProvider>
        {children}
        <ToastViewport>
          {toasts.map((toast) => (
            <Toast key={toast.id} variant={toast.variant}>
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </Toast>
          ))}
        </ToastViewport>
      </ToastProvider>
    </ToastContext.Provider>
  );
};