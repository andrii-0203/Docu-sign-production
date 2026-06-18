import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className, label }) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-indigo-600 dark:text-indigo-400', sizes[size])} />
            {label && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            )}
        </div>
    );
}

export function PageLoader({ label = 'Loading...' }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <LoadingSpinner size="lg" label={label} />
        </div>
    );
}

export default LoadingSpinner;
