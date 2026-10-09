import React from 'react';
import type { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-500 border border-red-500/30 glow-red';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-500 border border-amber-500/30 glow-amber';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-500 border border-green-500/30 glow-green';
      default:
        return 'bg-gray-500/20 text-gray-500 border border-gray-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase ${sizeClasses[size]} ${getPriorityStyles(priority)}`}
    >
      {priority === 'CRITICAL' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {priority}
    </span>
  );
};

export default PriorityBadge;
