import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { useState } from 'react';
import { UserPlus, Sparkles, Mail, Lock, UserCircle } from 'lucide-react';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: SignupForm) => {
        try {
            setError('');
            setLoading(true);
            const response = await api.post('/auth/register', data);
            login(response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-40 right-40 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-10 animate-float">
                    <div className="inline-flex items-center gap-3 text-white mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md animate-glow">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                            HabitBuilder
                        </h1>
                    </div>
                    <p className="text-white/90 text-xl font-light">Start your transformation today</p>
                </div>

                {/* Signup Card */}
                <div className="glass-strong rounded-3xl p-10 shadow-2xl transform transition-all hover:scale-105 duration-300">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                        <p className="text-white/80 text-lg">Join thousands building better habits</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/30 border-2 border-red-400/50 text-white p-4 rounded-xl text-sm mb-6 backdrop-blur-md animate-pulse">
                            <p className="font-semibold">⚠️ {error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative">
                            <label htmlFor="name" className="block text-sm font-semibold text-white mb-3">
                                Full Name
                            </label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    className="w-full pl-12 pr-4 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-200 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="w-full pl-12 pr-4 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-200 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-white mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="w-full pl-12 pr-4 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-200 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-white to-purple-100 text-purple-700 rounded-xl font-bold text-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200"
                        >
                            <UserPlus size={24} />
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <span className="text-white/80 text-lg">Already have an account? </span>
                        <Link to="/login" className="text-white font-bold text-lg hover:underline hover:text-purple-200 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>

                <p className="text-center text-white/60 text-sm mt-10 font-light">
                    © 2025 HabitBuilder. Empowering your future.
                </p>
            </div>
        </div>
    );
}
