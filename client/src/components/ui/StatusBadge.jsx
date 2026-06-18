import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

const statusConfig = {
    Signed: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    },
    Rejected: {
        icon: XCircle,
        className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    },
    Pending: {
        icon: Clock,
        className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    },
};

export function StatusBadge({ status, showIcon = true, className }) {
    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
        <span
            className={cn(
                'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border inline-flex items-center',
                config.className,
                className
            )}
        >
            {showIcon && <Icon size={14} className="mr-1" />}
            {status}
        </span>
    );
}

export default StatusBadge;
