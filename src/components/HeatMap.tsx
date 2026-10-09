import React from 'react';
import type { Complaint } from '../types';
import { MapPin } from 'lucide-react';

interface HeatMapProps {
  complaints: Complaint[];
}

const LOCATIONS = [
  'Main Block', 'CSE Block', 'ECE Block', 'Library', 
  'Hostel A', 'Hostel B', 'Cafeteria', 'Sports Area', 
  'Parking', 'Admin Block', 'Auditorium', 'Lab Complex'
];

const HeatMap: React.FC<HeatMapProps> = ({ complaints }) => {
  const getHeatData = (locationName: string) => {
    const count = complaints.filter(c => 
      c.location?.toLowerCase().includes(locationName.toLowerCase()) || 
      c.building?.toLowerCase().includes(locationName.toLowerCase())
    ).length;

    let level = 'NONE';
    let colorClass = 'bg-gray-800/50 border-gray-700 text-gray-400';
    let glowClass = '';

    if (count > 0 && count <= 3) {
      level = 'LOW';
      colorClass = 'bg-green-500/20 border-green-500/50 text-green-300';
      glowClass = 'glow-green';
    } else if (count >= 4 && count <= 7) {
      level = 'MEDIUM';
      colorClass = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
      glowClass = 'glow-amber';
    } else if (count >= 8) {
      level = 'HIGH';
      colorClass = 'bg-red-500/20 border-red-500/50 text-red-300';
      glowClass = 'glow-red';
    }

    return { count, level, colorClass, glowClass };
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="text-purple-400" />
          Campus Problem Heat Map
        </h2>
        
        <div className="flex gap-4 text-xs font-medium bg-black/30 p-2 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-gray-700"></span> None
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> Low (1-3)
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span> Med (4-7)
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span> High (8+)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-[#0B1120] rounded-xl border border-white/5 relative overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        
        {LOCATIONS.map((loc) => {
          const { count, level, colorClass, glowClass } = getHeatData(loc);
          return (
            <div 
              key={loc} 
              className={`relative flex flex-col p-4 rounded-xl border backdrop-blur-sm transition-all hover:-translate-y-1 ${colorClass} ${glowClass}`}
            >
              <span className="font-semibold text-sm mb-2">{loc}</span>
              <div className="flex justify-between items-end mt-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  {level !== 'NONE' ? `${level} PRIORITY` : 'CLEAR'}
                </span>
                <span className="text-2xl font-bold tabular-nums leading-none">
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatMap;
