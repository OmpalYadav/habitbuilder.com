import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, LayoutDashboard, Calendar, Settings, Sparkles } from 'lucide-react';

export default function Layout() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <nav className="w-64 bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-md border-r border-white/10 flex-shrink-0">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">HabitBuilder</h1>
                    </div>
                </div>
                <ul className="p-4 space-y-2">
                    <li>
                        <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-white/90 hover:bg-white/10 transition-all">
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/habits" className="flex items-center gap-3 p-3 rounded-lg text-white/90 hover:bg-white/10 transition-all">
                            <Calendar size={20} />
                            <span className="font-medium">Habits</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg text-white/90 hover:bg-white/10 transition-all">
                            <User size={20} />
                            <span className="font-medium">Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg text-white/90 hover:bg-white/10 transition-all">
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </Link>
                    </li>
                    <li className="pt-4 mt-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg text-red-300 hover:bg-red-500/20 w-full transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gradient-to-br from-purple-50 to-indigo-100">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
