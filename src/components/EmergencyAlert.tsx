import React from 'react';
import type { Complaint } from '../types';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface EmergencyAlertProps {
  complaint?: Complaint;
  message?: string;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ complaint, message }) => {
  return (
    <div className="relative overflow-hidden bg-red-950/40 border border-red-500/50 rounded-xl p-5 glow-red shadow-lg backdrop-blur-md animate-pulse" style={{ animationDuration: '2s' }}>
      {/* Background warning stripes */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)'
      }}></div>

      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 bg-red-500/20 rounded-full shrink-0 border border-red-500/30 text-red-500">
          <ShieldAlert size={28} />
        </div>
        
        <div>
          <h3 className="text-red-500 font-bold text-lg mb-1 flex items-center gap-2 tracking-wide uppercase">
            <AlertTriangle size={18} className="animate-ping" style={{ animationDuration: '1.5s' }} /> 
            Emergency Issue Detected
          </h3>
          
          <p className="text-red-200/90 text-sm mb-3">
            {message || 'This situation has been flagged as a critical safety risk.'}
          </p>
          
          {complaint?.safetyRisk && (
            <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/20 text-red-200 text-sm font-medium mb-3">
              <strong>Identified Risk:</strong> {complaint.safetyRisk}
            </div>
          )}
          
          <div className="bg-black/40 rounded border-l-4 border-red-500 p-3 text-sm text-gray-300">
            <strong>Guidance:</strong> Move away from the affected area and immediately contact appropriate campus emergency/security personnel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
