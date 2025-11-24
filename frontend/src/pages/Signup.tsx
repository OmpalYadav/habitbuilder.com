import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="text-white space-y-6 animate-fade-in-up hidden md:block">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                            <Zap className="w-12 h-12 text-yellow-300" />
                        </div>
                        <h1 className="text-6xl font-black">HabitBuilder</h1>
                    </div>

                    <h2 className="text-5xl font-bold leading-tight">
                        Start Your<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                            Transformation
                        </span>
                    </h2>

                    <p className="text-xl text-white/80 leading-relaxed">
                        Join thousands of people building better habits and achieving their dreams every single day.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="glass-overlay rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-sm text-white/80">Active Users</div>
                        </div>
                        <div className="glass-overlay rounded-2xl p-6 text-center">
                            <div className="text-4xl font-bold mb-2">1M+</div>
                            <div className="text-sm text-white/80">Habits Tracked</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-card rounded-3xl p-10 max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
                            <p className="text-gray-600 text-lg">Start building better habits today</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                                <p className="font-semibold">⚠️ {error}</p>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : (
                                    <>
                                        Create Account <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
