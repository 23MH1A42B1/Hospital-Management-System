import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = Date.now();
        setToasts(t => [...t, { id, type, title, message }]);
        if (duration > 0) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    }, []);

    const remove = (id) => setToasts(t => t.filter(x => x.id !== id));

    const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
    const colors = { success: 'success', error: 'error', warning: 'warning', info: 'info' };

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="toast-container">
                {toasts.map(t => {
                    const Icon = icons[t.type] || Info;
                    return (
                        <div key={t.id} className={`toast ${colors[t.type]}`}>
                            <div className="toast-icon">
                                <Icon size={18} color={t.type === 'success' ? 'var(--accent)' : t.type === 'error' ? 'var(--danger)' : t.type === 'warning' ? 'var(--warning)' : 'var(--primary)'} />
                            </div>
                            <div className="toast-content">
                                {t.title && <div className="toast-title">{t.title}</div>}
                                {t.message && <div className="toast-msg">{t.message}</div>}
                            </div>
                            <button className="toast-close" onClick={() => remove(t.id)}><X size={14} /></button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
