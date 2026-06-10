import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, User, MapPin, Phone, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserBookingModal = ({ isOpen, onClose, userInfo, onScheduleCreated }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(userInfo?.name || '');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !phoneNumber || !timeSlot || !price) {
      return toast.error('All fields are required');
    }
    if (isNaN(price) || Number(price) <= 0) {
      return toast.error('Please enter a valid amount');
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 1. Create schedule and PaymentIntent on server
      const { data } = await axios.post('/api/users/book-pickup', {
        name,
        address,
        phoneNumber,
        timeSlot,
        price: Number(price)
      }, config);

      const { schedule } = data;

      if(onScheduleCreated) {
        onScheduleCreated(schedule);
      }
      onClose();

      // Navigate to checkout page
      navigate('/checkout', { 
        state: { 
          scheduleId: schedule._id,
          price: schedule.price,
          returnUrl: '/manager'
        } 
      });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8 relative" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#047857] rounded-t-2xl">
          <div>
             <h3 className="text-xl font-bold text-white">Book a Pickup</h3>
             <p className="text-emerald-100 text-sm mt-1">Set your custom price</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 absolute top-6 right-6">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter full name"
            className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter full address or location"
            className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Enter phone number"
            className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time Slot</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="datetime-local" 
            value={timeSlot} 
            onChange={(e) => setTimeSlot(e.target.value)} 
            className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
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
            className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
          />
        </div>
      </div>

      <div className="pt-4 flex items-center gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 px-4 bg-[#047857] text-white font-medium rounded-lg hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center disabled:opacity-70">
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
      </div>
    </form>
      </div>
    </div>
  );
};

export default UserBookingModal;
