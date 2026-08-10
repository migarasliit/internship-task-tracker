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
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Work Log Reviews</h1>
          <p className="text-sm sm:text-base text-gray-500">Review intern daily logs and provide supervisor feedback.</p>
        </div>

        {/* Intern Selector - Full width on mobile */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-1 mb-0.5" />
            Select Intern:
          </label>
          <select 
            value={selectedInternId} 
            onChange={(e) => setSelectedInternId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50 text-sm sm:text-base"
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
                {/* Log Header - Responsive */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary flex-shrink-0" />
                    <span className="font-bold text-gray-800 text-sm sm:text-base">{log.logDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 self-start sm:self-auto">
                    <Clock size={12} className="flex-shrink-0" /> 
                    <span>{log.hoursWorked} Hours</span>
                  </div>
                </div>

                {/* Log Content - Stack on mobile */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Completed Work</p>
                    <p className="text-gray-800 text-sm bg-green-50 p-3 rounded-lg border border-green-100">{log.completedWork}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current / Next Day Plan</p>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-gray-800 text-sm">{log.currentWork}</p>
                      <p className="text-gray-500 text-xs mt-2 pt-2 border-t border-blue-100">
                        <span className="font-medium">Next:</span> {log.nextDayPlan}
                      </p>
                    </div>
                  </div>
                  
                  {log.challenges && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Challenges Faced</p>
                      <p className="text-gray-800 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{log.challenges}</p>
                    </div>
                  )}
                </div>

                {/* Supervisor Feedback Section - Responsive */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                  {log.supervisorComment ? (
                    <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-100">
                      <p className="flex items-start gap-2 text-xs sm:text-sm font-bold text-indigo-800 mb-2">
                        <MessageSquare size={14} className="flex-shrink-0 mt-0.5" /> 
                        <span>Supervisor Feedback:</span>
                      </p>
                      <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">{log.supervisorComment}</p>
                    </div>
                  ) : (
                    <div>
                      {activeLogId === log.id ? (
                        <div className="space-y-3">
                          <textarea 
                            rows="3"
                            value={commentText} 
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your feedback for the intern..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button 
                              onClick={() => setActiveLogId(null)} 
                              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleAddComment(log.id)} 
                              disabled={isSubmitting} 
                              className="w-full sm:flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} 
                              Send Feedback
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setActiveLogId(log.id); setCommentText(''); }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-blue-700 transition px-4 py-2.5 rounded-lg hover:bg-blue-50"
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
            <p className="text-gray-500 text-sm sm:text-base px-4">
              {selectedInternId ? 'This intern has not submitted any logs yet.' : 'Select an intern to view logs.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWorkLogs;