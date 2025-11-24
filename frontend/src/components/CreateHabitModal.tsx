import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const habitSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    scheduleType: z.enum(['DAILY', 'WEEKLY', 'CUSTOM']),
});

type HabitForm = z.infer<typeof habitSchema>;

export default function CreateHabitModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            scheduleType: 'DAILY',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: HabitForm) => {
            await api.post('/habits', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Habit</h2>

                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Habit Title</label>
                        <input
                            {...register('title')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                            placeholder="e.g., Read 30 minutes"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                        <textarea
                            {...register('description')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                            placeholder="Add some details about your habit..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule</label>
                        <select
                            {...register('scheduleType')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="CUSTOM">Custom</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Create Habit
                    </button>
                </form>
            </div>
        </div>
    );
}
