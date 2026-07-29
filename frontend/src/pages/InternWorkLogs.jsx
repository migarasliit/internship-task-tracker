import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { FileText, Loader2, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const InternWorkLogs = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    completedWork: '',
    currentWork: '',
    challenges: '',
    hoursWorked: '',
    nextDayPlan: ''
  });

  useEffect(() => {
    if (user?.id) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/worklogs/intern/${user.id}`);
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to load work logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/worklogs/intern/${user.id}`, formData);
      toast.success('Daily work log submitted successfully!');
      setFormData({ completedWork: '', currentWork: '', challenges: '', hoursWorked: '', nextDayPlan: '' });
      fetchLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Work Logs</h1>
          <p className="text-gray-500 mt-1">Record your daily progress and view supervisor feedback.</p>
        </div>

        {/* Submission Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary" /> Submit Today's Log
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completed Work *</label>
                <textarea required rows="3" value={formData.completedWork} onChange={(e) => setFormData({...formData, completedWork: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="What did you finish today?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current / Next Work *</label>
                <textarea required rows="3" value={formData.currentWork} onChange={(e) => setFormData({...formData, currentWork: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="What are you working on now?" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Challenges Faced</label>
              <textarea rows="2" value={formData.challenges} onChange={(e) => setFormData({...formData, challenges: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Any blockers or issues?" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked *</label>
                <input type="number" step="0.5" min="0.5" required value={formData.hoursWorked} onChange={(e) => setFormData({...formData, hoursWorked: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., 6.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Day Plan *</label>
                <input type="text" required value={formData.nextDayPlan} onChange={(e) => setFormData({...formData, nextDayPlan: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="What is the plan for tomorrow?" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2 font-medium">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Submit Log
            </button>
          </form>
        </div>

        {/* Past Logs List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Log History</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : logs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{log.logDate}</span>
                    <span className="text-sm font-medium text-primary">{log.hoursWorked} Hours</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Completed:</p>
                      <p className="text-gray-600">{log.completedWork}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Current / Next:</p>
                      <p className="text-gray-600">{log.currentWork} <span className="text-gray-400">/</span> {log.nextDayPlan}</p>
                    </div>
                  </div>
                  {log.challenges && (
                    <div className="mb-3">
                      <p className="font-semibold text-gray-700 mb-1 text-sm">Challenges:</p>
                      <p className="text-gray-600 text-sm bg-red-50 p-2 rounded border border-red-100">{log.challenges}</p>
                    </div>
                  )}
                  {log.supervisorComment && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-1">
                        <MessageSquare size={16} /> Supervisor Feedback:
                      </p>
                      <p className="text-sm text-blue-900">{log.supervisorComment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No work logs submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InternWorkLogs;