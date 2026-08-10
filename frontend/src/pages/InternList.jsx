import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import api from '../services/api';
import { Users, Search, Plus, Loader2, CheckCircle, XCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const InternList = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await api.get('/admin/interns');
      // Filter only interns (though backend should ideally do this, we filter here for safety)
      const internsOnly = response.data.filter(u => u.role === 'ROLE_INTERN');
      setInterns(internsOnly);
    } catch (error) {
      toast.error('Failed to load interns');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntern = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/interns', formData);
      toast.success('Intern created successfully!');
      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', password: '' });
      fetchInterns(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create intern');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/interns/${id}/status?active=${!currentStatus}`);
      toast.success(`Intern ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchInterns();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInterns = interns.filter(intern => 
    intern.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Intern Management Report', 14, 22);
    
    // Add Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Prepare Table Data
    const tableData = filteredInterns.map(intern => [
      intern.fullName,
      intern.email,
      intern.active ? 'Active' : 'Inactive'
    ]);
    
    // Add Table using the imported autoTable function
    autoTable(doc, {
      head: [['Full Name', 'Email', 'Status']],
      body: tableData,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }, // Primary blue
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Save the PDF
    doc.save(`interns-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success('PDF report downloaded successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Intern Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View, add, and manage intern accounts.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Export to PDF Button */}
            <button 
              onClick={exportToPDF}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
            >
              <Download size={20} /> Export PDF
            </button>
            {/* Add Intern Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
            >
              <Plus size={20} /> Add Intern
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredInterns.length > 0 ? (
                    filteredInterns.map((intern) => (
                      <tr key={intern.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{intern.fullName}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{intern.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            intern.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {intern.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {intern.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleStatus(intern.id, intern.active)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                              intern.active 
                                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            {intern.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No interns found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Intern Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Intern">
        <form onSubmit={handleAddIntern} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Intern'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default InternList;