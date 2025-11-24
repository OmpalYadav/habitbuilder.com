import { Check, X, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import clsx from 'clsx';

interface HabitCardProps {
    habit: any;
    entry: any;
    date: string;
}

export default function HabitCard({ habit, entry, date }: HabitCardProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (status: 'DONE' | 'SKIPPED' | 'PARTIAL') => {
            await api.post('/entries', {
                habitId: habit.id,
                date,
                status,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entries'] });
        },
    });

    const status = entry?.status;

    return (
        <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

            <div className="relative bg-white/80 backdrop-blur-lg p-7 rounded-3xl shadow-xl border-2 border-white/50 hover:shadow-2xl transition-all transform hover:scale-105 duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">{habit.title}</h3>
                        {habit.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">{habit.description}</p>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="mb-5 flex items-center gap-2 text-xs text-gray-500">
                    <TrendingUp size={14} className="text-purple-500" />
                    <span className="font-semibold">Keep going!</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => mutation.mutate('DONE')}
                        disabled={mutation.isPending}
                        className={clsx(
                            "flex-1 py-4 rounded-2xl flex items-center justify-center transition-all font-bold text-sm transform hover:scale-105 duration-200 disabled:opacity-50",
                            status === 'DONE'
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-4 ring-green-300/50"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-green-100 hover:to-emerald-100 hover:text-green-700 hover:shadow-md"
                        )}
                    >
                        <Check size={20} className="mr-2" />
                        Done
                    </button>
                    <button
                        onClick={() => mutation.mutate('SKIPPED')}
                        disabled={mutation.isPending}
                        className={clsx(
                            "flex-1 py-4 rounded-2xl flex items-center justify-center transition-all font-bold text-sm transform hover:scale-105 duration-200 disabled:opacity-50",
                            status === 'SKIPPED'
                                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-4 ring-red-300/50"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-red-100 hover:to-rose-100 hover:text-red-700 hover:shadow-md"
                        )}
                    >
                        <X size={20} className="mr-2" />
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
