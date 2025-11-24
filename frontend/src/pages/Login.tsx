import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: LoginForm) => {
        try {
            setError('');
            setLoading(true);
            const response = await api.post('/auth/login', data);
            login(response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-white mb-4">
                        <Sparkles className="w-10 h-10" />
                        <h1 className="text-4xl font-bold">HabitBuilder</h1>
                    </div>
                    <p className="text-white/80 text-lg">Build better habits, one day at a time</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-white/70">Sign in to continue your journey</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm mb-4 backdrop-blur">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <LogIn size={20} />
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-white/70">Don't have an account? </span>
                        <Link to="/signup" className="text-white font-semibold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>

                <p className="text-center text-white/50 text-sm mt-8">
                    © 2025 HabitBuilder. Build your future.
                </p>
            </div>
        </div>
    );
}
