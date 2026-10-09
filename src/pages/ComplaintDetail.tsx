import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import StatusTimeline from '../components/StatusTimeline';
import PriorityBadge from '../components/PriorityBadge';
import EmergencyAlert from '../components/EmergencyAlert';
import FeedbackModal from '../components/FeedbackModal';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complaints, updateComplaint } = useApp();
  const [showFeedback, setShowFeedback] = useState(false);

  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Complaint Not Found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="font-mono text-blue-400 font-bold bg-blue-900/20 px-3 py-1 rounded-md">
          {complaint.id}
        </span>
      </div>

      {complaint.isEmergency && complaint.status !== 'Resolved' && (
        <EmergencyAlert complaint={complaint} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card">
            <h1 className="text-2xl font-bold text-white mb-4">{complaint.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm">{complaint.category}</span>
              <span className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm">{complaint.department}</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Formal Complaint</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap text-gray-300">
                  {complaint.formalComplaint}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Original Description</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap text-gray-400 italic">
                  {complaint.description}
                </div>
              </div>

              {complaint.imageUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Attached Image</h3>
                  <img src={complaint.imageUrl} alt="Complaint attachment" className="rounded-lg max-h-96 object-cover" />
                </div>
              )}

              {(complaint.location || complaint.building || complaint.room) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                  <p className="text-gray-300">{complaint.location} {complaint.building} {complaint.room}</p>
                </div>
              )}

              {complaint.safetyRisk && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <h3 className="text-red-400 font-semibold mb-1 flex items-center gap-2">
                    <AlertTriangle size={18} /> Safety Risk
                  </h3>
                  <p className="text-red-200">{complaint.safetyRisk}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            <StatusTimeline currentStatus={complaint.status} escalated={complaint.escalated} />
          </div>

          <div className="glass-card space-y-4">
            <div>
              <span className="block text-gray-400 text-sm mb-1">Priority</span>
              <PriorityBadge priority={complaint.priority} size="lg" />
            </div>
            {complaint.priorityReason && (
              <div>
                <span className="block text-gray-400 text-sm mb-1">Priority Reason</span>
                <p className="text-gray-200 text-sm">{complaint.priorityReason}</p>
              </div>
            )}
            <div className="pt-4 border-t border-slate-700">
              <span className="block text-gray-400 text-sm mb-1">Reported On</span>
              <p className="text-gray-200">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="block text-gray-400 text-sm mb-1">Target Resolution</span>
              <p className="text-gray-200">{new Date(complaint.deadline).toLocaleString()}</p>
            </div>
          </div>

          {complaint.escalated && complaint.status !== 'Resolved' && (
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg text-orange-200">
              <h3 className="font-semibold text-orange-400 mb-1">Escalated</h3>
              <p className="text-sm">This issue has missed its resolution deadline and has been escalated for priority handling.</p>
            </div>
          )}

          {complaint.status === 'Resolved' && complaint.rating == null && (
            <div className="glass-card text-center">
              <p className="text-gray-300 mb-4">This issue has been resolved. How did we do?</p>
              <button onClick={() => setShowFeedback(true)} className="btn-primary w-full">Rate Resolution</button>
            </div>
          )}

          {complaint.rating != null && (
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
              <div className="flex text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star}>{star <= (complaint.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              {complaint.feedback && <p className="text-gray-300 text-sm italic">"{complaint.feedback}"</p>}
            </div>
          )}
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          complaint={complaint}
          onClose={() => setShowFeedback(false)}
          onSubmit={(rating, feedback) => {
            updateComplaint(complaint.id, { rating, feedback });
            setShowFeedback(false);
          }}
        />
      )}
    </div>
  );
};

export default ComplaintDetail;
