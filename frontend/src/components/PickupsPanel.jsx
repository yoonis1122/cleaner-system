import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

const PickupsPanel = ({ schedules, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filter schedules based on search term and selected status
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = (schedule.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (schedule.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && schedule.status === filter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#047857] text-white"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'accepted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</span>;
      case 'assigned':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700"><Truck className="w-3.5 h-3.5" /> Assigned</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pickups Management</h2>
          <p className="text-slate-500 mt-1">View and manage all pickup requests and schedules.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              All Pickups
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'pending' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              Completed
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100 sticky top-0">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Scheduled Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{schedule.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{schedule.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{schedule.address}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{new Date(schedule.timeSlot).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(schedule.timeSlot).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(schedule.status || 'pending')}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === schedule._id ? null : schedule._id)} 
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdown === schedule._id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveDropdown(null)}
                        ></div>
                        <div className="absolute right-6 top-12 w-32 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-1 overflow-hidden">
                          <button 
                            onClick={() => { onUpdateStatus(schedule._id, 'pending'); setActiveDropdown(null); }} 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                          >
                            Pending
                          </button>
                          <button 
                            onClick={() => { onUpdateStatus(schedule._id, 'accepted'); setActiveDropdown(null); }} 
                            className="w-full text-left px-4 py-2 text-sm text-[#047857] hover:bg-slate-50 font-medium transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => { onUpdateStatus(schedule._id, 'cancelled'); setActiveDropdown(null); }} 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSchedules.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">No pickups found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PickupsPanel;
