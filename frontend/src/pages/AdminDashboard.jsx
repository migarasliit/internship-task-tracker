import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { Users, FolderKanban, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

   if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </AdminLayout>
    );
  }

  // Fallback if stats failed to load
  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 text-danger">
          <AlertTriangle size={48} className="mb-4" />
          <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
          <p className="text-gray-500 mt-2">Please ensure the backend is running on port 8080.</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'Active Interns', value: stats.activeInterns || 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Projects', value: stats.activeProjects || 0, icon: FolderKanban, color: 'bg-purple-100 text-purple-600' },
    { title: 'Pending Tasks', value: stats.pendingTasks || 0, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Completed Tasks', value: stats.completedTasks || 0, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Overdue Tasks', value: stats.overdueTasks || 0, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Monitor internship progress and task statuses.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">Activity feed will be populated here as interns submit work and admins assign tasks.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;