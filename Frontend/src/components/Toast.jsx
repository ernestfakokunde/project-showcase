import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-[8px] px-4 py-3 text-sm font-medium text-white animate-slide-up ${
            toast.type === "success"
              ? "bg-green-500/20 border border-green-500/30"
              : toast.type === "error"
              ? "bg-red-500/20 border border-red-500/30"
              : "bg-blue-500/20 border border-blue-500/30"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
