import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ComplaintCard from '../components/ComplaintCard';
import { CATEGORIES, PRIORITIES, STATUSES } from '../types';

const ComplaintTracking: React.FC = () => {
  const { complaints } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = category ? c.category === category : true;
    const matchPri = priority ? c.priority === priority : true;
    const matchStat = status ? c.status === status : true;
    return matchSearch && matchCat && matchPri && matchStat;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPriority('');
    setStatus('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Track Complaints</h1>

      <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
        <input 
          type="text" 
          placeholder="Search by ID or Title..." 
          className="input-field flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="input-field bg-slate-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="input-field bg-slate-800"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select 
          className="input-field bg-slate-800"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={clearFilters} className="btn-secondary px-4">Clear Filters</button>
      </div>

      <div className="text-gray-400 text-sm">
        Showing {filtered.length} of {complaints.length} complaints
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-gray-400">No complaints match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(c => (
            <ComplaintCard key={c.id} complaint={c} onClick={() => navigate(`/complaint/${c.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintTracking;
