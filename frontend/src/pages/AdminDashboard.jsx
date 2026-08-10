import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { Users, FolderKanban, Clock, CheckCircle, AlertTriangle, Loader2, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]); 
  const [chartData, setChartData] = useState({ taskDistribution: [], internActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const [statsRes, activityRes, tasksRes, internsRes] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-activity'),
      api.get('/tasks/admin'),
      api.get('/admin/interns')
    ]);
    
    setStats(statsRes.data);
    setActivities(activityRes.data);
    
    // Prepare Task Distribution Data for Pie Chart
    const tasks = tasksRes.data;
    const taskDist = [
      { name: 'TODO', value: tasks.filter(t => t.status === 'TODO').length },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length },
      { name: 'Submitted', value: tasks.filter(t => t.status === 'SUBMITTED').length },
      { name: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length },
      { name: 'Revision', value: tasks.filter(t => t.status === 'REVISION_REQUIRED').length },
    ];
    
    // Prepare Intern Activity Data for Bar Chart
    const interns = internsRes.data.filter(u => u.role === 'ROLE_INTERN');
    const internActivity = await Promise.all(
      interns.map(async (intern) => {
        const internTasks = tasks.filter(t => t.assignedInternId === intern.id);
        return {
          name: intern.fullName.split(' ')[0], // First name only
          tasks: internTasks.length,
          completed: internTasks.filter(t => t.status === 'COMPLETED').length
        };
      })
    );
    
    setChartData({ taskDistribution: taskDist, internActivity });
    
  } catch (error) {
    toast.error('Failed to load dashboard data');
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

                {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#9ca3af" /> {/* TODO - Gray */}
                  <Cell fill="#3b82f6" /> {/* In Progress - Blue */}
                  <Cell fill="#f59e0b" /> {/* Submitted - Yellow */}
                  <Cell fill="#10b981" /> {/* Completed - Green */}
                  <Cell fill="#ef4444" /> {/* Revision - Red */}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Intern Activity Bar Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Intern Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.internActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }} 
                />
                <Legend />
                <Bar dataKey="tasks" name="Total Tasks" fill="#3b82f6" />
                <Bar dataKey="completed" name="Completed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. CLEANED UP RECENT ACTIVITY FEED */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${activity.type === 'Task' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <p className="text-sm text-gray-700">{activity.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No recent activity to display yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;