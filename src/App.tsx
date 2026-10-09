import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

import StudentDashboard from './pages/StudentDashboard';
import ReportIssue from './pages/ReportIssue';
import ComplaintTracking from './pages/ComplaintTracking';
import ComplaintDetail from './pages/ComplaintDetail';
import CampusAssistant from './pages/CampusAssistant';
import AdminDashboard from './pages/AdminDashboard';
import HeatMapPage from './pages/HeatMapPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/tracking" element={<ComplaintTracking />} />
            <Route path="/complaint/:id" element={<ComplaintDetail />} />
            <Route path="/assistant" element={<CampusAssistant />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/heatmap" element={<HeatMapPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
