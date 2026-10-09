import React from 'react';
import type { Complaint } from '../types';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { MapPin, Tag, Building } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  const date = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const isEmergency = complaint.isEmergency;
  const isEscalated = complaint.escalated;

  const cardClasses = `glass-card glass-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300
    ${isEmergency ? 'glow-red border border-red-500/50' : isEscalated ? 'border border-red-500/30' : 'border border-white/10'}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {isEmergency && <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white line-clamp-1 flex-1 pr-3">
          {complaint.title}
        </h3>
        <PriorityBadge priority={complaint.priority} size="sm" />
      </div>

      <div className="text-gray-400 text-sm line-clamp-2 mb-4">
        {complaint.description}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center text-xs text-gray-300 bg-white/5 rounded-full px-2.5 py-1">
          <Tag size={12} className="mr-1.5 text-blue-400" />
          {complaint.category}
        </div>
        <div className="flex items-center text-xs text-gray-300 bg-white/5 rounded-full px-2.5 py-1">
          <Building size={12} className="mr-1.5 text-purple-400" />
          {complaint.department}
        </div>
        {complaint.location && (
          <div className="flex items-center text-xs text-gray-300 bg-white/5 rounded-full px-2.5 py-1">
            <MapPin size={12} className="mr-1.5 text-pink-400" />
            {complaint.location}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">Status</span>
          <StatusBadge status={complaint.status} />
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">{date}</span>
          <span className="text-[10px] text-gray-600 mt-1">ID: {complaint.id}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
