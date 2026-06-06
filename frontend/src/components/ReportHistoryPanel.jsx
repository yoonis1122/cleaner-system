import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, Clock, Activity, ListTodo } from 'lucide-react';

const ReportHistoryPanel = ({ requests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter for completed requests only
  const completedTasks = requests.filter(t => t.status === 'completed' && (
    (t.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (t.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="p-8 h-full flex flex-col font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Report History</h2>
          <p className="text-slate-500 mt-1">Review all completed pickup jobs and service history.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
            <FileText className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" /> Completed Jobs
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{completedTasks.length} Jobs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ListTodo className="w-10 h-10 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h4>
              <p className="text-slate-500 text-sm max-w-sm">There are no completed jobs matching your search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {completedTasks.map(task => (
                <div key={task._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/80 transition-colors group gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 group-hover:scale-105 transition-all">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 truncate max-w-md" title={task.address}>{task.address}</h4>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{task.name} <span className="text-slate-400 font-normal">({task.phoneNumber})</span></p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> 
                          {new Date(task.updatedAt || task.timeSlot).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <p className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-md">
                          {task.serviceType || 'General Waste'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2">
                    <p className="text-lg font-bold text-slate-900">${task.price || 10}.00</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportHistoryPanel;
