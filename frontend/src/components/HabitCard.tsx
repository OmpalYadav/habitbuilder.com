import { Check, X } from 'lucide-react';
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
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{habit.title}</h3>
                    {habit.description && (
                        <p className="text-sm text-gray-600">{habit.description}</p>
                    )}
                </div>
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => mutation.mutate('DONE')}
                    className={clsx(
                        "flex-1 py-3 rounded-xl flex items-center justify-center transition-all font-medium",
                        status === 'DONE'
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-400 ring-offset-2"
                            : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                    )}
                >
                    <Check size={20} className="mr-1" />
                    Done
                </button>
                <button
                    onClick={() => mutation.mutate('SKIPPED')}
                    className={clsx(
                        "flex-1 py-3 rounded-xl flex items-center justify-center transition-all font-medium",
                        status === 'SKIPPED'
                            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-2 ring-red-400 ring-offset-2"
                            : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                    )}
                >
                    <X size={20} className="mr-1" />
                    Skip
                </button>
            </div>
        </div>
    );
}
