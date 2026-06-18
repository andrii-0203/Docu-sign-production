import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/ui/Logo';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await registerUser(data.name, data.email, data.password);
            toast.success('Account created successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-slate-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative w-full max-w-md animate-slide-up">
                <div className="flex justify-center mb-8">
                    <Logo size="lg" />
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Create account</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            Start signing and managing documents securely
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Full name
                            </label>
                            <input
                                {...register('name')}
                                autoComplete="name"
                                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 dark:text-slate-200"
                                placeholder="Jane Smith"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Email address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 dark:text-slate-200"
                                placeholder="you@company.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    autoComplete="new-password"
                                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 dark:text-slate-200"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create account <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                            <ShieldCheck size={12} className="text-indigo-400" />
                            Encrypted credentials with secure token storage
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
