import { useAuthStore } from '../store/authStore';

export default function Profile() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account information</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.name || 'N/A'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.email}</p>
                </div>
            </div>
        </div>
    );
}
