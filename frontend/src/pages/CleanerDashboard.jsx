import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, Map, ListTodo, DollarSign, BarChart, Settings,
  LogOut, Bell, MapPin, CheckCircle2, Star, Activity, Camera,
  MapPinOff, ArrowUpRight, Check, Leaf, ChevronRight, Clock
} from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

const CleanerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const navigate = useNavigate();

  const getNavClass = (tabId) => {
    if (activeTab === tabId) {
      return "flex items-center gap-3 px-4 py-3 bg-[#047857]/20 text-[#10b981] rounded-xl font-medium shadow-sm border border-[#10b981]/20";
    }
    return "flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white text-slate-400 rounded-xl font-medium transition-colors";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = userInfo?.token;
        if (!token) return;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const { data } = await axios.get('/api/requests', config);
        setTasks(data);
        setLoadingTasks(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setLoadingTasks(false);
      }
    };
    if (userInfo) {
      fetchTasks();
    }
  }, [userInfo]);

  const handleAcceptJob = async (taskId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.put(`/api/requests/${taskId}`, { status: 'accepted' }, config);
      toast.success('Job accepted successfully!');
      setTasks(tasks.map(t => t._id === taskId ? data : t));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to accept job');
    }
  };

  const handleCompleteJob = async (taskId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.put(`/api/requests/${taskId}`, { status: 'completed' }, config);
      toast.success('Job marked as completed!');
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to complete job');
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const activeTasks = tasks.filter(t => t.status === 'accepted' || t.status === 'ongoing');
  const completedTasks = tasks.filter(t => t.status === 'completed');

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
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <Leaf className="w-6 h-6 text-[#10b981] mr-2" />
          <span className="font-bold text-lg text-white tracking-tight">Cleaners</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className={getNavClass('dashboard')}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#10b981]' : ''}`} /> Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('task-discovery'); }} className={getNavClass('task-discovery')}>
            <Map className={`w-5 h-5 ${activeTab === 'task-discovery' ? 'text-[#10b981]' : ''}`} /> Task Discovery
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('active-tasks'); }} className={getNavClass('active-tasks')}>
            <ListTodo className={`w-5 h-5 ${activeTab === 'active-tasks' ? 'text-[#10b981]' : ''}`} /> My Active Tasks
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('report-history'); }} className={getNavClass('report-history')}>
            <Clock className={`w-5 h-5 ${activeTab === 'report-history' ? 'text-[#10b981]' : ''}`} /> Report History
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-2 py-2 hover:text-white transition-colors text-sm font-medium w-full text-left">
            <LogOut className="w-4 h-4 text-slate-400" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Live Dispatch
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="pl-6 border-l border-slate-200 flex items-center">
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
                 <div className="hidden sm:block">
                    <p className="text-slate-700 text-sm font-bold">{userInfo?.name || 'User'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <div id="dashboard" className="grid grid-cols-3 gap-6 mb-8 scroll-mt-24">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2">Jobs Done</p>
                <p className="text-3xl font-bold text-slate-900">{completedTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <Check className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2">Rating</p>
                <p className="text-3xl font-bold text-slate-900">4.9</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                 <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2">Efficiency</p>
                <p className="text-3xl font-bold text-slate-900">98%</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                 <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
          )}

          <div className={activeTab === 'dashboard' ? "grid md:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
             
             {/* Map Area */}
             {(activeTab === 'dashboard' || activeTab === 'task-discovery') && (
             <div className={activeTab === 'dashboard' ? "md:col-span-2 flex flex-col" : "flex flex-col w-full"}>
                <div className="flex items-center justify-between mb-4">
                   <h2 id="task-discovery" className="text-xl font-bold text-slate-900 scroll-mt-24">Task Discovery</h2>
                   <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-[#047857] text-white text-xs font-bold rounded-lg">Refresh</button>
                   </div>
                </div>

                <div className="flex-1 bg-[#e2e8f0] rounded-2xl overflow-hidden relative min-h-[500px] border border-slate-200 shadow-sm">
                   {/* Light Map Background */}
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale"></div>
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                   
                   {/* Overlay Top Bar */}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 z-10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-bold text-slate-800">{pendingTasks.length} Live Jobs Found</span>
                   </div>

                   {/* Render Pending Tasks as Cards on the Map */}
                   <div className="absolute inset-0 p-6 pt-20 overflow-y-auto z-0 flex flex-wrap gap-4 items-start justify-center">
                     {loadingTasks ? (
                        <div className="w-full text-center mt-20 text-slate-600 font-bold bg-white/80 backdrop-blur py-4 rounded-xl">Loading tasks...</div>
                     ) : pendingTasks.length === 0 ? (
                        <div className="w-full text-center mt-20 text-slate-600 font-bold bg-white/80 backdrop-blur py-4 rounded-xl">No pending tasks available at the moment.</div>
                     ) : (
                       pendingTasks.map((task) => (
                         <div key={task._id} className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl border border-slate-200 w-80 relative transition-transform hover:-translate-y-1">
                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm border border-emerald-200">
                               <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex justify-between items-start mb-2 ml-4">
                               <h3 className="font-bold text-slate-900 truncate" title={task.address}>{task.address.split(',')[0] || 'Unknown Location'}</h3>
                            </div>
                            <div className="flex items-center justify-between mb-4 mt-2">
                               <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPinOff className="w-3 h-3" /> {task.serviceType || 'General Cleaning'}
                               </p>
                               <p className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                  {new Date(task.timeSlot).toLocaleString()}
                               </p>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                               <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                  View on Map
                               </a>
                            </div>
                            <div className="text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded border border-slate-100">
                              <p className="font-semibold">Full Address:</p>
                              <p>{task.address}</p>
                              <p className="mt-1 text-slate-500">Requested by: {task.name || task.userId?.name || 'Customer'}</p>
                              <p className="mt-1 text-slate-500">Phone: {task.phoneNumber}</p>
                            </div>
                            <button onClick={() => handleAcceptJob(task._id)} className="w-full py-2.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl transition-colors shadow-sm">
                               Accept Job
                            </button>
                         </div>
                       ))
                     )}
                   </div>
                </div>
             </div>
             )}

             {/* Active Tasks Panel */}
             {(activeTab === 'dashboard' || activeTab === 'active-tasks') && (
             <div className={activeTab === 'dashboard' ? "flex flex-col" : "flex flex-col w-full max-w-2xl mx-auto"}>
                <h2 id="active-tasks" className="text-xl font-bold text-slate-900 mb-4 scroll-mt-24">Active Tasks</h2>
                
                {activeTasks.length === 0 ? (
                  <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 text-center text-slate-500 font-medium">
                     No active tasks. Accept a job from the map to get started.
                  </div>
                ) : (
                  activeTasks.map(task => (
                    <div key={task._id} className="bg-[#f8fafc] rounded-2xl border-2 border-[#10b981] shadow-md p-6 mb-4 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981]"></div>
                       
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <p className="text-[#047857] text-[10px] font-bold tracking-widest uppercase mb-1">{new Date(task.timeSlot).toLocaleString()}</p>
                             <h3 className="text-xl font-black text-slate-900 truncate" title={`#${task._id}`}>#{task._id.substring(0, 8).toUpperCase()}</h3>
                          </div>
                          <span className="px-2.5 py-1 bg-[#047857] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">{task.serviceType}</span>
                       </div>

                       <div className="flex items-start gap-3 mb-6 bg-white p-3 rounded-xl border border-slate-100">
                          <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                             <MapPin className="w-4 h-4 text-[#047857]" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                             <p className="font-bold text-slate-900 text-sm truncate" title={task.address}>{task.address}</p>
                             <p className="text-xs text-slate-500 mt-0.5">Requested by: {task.name || task.userId?.name || 'Customer'}</p>
                             <p className="text-xs text-slate-500 mt-0.5">Phone: {task.phoneNumber}</p>
                          </div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                             View Map
                          </a>
                       </div>

                       <div className="flex gap-4 mb-6">
                          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                             <p className="font-bold text-slate-900 capitalize">{task.status}</p>
                          </div>
                       </div>

                       <div>
                          <button onClick={() => handleCompleteJob(task._id)} className="w-full py-3.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                             <CheckCircle2 className="w-5 h-5" /> Mark as Completed
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
             )}

             {/* Report History Panel */}
             {(activeTab === 'report-history') && (
                <div className="flex flex-col gap-6">
                   <h2 id="report-history" className="text-xl font-bold text-slate-900 scroll-mt-24">Report History</h2>
                   
                   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" /> Completed Jobs
                         </h3>
                         <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{completedTasks.length} Jobs</span>
                      </div>
                      
                      {completedTasks.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                               <ListTodo className="w-10 h-10 text-slate-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">No jobs completed yet</h4>
                            <p className="text-slate-500 text-sm max-w-sm">You haven't completed any jobs yet. Head over to the map to accept new tasks!</p>
                         </div>
                      ) : (
                         <div className="divide-y divide-slate-100">
                            {completedTasks.map(task => (
                               <div key={task._id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                                  <div className="flex items-center gap-5">
                                     <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 group-hover:scale-105 transition-all">
                                        <CheckCircle2 className="w-7 h-7" />
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md" title={task.address}>{task.address}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                           <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                              <Clock className="w-3.5 h-3.5" /> 
                                              {new Date(task.updatedAt || task.timeSlot).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                           </p>
                                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                           <p className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-md">
                                              {task.serviceType || 'Cleaning Job'}
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Completed</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>
                </div>
             )}


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

export default CleanerDashboard;
