import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Leaf, LogOut, MapPin, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState('General Waste');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      fetchMyRequests(JSON.parse(storedUser).token);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchMyRequests = async (token) => {
    try {
      setFetching(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/requests', config);
      setRequests(res.data);
    } catch (error) {
      toast.error('Failed to load your requests');
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!address || !phoneNumber || !timeSlot) return toast.error('Please enter all required fields');

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const newRequest = {
        name: userInfo.name || 'User',
        phoneNumber,
        timeSlot,
        address
      };

      const { data } = await axios.post('/api/users/book-pickup', newRequest, config);
      const { schedule } = data;
      
      // Navigate to checkout
      navigate('/checkout', { 
        state: { 
          scheduleId: schedule._id 
        } 
      });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">Pending</span>;
      case 'accepted': return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">Driver En Route</span>;
      case 'completed': return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">Completed</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      
      {/* Top Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
             <Leaf className="w-6 h-6 text-[#10b981]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Cleaners</span>
        </div>
        <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
              onClick={() => setIsProfileModalOpen(true)}
            >
               {userInfo?.profileImage ? (
                  <img src={userInfo.profileImage.startsWith('http') ? userInfo.profileImage : `http://localhost:5000${userInfo.profileImage}`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
               ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[#047857] flex items-center justify-center text-white font-bold text-sm">
                     {getInitials(userInfo?.name)}
                  </div>
               )}
               <div className="hidden sm:block text-right">
                  <p className="text-slate-700 text-sm font-bold">{userInfo?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 font-medium">Customer Account</p>
               </div>
            </div>
            <div className="pl-6 border-l border-slate-200">
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Request Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Request Pickup</h2>
            <p className="text-slate-500 text-sm mb-6">Schedule a garbage pickup. Our cleaners are ready.</p>

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Address</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-slate-400" />
                   </div>
                   <input 
                     type="text" 
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     placeholder="123 Eco Street, City" 
                     className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="w-5 h-5 text-slate-400" />
                   </div>
                   <input 
                     type="text" 
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     placeholder="Enter phone number" 
                     className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time Slot</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-slate-400" />
                   </div>
                   <input 
                     type="datetime-local" 
                     value={timeSlot}
                     onChange={(e) => setTimeSlot(e.target.value)}
                     className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                   />
                </div>
              </div>



              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                 <span className="text-slate-600 font-medium text-sm">Estimated Price:</span>
                 <span className="text-xl font-bold text-slate-900">$10.00</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#047857] hover:bg-[#065f46] text-white font-medium rounded-xl shadow-sm transition-colors mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Confirm Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Request History */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
             <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">My Requests</h2>
                   <p className="text-slate-500 text-sm">Track your pickup history and status.</p>
                </div>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto">
                {fetching ? (
                   <div className="flex items-center justify-center h-40">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   </div>
                ) : requests.length === 0 ? (
                   <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <AlertCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">No requests yet</h3>
                      <p className="text-slate-500">You haven't made any garbage pickup requests.</p>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {requests.map(req => (
                         <div key={req._id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-emerald-300">
                            <div>
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="font-bold text-slate-900">{req.serviceType}</span>
                                  {getStatusBadge(req.status)}
                               </div>
                               <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {req.address}</span>
                                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {req.timeSlot ? new Date(req.timeSlot).toLocaleString() : new Date(req.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-bold text-emerald-600">${req.price}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>
        </div>

      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    </div>
  );
};

export default UserDashboard;
