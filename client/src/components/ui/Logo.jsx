import { FileSignature } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export function Logo({ size = 'md', showLink = false, className }) {
    const sizes = {
        sm: { icon: 18, text: 'text-lg' },
        md: { icon: 20, text: 'text-xl' },
        lg: { icon: 24, text: 'text-2xl' },
    };

    const { icon, text } = sizes[size] || sizes.md;

    const content = (
        <div className={cn('flex items-center gap-2.5', className)}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none">
                <FileSignature className="text-white" size={icon} />
            </div>
            <span className={cn('font-bold text-slate-800 dark:text-slate-100 tracking-tight', text)}>
                Secure<span className="text-indigo-600 dark:text-indigo-400">Sign</span>
            </span>
        </div>
    );

    if (showLink) {
        return (
            <Link to="/dashboard" className="hover:opacity-90 transition-opacity">
                {content}
            </Link>
        );
    }

    return content;
}

export default Logo;
