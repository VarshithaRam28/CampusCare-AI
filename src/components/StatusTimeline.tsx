import React from 'react';
import type { Status } from '../types';
import { Check, AlertTriangle, Circle, Dot } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: Status;
  escalated: boolean;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, escalated }) => {
  const baseSteps: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
  
  // Find current index to determine progress
  let currentIndex = baseSteps.indexOf(currentStatus);
  if (currentStatus === 'Escalated') {
    currentIndex = 2; // Treat as just after Under Review for visual purposes
  }

  const renderStep = (status: Status, index: number, isLast: boolean) => {
    let isCompleted = index < currentIndex || currentStatus === 'Resolved';
    let isCurrent = currentStatus === status || (status === 'In Progress' && currentStatus === 'Escalated');
    
    // For specific UI states
    if (status === 'Resolved' && currentStatus === 'Resolved') {
      isCompleted = true;
      isCurrent = false;
    }

    return (
      <div key={status} className="relative flex items-start group">
        {!isLast && (
          <div className="absolute top-6 left-3.5 -bottom-6 w-0.5 bg-gray-800">
            {isCompleted && (
              <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-500" />
            )}
          </div>
        )}
        
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full mt-0.5 bg-gray-900 border-2 z-10 shrink-0
          ${isCompleted ? 'border-blue-500 bg-blue-500/20 text-blue-400' : isCurrent ? 'border-purple-400 bg-purple-500/20 text-purple-400 animate-pulse' : 'border-gray-700 text-gray-600'}
        ">
          {isCompleted ? <Check size={14} /> : isCurrent ? <Dot size={20} /> : <Circle size={10} />}
        </div>
        
        <div className="ml-4 pb-8 pt-1">
          <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
            {status}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full py-4 px-2">
      {baseSteps.map((step, idx) => (
        <React.Fragment key={step}>
          {step === 'Resolved' && escalated && (
            <div className="relative flex items-start group">
              <div className="absolute top-6 left-3.5 -bottom-6 w-0.5 bg-gray-800" />
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full mt-0.5 bg-red-900/30 border-2 border-red-500 text-red-400 z-10 shrink-0">
                <AlertTriangle size={12} />
              </div>
              <div className="ml-4 pb-8 pt-1">
                <p className="text-sm font-medium text-red-400">Escalated</p>
              </div>
            </div>
          )}
          {renderStep(step, idx, idx === baseSteps.length - 1)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusTimeline;
