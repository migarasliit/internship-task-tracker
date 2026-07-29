import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { FileText, MessageSquare, Send, Loader2, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminWorkLogs = () => {
  const [interns, setInterns] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Comment state
  const [activeLogId, setActiveLogId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInterns();
  }, []);

  useEffect(() => {
    if (selectedInternId) fetchLogs();
    else setLogs([]);
  }, [selectedInternId]);

  const fetchInterns = async () => {
    try {
      const response = await api.get('/admin/interns');
      const activeInterns = response.data.filter(u => u.role === 'ROLE_INTERN');
      setInterns(activeInterns);
      // Auto-select the first intern if available
      if (activeInterns.length > 0) setSelectedInternId(activeInterns[0].id);
    } catch (error) {
      toast.error('Failed to load interns');
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/worklogs/intern/${selectedInternId}`);
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to load work logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (logId) => {
    if (!commentText.trim()) return toast.error('Please enter a comment');
    setIsSubmitting(true);
    try {
      await api.patch(`/worklogs/${logId}/comment?comment=${encodeURIComponent(commentText)}`);
      toast.success('Feedback added successfully!');
      setCommentText('');
      setActiveLogId(null);
      fetchLogs(); // Refresh to show the new comment
    } catch (error) {
      toast.error('Failed to add feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Log Reviews</h1>
          <p className="text-gray-500 mt-1">Review intern daily logs and provide supervisor feedback.</p>
        </div>

        {/* Intern Selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <User size={20} className="text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Select Intern:</label>
          <select 
            value={selectedInternId} 
            onChange={(e) => setSelectedInternId(e.target.value)}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50"
          >
            {interns.map(intern => (
              <option key={intern.id} value={intern.id}>{intern.fullName} ({intern.email})</option>
            ))}
          </select>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Log Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    <span className="font-bold text-gray-800">{log.logDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                    <Clock size={14} /> {log.hoursWorked} Hours
                  </div>
                </div>

                {/* Log Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Completed Work</p>
                    <p className="text-gray-800 text-sm bg-green-50 p-3 rounded-lg border border-green-100 min-h-[60px]">{log.completedWork}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current / Next Day Plan</p>
                    <p className="text-gray-800 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 min-h-[60px]">{log.currentWork} <br/> <span className="text-gray-500 text-xs mt-1 block">Next: {log.nextDayPlan}</span></p>
                  </div>
                  {log.challenges && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Challenges Faced</p>
                      <p className="text-gray-800 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{log.challenges}</p>
                    </div>
                  )}
                </div>

                {/* Supervisor Feedback Section */}
                <div className="px-6 pb-6">
                  {log.supervisorComment ? (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="flex items-center gap-2 text-sm font-bold text-indigo-800 mb-2">
                        <MessageSquare size={16} /> Supervisor Feedback:
                      </p>
                      <p className="text-sm text-indigo-900">{log.supervisorComment}</p>
                    </div>
                  ) : (
                    <div>
                      {activeLogId === log.id ? (
                        <div className="space-y-3">
                          <textarea 
                            rows="2" 
                            value={commentText} 
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your feedback for the intern..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setActiveLogId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={() => handleAddComment(log.id)} disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2">
                              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Send Feedback
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setActiveLogId(log.id); setCommentText(''); }}
                          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-blue-700 transition"
                        >
                          <MessageSquare size={16} /> Add Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {selectedInternId ? 'This intern has not submitted any logs yet.' : 'Select an intern to view logs.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWorkLogs;