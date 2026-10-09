import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HeatMap from '../components/HeatMap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Status, Priority } from '../types';

const AdminDashboard: React.FC = () => {
  const { complaints, updateComplaint } = useApp();
  const navigate = useNavigate();

  const total = complaints.length;
  const critical = complaints.filter(c => c.priority === 'CRITICAL').length;
  const high = complaints.filter(c => c.priority === 'HIGH').length;
  const pending = complaints.filter(c => c.status === 'Submitted').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Under Review').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const escalatedCount = complaints.filter(c => c.escalated && c.status !== 'Resolved').length;

  const escalatedList = complaints.filter(c => c.escalated && c.status !== 'Resolved');

  const catData = complaints.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += 1;
    else acc.push({ name: curr.category, value: 1 });
    return acc;
  }, [] as any[]);

  const priData = [
    { name: 'LOW', value: complaints.filter(c => c.priority === 'LOW').length },
    { name: 'MEDIUM', value: complaints.filter(c => c.priority === 'MEDIUM').length },
    { name: 'HIGH', value: high },
    { name: 'CRITICAL', value: critical }
  ].filter(d => d.value > 0);

  const statData = [
    { name: 'Submitted', value: pending },
    { name: 'Under Review', value: complaints.filter(c => c.status === 'Under Review').length },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length },
    { name: 'Resolved', value: resolved }
  ].filter(d => d.value > 0);

  const PRIORITY_COLORS = { 'LOW': '#22c55e', 'MEDIUM': '#eab308', 'HIGH': '#f97316', 'CRITICAL': '#ef4444' };
  const STATUS_COLORS = ['#3b82f6', '#8b5cf6', '#a855f7', '#22c55e'];

  const ratedComplaints = complaints.filter(c => c.rating !== null);
  const avgRating = ratedComplaints.length > 0 
    ? (ratedComplaints.reduce((acc, c) => acc + (c.rating || 0), 0) / ratedComplaints.length).toFixed(1)
    : 'N/A';

  const handleStatusChange = (id: string, status: Status) => {
    updateComplaint(id, { status });
  };
  const handlePriorityChange = (id: string, priority: Priority) => {
    updateComplaint(id, { priority });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total', value: total, color: 'text-blue-400', border: 'border-l-blue-500' },
          { label: 'Critical', value: critical, color: 'text-red-400', border: 'border-l-red-500' },
          { label: 'High Priority', value: high, color: 'text-orange-400', border: 'border-l-orange-500' },
          { label: 'Pending', value: pending, color: 'text-amber-400', border: 'border-l-amber-500' },
          { label: 'In Progress', value: inProgress, color: 'text-purple-400', border: 'border-l-purple-500' },
          { label: 'Resolved', value: resolved, color: 'text-green-400', border: 'border-l-green-500' },
          { label: 'Escalated', value: escalatedCount, color: 'text-red-500', border: 'border-l-red-500' },
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-4 border-l-4 ${stat.border}`}>
            <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card min-h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={catData}>
              <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis tick={{fill: '#94a3b8'}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="glass-card min-h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {priData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as Priority]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} />
              <Legend wrapperStyle={{color: '#cbd5e1'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card min-h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statData} layout="vertical">
              <XAxis type="number" tick={{fill: '#94a3b8'}} />
              <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} />
              <Bar dataKey="value" radius={[0,4,4,0]}>
                {statData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card min-h-[300px] flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Feedback Summary</h3>
          <div className="text-6xl text-yellow-400 font-bold mb-2">{avgRating}</div>
          <div className="text-yellow-400 text-2xl mb-4">★</div>
          <p className="text-gray-400">Average Resolution Rating</p>
          <p className="text-sm text-gray-500 mt-2">Based on {ratedComplaints.length} rated complaints</p>
        </div>
      </div>

      {escalatedList.length > 0 && (
        <div className="glass-card border border-red-500/30">
          <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Escalated Complaints Action Required</h3>
          <div className="space-y-3">
            {escalatedList.map(c => (
              <div key={c.id} className="bg-slate-800/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex gap-3 items-center mb-1">
                    <span className="font-mono text-blue-400">{c.id}</span>
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs border border-red-500/20">{c.priority}</span>
                  </div>
                  <h4 className="text-white font-medium">{c.title}</h4>
                </div>
                <button 
                  onClick={() => handleStatusChange(c.id, 'Resolved')} 
                  className="btn-secondary whitespace-nowrap bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                >
                  Resolve Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Complaints Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-slate-800/50 text-gray-300 uppercase">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[...complaints].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10).map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue-400">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{c.title}</td>
                  <td className="px-4 py-3">
                    <select 
                      className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as Status)}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      className={`text-xs p-1 rounded border focus:outline-none
                        ${c.priority === 'CRITICAL' ? 'bg-red-900/30 text-red-400 border-red-500/30' : ''}
                        ${c.priority === 'HIGH' ? 'bg-orange-900/30 text-orange-400 border-orange-500/30' : ''}
                        ${c.priority === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : ''}
                        ${c.priority === 'LOW' ? 'bg-green-900/30 text-green-400 border-green-500/30' : ''}
                      `}
                      value={c.priority}
                      onChange={(e) => handlePriorityChange(c.id, e.target.value as Priority)}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => navigate(`/complaint/${c.id}`)} className="text-blue-400 hover:text-blue-300 underline text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Heat Map Overview</h3>
        <div className="h-[400px]">
          <HeatMap complaints={complaints} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
