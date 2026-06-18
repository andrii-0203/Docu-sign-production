import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                'p-3 rounded-xl shrink-0',
                                isDanger
                                    ? 'bg-red-50 dark:bg-red-900/20'
                                    : 'bg-indigo-50 dark:bg-indigo-900/20'
                            )}
                        >
                            <AlertTriangle
                                size={22}
                                className={isDanger ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}
                            />
                        </div>
                        <div className="min-w-0">
                            <h3
                                id="confirm-title"
                                className="text-lg font-bold text-slate-900 dark:text-slate-100"
                            >
                                {title}
                            </h3>
                            <p
                                id="confirm-message"
                                className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed"
                            >
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2',
                            isDanger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        )}
                    >
                        {isLoading && (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
