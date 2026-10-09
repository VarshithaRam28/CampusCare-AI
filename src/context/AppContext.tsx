import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Complaint, AppNotification, UserRole } from '../types';
import { getInitialComplaints, getInitialNotifications } from '../data/seedData';
import { generateComplaintNotification } from '../services/notificationService';
import { loadFromStorage, saveToStorage, StorageKeys, clearStorage } from '../services/storageService';

interface AppContextType {
  complaints: Complaint[];
  notifications: AppNotification[];
  role: UserRole;
  setRole: (role: UserRole) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  addNotification: (notification: AppNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetData: () => void;
  getNextComplaintId: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = loadFromStorage<Complaint[]>(StorageKeys.COMPLAINTS, []);
    return stored.length ? stored : getInitialComplaints();
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const stored = loadFromStorage<AppNotification[]>(StorageKeys.NOTIFICATIONS, []);
    return stored.length ? stored : getInitialNotifications();
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return loadFromStorage<UserRole>(StorageKeys.ROLE, 'student');
  });

  useEffect(() => { saveToStorage(StorageKeys.COMPLAINTS, complaints); }, [complaints]);
  useEffect(() => { saveToStorage(StorageKeys.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(StorageKeys.ROLE, role); }, [role]);

  useEffect(() => {
    // Escalation check
    const now = new Date().getTime();
    let updated = false;
    const newComplaints = complaints.map(c => {
      if (c.status !== 'Resolved' && !c.escalated) {
        const deadline = new Date(c.deadline).getTime();
        if (now > deadline) {
          updated = true;
          return { ...c, escalated: true, status: 'Escalated' as const };
        }
      }
      return c;
    });

    if (updated) {
      setComplaints(newComplaints);
      const newNotifs = [...notifications];
      newComplaints.forEach(c => {
        if (c.escalated && c.status === 'Escalated' && !complaints.find(old => old.id === c.id)?.escalated) {
          newNotifs.unshift(generateComplaintNotification(c, 'escalated'));
        }
      });
      setNotifications(newNotifs);
    }
  }, []);

  const setRole = (newRole: UserRole) => setRoleState(newRole);

  const getNextComplaintId = () => {
    let max = 0;
    for (const c of complaints) {
      const match = c.id.match(/CC-2026-(\d+)/);
      if (match) {
        max = Math.max(max, parseInt(match[1], 10));
      }
    }
    const next = max + 1;
    return `CC-2026-${next.toString().padStart(3, '0')}`;
  };

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev]);
    addNotification(generateComplaintNotification(complaint, 'submitted'));
    if (complaint.isEmergency) {
      addNotification(generateComplaintNotification(complaint, 'emergency'));
    }
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    
    if (updates.status) {
      const updatedComplaint = complaints.find(c => c.id === id);
      if (updatedComplaint) {
        const eventMap: Record<string, any> = {
          'Under Review': 'reviewing',
          'In Progress': 'in_progress',
          'Resolved': 'resolved',
          'Escalated': 'escalated'
        };
        const event = eventMap[updates.status];
        if (event) {
          addNotification(generateComplaintNotification({ ...updatedComplaint, ...updates }, event));
        }
      }
    }
  };

  const addNotification = (notification: AppNotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetData = () => {
    clearStorage();
    setComplaints(getInitialComplaints());
    setNotifications(getInitialNotifications());
    setRole('student');
  };

  return (
    <AppContext.Provider value={{
      complaints, notifications, role, setRole, addComplaint, updateComplaint,
      addNotification, markNotificationRead, markAllNotificationsRead, resetData, getNextComplaintId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
