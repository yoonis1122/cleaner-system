import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Upload, User, Mail, Camera } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, userInfo, setUserInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPreviewImage(userInfo.profileImage ? (userInfo.profileImage.startsWith('http') ? userInfo.profileImage : `http://localhost:5000${userInfo.profileImage}`) : '');
    }
  }, [userInfo, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Name and Email are required');
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put('/api/users/profile', formData, config);
      
      // Keep existing token if not returned, or update if returned
      const updatedUser = { ...data, token: data.token || userInfo.token };
      
      // Update local storage and parent state
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold">
                 {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    getInitials(name)
                 )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleImageChange} 
                 className="hidden" 
                 accept="image/*"
              />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-3">Click to change photo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
               Cancel
             </button>
             <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center disabled:opacity-70">
               {loading ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
