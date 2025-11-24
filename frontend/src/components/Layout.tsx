import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, LayoutDashboard, Target, User, Settings, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/habits', icon: Target, label: 'My Habits' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Zap className="w-8 h-8 text-purple-600" />
                    <h1 className="text-xl font-bold gradient-text">HabitBuilder</h1>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 w-72 flex-shrink-0 z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <div className="p-6 border-b border-gray-200 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-black gradient-text">HabitBuilder</h1>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-6 left-4 right-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
