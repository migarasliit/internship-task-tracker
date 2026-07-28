import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import api from '../services/api';
import { CheckSquare, Plus, Loader2, ExternalLink, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    title: '', description: '', projectId: '', assignedInternId: '', deadline: '', priority: 'MEDIUM'
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, projRes, internRes] = await Promise.all([
        api.get('/tasks/admin'),
        api.get('/admin/projects'),
        api.get('/admin/interns')
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
      setInterns(internRes.data.filter(u => u.role === 'ROLE_INTERN'));
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/tasks/admin', formData);
      toast.success('Task assigned successfully!');
      setIsCreateModalOpen(false);
      setFormData({ title: '', description: '', projectId: '', assignedInternId: '', deadline: '', priority: 'MEDIUM' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewModal = (task) => {
    setSelectedTask(task);
    setFeedback('');
    setIsReviewModalOpen(true);
  };

  const handleReviewTask = async (newStatus) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/tasks/admin/${selectedTask.id}/feedback?feedback=${encodeURIComponent(feedback)}&newStatus=${newStatus}`);
      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      setIsReviewModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Helpers
  const getStatusColor = (status) => {
    const colors = {
      'TODO': 'bg-gray-100 text-gray-700',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700',
      'SUBMITTED': 'bg-yellow-100 text-yellow-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'REVISION_REQUIRED': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = { 'LOW': 'bg-slate-100 text-slate-600', 'MEDIUM': 'bg-orange-100 text-orange-600', 'HIGH': 'bg-red-100 text-red-600' };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-500 mt-1">Assign tasks and review intern submissions.</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
          >
            <Plus size={20} /> Assign Task
          </button>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              const intern = interns.find(i => i.id === task.assignedInternId);
              
              return (
                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{task.description || 'No description'}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p><span className="font-medium text-gray-700">Project:</span> {project?.title || 'N/A'}</p>
                    <p><span className="font-medium text-gray-700">Intern:</span> {intern?.fullName || 'N/A'}</p>
                    <p className="flex items-center gap-1"><Clock size={14} /> Deadline: {task.deadline}</p>
                  </div>

                  {task.submissionLink && (
                    <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary text-sm font-medium mb-3 hover:underline">
                      <ExternalLink size={14} /> View Submission
                    </a>
                  )}

                  {task.status === 'SUBMITTED' && (
                    <button 
                      onClick={() => openReviewModal(task)}
                      className="w-full mt-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition font-medium"
                    >
                      <MessageSquare size={18} /> Review Submission
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No tasks assigned yet.</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Assign New Task">
        <form onSubmit={handleCreateTask} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select required value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Intern *</label>
              <select required value={formData.assignedInternId} onChange={(e) => setFormData({...formData, assignedInternId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Intern</option>
                {interns.filter(i => i.active).map(i => <option key={i.id} value={i.id}>{i.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
              <input type="date" required value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Assign Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Submission Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Review Task Submission">
        {selectedTask && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Submission Link:</p>
              <a href={selectedTask.submissionLink} target="_blank" rel="noopener noreferrer" className="text-primary font-medium flex items-center gap-1 hover:underline">
                <ExternalLink size={16} /> {selectedTask.submissionLink}
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Feedback / Comments</label>
              <textarea rows="4" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="e.g., Great job on the database design!" />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleReviewTask('REVISION_REQUIRED')}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <AlertCircle size={18} /> Request Revision
              </button>
              <button 
                onClick={() => handleReviewTask('COMPLETED')}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <CheckSquare size={18} /> Approve Task
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default TaskList;