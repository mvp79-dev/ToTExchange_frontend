import { createContext, useContext, useState } from "react";
import ToastList from "./ToastList/inex";
import { IToastCustom, IToastPosition } from "./interface";

interface IToastContext {
  showToast: (toast: IToastCustom) => void;
  removeToast: (id: number) => void;
}

export const useToastCustom = () => useContext(ToastContext);

const ToastContext = createContext<IToastContext>({
  showToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }: { children: any }) => {
  const [toasts, setToasts] = useState<IToastCustom[]>([]);

  const showToast = (toast: IToastCustom) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        showToast: showToast,
        removeToast: removeToast,
      }}
    >
      {children}
      <ToastList
        data={toasts}
        position={IToastPosition["top-right"]}
        removeToast={removeToast}
      />
    </ToastContext.Provider>
  );
};

export default ToastContext;
