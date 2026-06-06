import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, DollarSign, BarChart2, Calendar, Settings,
  Bell, Plus, MapPin, CheckCircle2, Clock, MoreVertical, Leaf, LogOut
} from 'lucide-react';
import ProfileModal from '../components/ProfileModal';
import UserBookingModal from '../components/UserBookingModal';
import PickupsPanel from '../components/PickupsPanel';
import EarningsPanel from '../components/EarningsPanel';
import UserManagementPanel from '../components/UserManagementPanel';
import ReportHistoryPanel from '../components/ReportHistoryPanel';
import axios from 'axios';

const ManagerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserBookingModalOpen, setIsUserBookingModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const activeRequestsCount = requests.filter(s => ['pending', 'accepted', 'assigned'].includes(s.status || 'pending')).length;
  const completedJobsCount = requests.filter(s => s.status === 'completed').length;
  const totalRevenue = requests.reduce((sum, req) => sum + (req.price || 10), 0);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    if(userInfo && userInfo.token) {
       fetchRequests();
    }
  }, [userInfo]);

  const fetchRequests = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.get('/api/admin/requests', config);
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      await axios.put(`/api/admin/requests/${id}/status`, { status }, config);
      setRequests(requests.map(s => s._id === id ? { ...s, status } : s));
    } catch (error) {
      console.error("Failed to update request status", error);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-white">
          <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
          <span className="font-bold text-lg text-emerald-800 tracking-tight">Cleaners</span>
        </div>
        
        <div className="p-6">
          <p className="font-bold text-emerald-400 text-sm tracking-wide">Operations Manager</p>
          <p className="text-xs text-slate-500 mb-2">Cleaners</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500 text-white">Active</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-[#047857] text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? '' : 'text-slate-400'}`} /> Dashboard
          </a>
          <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'pickups' ? 'bg-[#047857] text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`} onClick={(e) => { e.preventDefault(); setActiveTab('pickups'); }}>
            <Truck className={`w-5 h-5 ${activeTab === 'pickups' ? '' : 'text-slate-400'}`} /> Pickups
          </a>
          <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'earnings' ? 'bg-[#047857] text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`} onClick={(e) => { e.preventDefault(); setActiveTab('earnings'); }}>
            <DollarSign className={`w-5 h-5 ${activeTab === 'earnings' ? '' : 'text-slate-400'}`} /> Earnings
          </a>
          <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'report-history' ? 'bg-[#047857] text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`} onClick={(e) => { e.preventDefault(); setActiveTab('report-history'); }}>
            <Clock className={`w-5 h-5 ${activeTab === 'report-history' ? '' : 'text-slate-400'}`} /> Report History
          </a>
          <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-[#047857] text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'} mt-auto`} onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}>
            <Settings className={`w-5 h-5 ${activeTab === 'users' ? '' : 'text-slate-400'}`} /> Team & Users
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors text-left mt-auto">
            <LogOut className="w-5 h-5 text-slate-400" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsUserBookingModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Request Pickup
            </button>
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div 
               className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
               onClick={() => setIsProfileModalOpen(true)}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200 overflow-hidden">
                {userInfo?.profileImage ? (
                   <img src={userInfo.profileImage.startsWith('http') ? userInfo.profileImage : `http://localhost:5000${userInfo.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   getInitials(userInfo?.name)
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">{userInfo?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' ? (
        <div className="p-8 overflow-y-auto">
          
          {/* Top Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Active Requests</p>
                <p className="text-3xl font-bold text-emerald-600">{activeRequestsCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <Truck className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Completed Jobs</p>
                <p className="text-3xl font-bold text-emerald-600">{completedJobsCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600">${totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
             {/* Map Area */}
             <div className="md:col-span-2 bg-[#2a3733] rounded-2xl overflow-hidden relative min-h-[400px] border border-slate-200 shadow-sm">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
                
                {/* Mock Map Grid lines */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {/* Overlay Card */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border border-white/20">
                   <p className="text-xs font-bold text-emerald-700 tracking-wider mb-2">LIVE TRUCK TRACKING</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-800">Truck #8821 in your sector</span>
                   </div>
                </div>

                {/* Map Pins */}
                <MapPin className="absolute top-1/4 left-1/3 w-6 h-6 text-emerald-400 drop-shadow-md" />
                <MapPin className="absolute top-1/2 left-2/3 w-6 h-6 text-slate-300 drop-shadow-md opacity-50" />
                <MapPin className="absolute bottom-1/3 left-1/2 w-6 h-6 text-slate-300 drop-shadow-md opacity-50" />
             </div>

             {/* Progress Panel */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-6">Current Pickup Progress</h3>
                
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                   
                   <div className="relative pl-6">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#047857] flex items-center justify-center border-4 border-white">
                         <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Request Confirmed</h4>
                      <p className="text-sm text-slate-500 mt-1">Your request has been received.</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">OCT 24, 08:30 AM</p>
                   </div>

                   <div className="relative pl-6">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#047857] flex items-center justify-center border-4 border-white">
                         <Truck className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Driver En Route</h4>
                      <p className="text-sm text-slate-500 mt-1">Driver Marcus is 5 mins away.</p>
                      <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-wider">LIVE NOW</p>
                   </div>

                   <div className="relative pl-6">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white">
                         <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-400">Collection in Progress</h4>
                      <p className="text-sm text-slate-400 mt-1">Items being weighed and sorted.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Recent Pickup Requests</h3>
                <a href="#" className="text-sm font-medium text-[#047857] hover:underline">View All History</a>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                   <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4">Reference</th>
                         <th className="px-6 py-4">Service Type</th>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {requests.map((request, index) => (
                         <tr key={request._id || index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{request.name}</td>
                            <td className="px-6 py-4">{request.address}</td>
                            <td className="px-6 py-4">{new Date(request.timeSlot).toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${request.status === 'completed' ? 'bg-[#047857] text-white' : request.status === 'cancelled' ? 'bg-red-100 text-red-700' : request.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {request.status || 'pending'}
                               </span>
                            </td>
                            <td className="px-6 py-4"><button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button></td>
                         </tr>
                       ))}
                       {requests.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No requests found. Click "Request Pickup" to add one.</td>
                          </tr>
                       )}
                   </tbody>
                </table>
             </div>
           </div>
        </div>
        ) : activeTab === 'pickups' ? (
          <PickupsPanel schedules={requests} onUpdateStatus={handleUpdateStatus} />
        ) : activeTab === 'earnings' ? (
          <EarningsPanel schedules={requests} />
        ) : activeTab === 'report-history' ? (
          <ReportHistoryPanel requests={requests} />
        ) : activeTab === 'users' ? (
          <UserManagementPanel userInfo={userInfo} />
        ) : null}
      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <UserBookingModal
        isOpen={isUserBookingModalOpen}
        onClose={() => setIsUserBookingModalOpen(false)}
        userInfo={userInfo}
        onScheduleCreated={(newRequest) => {
          setRequests([newRequest, ...requests]);
        }}
      />
    </div>
  );
};

export default ManagerDashboard;
