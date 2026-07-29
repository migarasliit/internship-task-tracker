import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const InternProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">View your account details and role information.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User size={48} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-blue-100 mt-1">{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Intern'}</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-gray-400" size={24} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-gray-400" size={24} />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-400" size={24} />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">July 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InternProfile;