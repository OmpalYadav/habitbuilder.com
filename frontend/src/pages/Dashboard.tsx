import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import { format } from 'date-fns';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const today = format(new Date(), 'yyyy-MM-dd');

    const { data: habits, isLoading: habitsLoading } = useQuery({
        queryKey: ['habits'],
        queryFn: async () => {
            const res = await api.get('/habits');
            return res.data.habits;
        },
    });

    const { data: entries, isLoading: entriesLoading } = useQuery({
        queryKey: ['entries', today],
        queryFn: async () => {
            const res = await api.get(`/entries?startDate=${today}&endDate=${today}`);
            return res.data.entries;
        },
    });

    if (habitsLoading || entriesLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Today's Habits</h1>
                    <p className="text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <Plus size={20} />
                    <span className="font-semibold">New Habit</span>
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {habits?.map((habit: any) => {
                    const entry = entries?.find((e: any) => e.habitId === habit.id);
                    return (
                        <HabitCard key={habit.id} habit={habit} entry={entry} date={today} />
                    );
                })}
                {habits?.length === 0 && (
                    <div className="col-span-full">
                        <div className="text-center py-16 bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-purple-300">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No habits yet</h3>
                            <p className="text-gray-500 mb-6">Create your first habit to start building better routines</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                            >
                                Create Your First Habit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && <CreateHabitModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
