import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, MoreVertical, Shield, User as UserIcon, Trash2, Edit, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import UserModal from './UserModal';

const UserManagementPanel = ({ userInfo }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/admin/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchUsers();
    }
  }, [userInfo]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/admin/users/${id}`, config);
        setUsers(users.filter(user => user._id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user", error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
    setActiveDropdown(null);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700"><Shield className="w-3 h-3" /> Admin</span>;
      case 'cleaner':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Cleaner</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700"><UserIcon className="w-3 h-3" /> User</span>;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team & Users</h2>
          <p className="text-slate-500 mt-1">Manage system access, cleaners, and user accounts.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            Total Users: <span className="text-slate-900">{users.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading users...</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 overflow-hidden">
                           {user.profileImage ? (
                             <img src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
                           ) : (
                             user.name.charAt(0).toUpperCase()
                           )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{user.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                          {user.phoneNumber && <div className="text-xs text-slate-400 mt-0.5 font-medium">{user.phoneNumber}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      <div>{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className="text-xs text-slate-400 font-normal mt-0.5">{new Date(user.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)} 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeDropdown === user._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                          <div className="absolute right-6 top-12 w-36 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-1 overflow-hidden">
                            <button 
                              onClick={() => openEditModal(user)} 
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium transition-colors"
                            >
                              <Edit className="w-4 h-4 text-slate-400" /> Edit User
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)} 
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" /> Delete User
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">No users found</h3>
                      <p className="text-sm text-slate-500">Try adjusting your search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userInfo={userInfo}
        editingUser={editingUser}
        onUserSaved={(savedUser) => {
          if (editingUser) {
            setUsers(users.map(u => u._id === savedUser._id ? savedUser : u));
          } else {
            setUsers([savedUser, ...users]);
          }
        }}
      />
    </div>
  );
};

export default UserManagementPanel;
