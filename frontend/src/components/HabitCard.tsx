import { Check, X, Flame } from 'lucide-react';
import { useMutation, useQueryClient } from '@tantml:parameter>
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
        <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{habit.title}</h3>
                    {habit.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{habit.description}</p>
                    )}
                </div>
                <div className="ml-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-pulse-glow"></div>
                </div>
            </div>

            {/* Streak Indicator */}
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                <Flame size={16} />
                <span>Keep the streak going!</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => mutation.mutate('DONE')}
                    disabled={mutation.isPending}
                    className={clsx(
                        "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50",
                        status === 'DONE'
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-700"
                    )}
                >
                    <Check size={18} />
                    Done
                </button>

                <button
                    onClick={() => mutation.mutate('SKIPPED')}
                    disabled={mutation.isPending}
                    className={clsx(
                        "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50",
                        status === 'SKIPPED'
                            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 hover:text-red-700"
                    )}
                >
                    <X size={18} />
                    Skip
                </button>
            </div>
        </div>
    );
}
