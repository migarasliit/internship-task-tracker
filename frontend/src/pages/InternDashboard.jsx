import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout'; // Reusing the layout (Sidebar handles intern links automatically)
import api from '../services/api';
import { Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const InternDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchMyTasks();
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const response = await api.get(`/tasks/intern/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-primary" size={48} /></div>
      </AdminLayout>
    );
  }

  const pending = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const submitted = tasks.filter(t => t.status === 'SUBMITTED').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  const statCards = [
    { title: 'Pending Tasks', value: pending, icon: Clock, color: 'bg-blue-100 text-blue-600' },
    { title: 'Submitted', value: submitted, icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Completed', value: completed, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.fullName}. Here is your progress overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}><Icon size={24} /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assigned Tasks</h3>
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    task.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No tasks assigned to you yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InternDashboard;