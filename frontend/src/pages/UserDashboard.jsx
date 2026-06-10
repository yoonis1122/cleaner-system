import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Leaf, LogOut, MapPin, Package, Clock, CheckCircle2, AlertCircle, Download, TreePine, Map } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';
import MapPicker from '../components/MapPicker';
import jsPDF from 'jspdf';

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
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
    const fetchProfile = async (token) => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('/api/users/profile', config);
        setUserInfo({ ...res.data, token });
      } catch (err) {
        console.error('Failed to fetch latest profile');
      }
    };

    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      fetchProfile(parsedUser.token); // Refresh to get latest ecoPoints
      fetchMyRequests(parsedUser.token);
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
    if (!address || !phoneNumber || !timeSlot || !price) return toast.error('Please enter all required fields');
    if (isNaN(price) || Number(price) <= 0) return toast.error('Please enter a valid price');

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const newRequest = {
        name: userInfo.name || 'User',
        phoneNumber,
        timeSlot,
        address,
        price: Number(price)
      };

      const { data } = await axios.post('/api/users/book-pickup', newRequest, config);
      const { schedule } = data;
      
      // Navigate to checkout
      navigate('/checkout', { 
        state: { 
          scheduleId: schedule._id,
          price: schedule.price
        } 
      });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReceipt = (req) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(4, 120, 87); // Emerald 700
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CLEANERS SYSTEM", 20, 25);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Payment Receipt", 140, 25);
    
    // Body
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 20, 60);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Receipt No: #${req.waafiReferenceId || req._id.substring(0,8).toUpperCase()}`, 20, 75);
    doc.text(`Date Paid: ${new Date(req.updatedAt).toLocaleString()}`, 20, 85);
    doc.text(`Customer Name: ${req.name}`, 20, 95);
    doc.text(`Phone Number: ${req.phoneNumber}`, 20, 105);
    doc.text(`Address / Location: ${req.address}`, 20, 115);
    doc.text(`Service Type: ${req.serviceType}`, 20, 125);
    
    // Total Amount Box
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(20, 140, 170, 30, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount Paid:", 30, 158);
    doc.setTextColor(4, 120, 87); // Emerald 700
    doc.setFontSize(16);
    doc.text(`$${req.price.toFixed(2)} USD`, 140, 158);
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for contributing to a cleaner environment!", 105, 200, { align: 'center' });
    doc.text("Cleaners System - Eco-friendly Logistics.", 105, 210, { align: 'center' });

    doc.save(`Cleaners_Receipt_${req._id.substring(0,6)}.pdf`);
    toast.success("Receipt downloaded successfully!");
  };

  const renderTimeline = (status) => {
    const steps = ['pending', 'scheduled', 'accepted', 'completed'];
    const currentStepIndex = steps.indexOf(status);
    
    return (
      <div className="flex items-center w-full mt-4">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex flex-col items-center relative z-10`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index <= currentStepIndex ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${index <= currentStepIndex ? 'text-emerald-700' : 'text-slate-400'}`}>
                {step === 'accepted' ? 'En Route' : step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full ${index < currentStepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      
      {/* Top Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
             <Leaf className="w-6 h-6 text-[#10b981]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Cleaners</span>
        </div>
        
        {/* EcoPoints Widget */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm">
           <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>{userInfo?.ecoPoints || 0} EcoPoints</span>
           </div>
           <div className="w-px h-4 bg-emerald-200"></div>
           <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <TreePine className="w-4 h-4" />
              <span>{Math.floor((userInfo?.ecoPoints || 0) / 50)} Trees Saved</span>
           </div>
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
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid md:grid-cols-3 gap-8 relative z-10">
        
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
                <MapPicker setAddress={setAddress} />
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Payment Amount ($)</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">$</span>
                   </div>
                   <input 
                     type="number" 
                     min="0.01"
                     step="0.01"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     placeholder="Enter amount (e.g. 15.00)" 
                     className="pl-10 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                   />
                </div>
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
          {/* Mobile EcoPoints Widget */}
          <div className="md:hidden flex items-center justify-between mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
             <div className="flex flex-col">
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Your Balance</span>
                <span className="text-xl font-black text-emerald-800">{userInfo?.ecoPoints || 0} EcoPoints</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Impact</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1"><TreePine className="w-4 h-4"/> {Math.floor((userInfo?.ecoPoints || 0) / 50)} Trees</span>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
             <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">My Pickups</h2>
                   <p className="text-slate-500 text-sm">Track your live pickup progress and history.</p>
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
                   <div className="space-y-6">
                      {requests.map(req => (
                         <div key={req._id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-4 transition-all hover:border-emerald-300">
                            
                            <div className="flex items-start justify-between">
                               <div>
                                  <div className="flex items-center gap-2 mb-1">
                                     <span className="font-black text-slate-900 text-lg uppercase tracking-wide">{req.serviceType}</span>
                                  </div>
                                  <div className="flex flex-col gap-1 text-sm text-slate-500 mt-2">
                                     <span className="flex items-center gap-1.5"><Map className="w-4 h-4 text-emerald-600" /> {req.address}</span>
                                     <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {req.timeSlot ? new Date(req.timeSlot).toLocaleString() : new Date(req.createdAt).toLocaleDateString()}</span>
                                  </div>
                               </div>
                               <div className="text-right flex flex-col items-end gap-2">
                                  <p className="text-2xl font-black text-emerald-600">${req.price.toFixed(2)}</p>
                                  {(req.status === 'scheduled' || req.status === 'completed' || req.status === 'accepted') && (
                                     <button 
                                       onClick={() => generatePDFReceipt(req)}
                                       className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                                     >
                                       <Download className="w-3 h-3" /> Receipt
                                     </button>
                                  )}
                               </div>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-100">
                               {renderTimeline(req.status)}
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
