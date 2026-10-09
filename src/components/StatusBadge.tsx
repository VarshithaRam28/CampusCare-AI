import React from 'react';
import type { Status } from '../types';
import { AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (s: Status) => {
    switch (s) {
      case 'Submitted':
        return { classes: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', dot: 'bg-blue-400' };
      case 'Under Review':
        return { classes: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', dot: 'bg-purple-400' };
      case 'In Progress':
        return { classes: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', dot: 'bg-amber-400' };
      case 'Resolved':
        return { classes: 'bg-green-500/20 text-green-400 border border-green-500/30', dot: 'bg-green-400' };
      case 'Escalated':
        return { classes: 'bg-red-500/20 text-red-400 border border-red-500/30', dot: 'bg-red-400', icon: true };
      default:
        return { classes: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', dot: 'bg-gray-400' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-xs px-2.5 py-1 font-medium ${config.classes}`}>
      {config.icon ? (
        <AlertTriangle size={12} className="text-red-400" />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
