import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import Logo from '../ui/Logo';

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <Logo showLink size="md" />
                        <div className="flex items-center gap-4 sm:gap-6">
                            <ThemeToggle />
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {user?.name}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 capitalize">
                                    {user?.role || 'User'}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default AppLayout;
