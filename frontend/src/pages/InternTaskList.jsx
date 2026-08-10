import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { CheckSquare, Loader2, ExternalLink, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const InternTaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);

  useEffect(() => {
    if (user?.id) fetchMyTasks();
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const response = await api.get(`/tasks/intern/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status?status=${newStatus}`);
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
      fetchMyTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmitWork = async (taskId) => {
    if (!submissionLink.trim()) return toast.error('Please enter a submission link');
    setSubmittingId(taskId);
    try {
      await api.post(`/tasks/${taskId}/submit?submissionLink=${encodeURIComponent(submissionLink)}`);
      toast.success('Work submitted successfully!');
      setActiveTaskId(null);
      setSubmissionLink('');
      fetchMyTasks();
    } catch (error) {
      toast.error('Failed to submit work');
    } finally {
      setSubmittingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'TODO': 'bg-gray-100 text-gray-700', 'IN_PROGRESS': 'bg-blue-100 text-blue-700',
      'SUBMITTED': 'bg-yellow-100 text-yellow-700', 'COMPLETED': 'bg-green-100 text-green-700',
      'REVISION_REQUIRED': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">Track your progress and submit your work.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">{task.priority}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{task.description}</p>
                
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p><span className="font-medium text-gray-700">Deadline:</span> {task.deadline}</p>
                  {task.supervisorFeedback && (
                    <div className="bg-red-50 p-2 rounded text-red-700 text-xs mt-2">
                      <span className="font-bold">Feedback:</span> {task.supervisorFeedback}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  {task.status === 'TODO' && (
                    <button onClick={() => updateStatus(task.id, 'IN_PROGRESS')} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium">
                      Start Task
                    </button>
                  )}
                  
                  {(task.status === 'IN_PROGRESS' || task.status === 'REVISION_REQUIRED') && (
                    <>
                      {activeTaskId === task.id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={submissionLink} 
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            placeholder="Paste GitHub/Doc link here..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setActiveTaskId(null)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                            <button onClick={() => handleSubmitWork(task.id)} disabled={submittingId === task.id} className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                              {submittingId === task.id ? <Loader2 className="animate-spin" size={14}/> : <Send size={14}/>} Submit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setActiveTaskId(task.id)} className="w-full bg-primary hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2">
                          <ExternalLink size={16} /> Submit Work
                        </button>
                      )}
                    </>
                  )}

                  {task.status === 'SUBMITTED' && (
                    <button disabled className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed">
                      Awaiting Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No tasks assigned to you yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InternTaskList;