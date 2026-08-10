import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import api from '../services/api';
import { FolderKanban, Plus, Loader2, Calendar, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologyStack: '',
    deadline: '',
    assignedInternIds: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, internRes] = await Promise.all([
        api.get('/admin/projects'),
        api.get('/admin/interns')
      ]);
      setProjects(projRes.data);
      // Filter only active interns for assignment
      const activeInterns = internRes.data.filter(u => u.role === 'ROLE_INTERN' && u.active);
      setInterns(activeInterns);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (internId) => {
    setFormData(prev => {
      const isSelected = prev.assignedInternIds.includes(internId);
      return {
        ...prev,
        assignedInternIds: isSelected 
          ? prev.assignedInternIds.filter(id => id !== internId)
          : [...prev.assignedInternIds, internId]
      };
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/projects', formData);
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', technologyStack: '', deadline: '', assignedInternIds: [] });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="text-gray-500 mt-1">Create projects and assign interns.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
          >
            <Plus size={20} /> Create Project
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{project.description || 'No description provided.'}</p>
                
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-gray-400" />
                    <span className="truncate">{project.technologyStack || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Deadline: {project.deadline}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Assigned Interns ({project.assignedInternIds?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {project.assignedInternIds?.length > 0 ? (
                      project.assignedInternIds.map((id, idx) => {
                        const intern = interns.find(i => i.id === id);
                        return (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                            {intern ? intern.fullName : 'Unknown'}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400 italic">No interns assigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <FolderKanban size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No projects created yet.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., E-Commerce Platform"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Brief project overview..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technology Stack</label>
            <input
              type="text"
              value={formData.technologyStack}
              onChange={(e) => setFormData({...formData, technologyStack: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., React, Spring Boot, MongoDB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Interns</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {interns.length > 0 ? (
                interns.map(intern => (
                  <label key={intern.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedInternIds.includes(intern.id)}
                      onChange={() => handleCheckboxChange(intern.id)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{intern.fullName} ({intern.email})</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No active interns available to assign.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ProjectList;