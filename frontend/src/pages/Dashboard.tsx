import { useQuery } from '@tanstack/react-query';
import { Plus, TrendingUp, Calendar, Target } from 'lucide-react';
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
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
            </div>
        );
    }

    const completedToday = entries?.filter((e: any) => e.status === 'DONE').length || 0;
    const totalHabits = habits?.length || 0;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 mb-2">Today's Habits</h1>
                    <p className="text-lg text-gray-600">
                        {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all"
                >
                    <Plus size={24} />
                    New Habit
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Total Habits</p>
                            <p className="text-3xl font-black text-gray-800">{totalHabits}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Completed Today</p>
                            <p className="text-3xl font-black text-gray-800">{completedToday}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Completion Rate</p>
                            <p className="text-3xl font-black text-gray-800">{completionRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Habits Grid */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Habits</h2>
                {habits?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {habits.map((habit: any) => {
                            const entry = entries?.find((e: any) => e.habitId === habit.id);
                            return <HabitCard key={habit.id} habit={habit} entry={entry} date={today} />;
                        })}
                    </div>
                ) : (
                    <div className="glass-card rounded-3xl p-16 text-center">
                        <div className="mb-6">
                            <Target className="w-24 h-24 mx-auto text-purple-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No habits yet</h3>
                        <p className="text-gray-600 mb-8 text-lg">
                            Create your first habit to start building better routines
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
                        >
                            <Plus size={24} />
                            Create Your First Habit
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && <CreateHabitModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
