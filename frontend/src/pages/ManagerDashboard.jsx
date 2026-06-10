import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, DollarSign, BarChart2, Calendar, Settings,
  Bell, Plus, MapPin, CheckCircle2, Clock, MoreVertical, Leaf, LogOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import ProfileModal from '../components/ProfileModal';
import UserBookingModal from '../components/UserBookingModal';
import PickupsPanel from '../components/PickupsPanel';
import EarningsPanel from '../components/EarningsPanel';
import UserManagementPanel from '../components/UserManagementPanel';
import ReportHistoryPanel from '../components/ReportHistoryPanel';
import axios from 'axios';

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ManagerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserBookingModalOpen, setIsUserBookingModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const activeRequestsCount = requests.filter(s => ['pending', 'scheduled', 'accepted', 'assigned'].includes(s.status || 'pending')).length;
  const completedJobsCount = requests.filter(s => s.status === 'completed').length;
  const totalRevenue = requests.reduce((sum, req) => {
    if(req.status === 'scheduled' || req.status === 'completed' || req.status === 'accepted') {
       return sum + (req.price || 0);
    }
    return sum;
  }, 0);

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

  // Analytics Data
  const statusData = [
    { name: 'Pending', value: requests.filter(r => r.status === 'pending').length },
    { name: 'Scheduled', value: requests.filter(r => r.status === 'scheduled').length },
    { name: 'En Route', value: requests.filter(r => r.status === 'accepted').length },
    { name: 'Completed', value: requests.filter(r => r.status === 'completed').length },
  ].filter(d => d.value > 0);
  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  const revenueByDate = requests.reduce((acc, req) => {
     if(req.status === 'completed' || req.status === 'scheduled' || req.status === 'accepted') {
        const date = new Date(req.updatedAt || req.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (req.price || 10);
     }
     return acc;
  }, {});
  const revenueData = Object.keys(revenueByDate).map(date => ({ date, amount: revenueByDate[date] })).slice(-7);

  // Map Data
  const pendingRequestsForMap = requests.filter(r => r.status === 'pending' || r.status === 'scheduled' || r.status === 'accepted');

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
                <p className="text-3xl font-bold text-emerald-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6">Revenue Trend (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6">Request Status</h3>
              <div className="h-64 flex items-center justify-center relative">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400">No data available</p>
                )}
                {/* Custom Legend */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-2xl font-bold text-slate-800">{requests.length}</span>
                   <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
             <h3 className="font-bold text-slate-900 mb-4">Live Dispatch Map</h3>
             <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200">
               <MapContainer center={[2.0469, 45.3182]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                 <TileLayer
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution='&copy; OpenStreetMap'
                 />
                 {/* Only plot if we had lat/lng stored. For now, since they might not, we just show a few mock pins around Mogadishu center if none exist, or real ones if they do. But we can't map strings to coords easily here, so we will show real coords if available, otherwise fallback. */}
                 {pendingRequestsForMap.map((req, i) => {
                    // For demonstration, since we don't have real lat/lng for old requests, we generate a slight offset from center
                    const lat = 2.0469 + (Math.random() - 0.5) * 0.05;
                    const lng = 45.3182 + (Math.random() - 0.5) * 0.05;
                    return (
                      <Marker key={req._id || i} position={[lat, lng]}>
                        <Popup>
                          <div className="font-bold text-slate-900">{req.serviceType}</div>
                          <div className="text-sm text-slate-600">{req.address}</div>
                          <div className="text-xs text-emerald-600 font-bold mt-1 uppercase">{req.status}</div>
                        </Popup>
                      </Marker>
                    );
                 })}
               </MapContainer>
             </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Recent Pickup Requests</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('report-history'); }} className="text-sm font-medium text-[#047857] hover:underline">View All History</a>
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
                       {requests.slice(0, 5).map((request, index) => (
                         <tr key={request._id || index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{request.name}</td>
                            <td className="px-6 py-4">{request.address}</td>
                            <td className="px-6 py-4">{new Date(request.timeSlot).toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${request.status === 'completed' ? 'bg-[#047857] text-white' : request.status === 'cancelled' ? 'bg-red-100 text-red-700' : request.status === 'accepted' ? 'bg-blue-100 text-blue-700' : request.status === 'scheduled' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
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
