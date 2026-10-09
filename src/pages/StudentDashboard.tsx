import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, PlusCircle, ClipboardList, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';
import EmergencyAlert from '../components/EmergencyAlert';

const StudentDashboard: React.FC = () => {
  const { complaints } = useApp();
  const navigate = useNavigate();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const activeEmergencies = complaints.filter(c => c.isEmergency && c.status !== 'Resolved');
  const escalated = complaints.filter(c => c.escalated && c.status !== 'Resolved');

  const recent = [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to <span className="gradient-text">CampusCare AI</span></h1>
        <p className="text-gray-400">Talk naturally. CampusCare does the rest.</p>
      </div>

      {activeEmergencies.length > 0 && (
        <div className="space-y-4">
          {activeEmergencies.map(em => (
            <EmergencyAlert key={em.id} complaint={em} />
          ))}
        </div>
      )}

      {escalated.length > 0 && (
        <div className="glass-card border-l-4 border-l-orange-500 bg-orange-500/10 text-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-500" />
            <p>You have {escalated.length} escalated {escalated.length === 1 ? 'issue' : 'issues'} awaiting priority resolution.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card border-l-4 border-l-blue-500 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <ClipboardList className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{total}</p>
          </div>
        </div>
        <div className="glass-card border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg">
            <Clock className="text-amber-400" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-white">{pending}</p>
          </div>
        </div>
        <div className="glass-card border-l-4 border-l-purple-500 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <LayoutDashboard className="text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-white">{inProgress}</p>
          </div>
        </div>
        <div className="glass-card border-l-4 border-l-green-500 flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <CheckCircle className="text-green-400" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-white">{resolved}</p>
          </div>
        </div>
      </div>

      <div className="my-8">
        <button
          onClick={() => navigate('/report')}
          className="btn-primary w-full md:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <PlusCircle size={24} />
          Report New Issue
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-400" />
          Recent Complaints
        </h2>
        
        {recent.length === 0 ? (
          <div className="glass-card text-center py-12">
            <CheckCircle className="mx-auto text-gray-500 mb-3" size={48} />
            <p className="text-gray-400">No complaints reported yet. Everything looks good!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recent.map(complaint => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onClick={() => navigate(`/complaint/${complaint.id}`)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
