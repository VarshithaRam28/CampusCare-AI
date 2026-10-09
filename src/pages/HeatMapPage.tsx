import React from 'react';
import { useApp } from '../context/AppContext';
import HeatMap from '../components/HeatMap';

const HeatMapPage: React.FC = () => {
  const { complaints } = useApp();
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Campus Problem Heat Map</h1>
        <p className="text-gray-400">Visual overview of reported issues across campus locations</p>
      </div>

      <div className="glass-card mb-4 flex justify-between items-center">
        <span className="text-white font-medium">Total Active Complaints:</span>
        <span className="text-2xl font-bold text-red-400">{activeComplaints}</span>
      </div>

      <div className="glass-card h-[600px]">
        <HeatMap complaints={complaints} />
      </div>
    </div>
  );
};

export default HeatMapPage;
