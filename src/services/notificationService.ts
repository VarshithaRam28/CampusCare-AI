import type { AppNotification, Complaint } from '../types';

export function createNotification(complaintId: string, message: string, type: AppNotification['type']): AppNotification {
  return {
    id: `notif-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()}`,
    complaintId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
}

export function generateComplaintNotification(complaint: Complaint, event: 'submitted' | 'reviewing' | 'in_progress' | 'resolved' | 'escalated' | 'emergency'): AppNotification {
  let message = '';
  let type: AppNotification['type'] = 'info';

  switch (event) {
    case 'submitted':
      message = `Your complaint ${complaint.id} has been submitted successfully.`;
      type = 'info';
      break;
    case 'reviewing':
      message = `Your complaint ${complaint.id} is now being reviewed.`;
      type = 'info';
      break;
    case 'in_progress':
      message = `Your complaint ${complaint.id} is now in progress.`;
      type = 'info';
      break;
    case 'resolved':
      message = `Your complaint ${complaint.id} has been resolved.`;
      type = 'success';
      break;
    case 'escalated':
      message = `Complaint ${complaint.id} has been escalated because it exceeded its resolution deadline.`;
      type = 'warning';
      break;
    case 'emergency':
      message = `🚨 Critical emergency issue detected in your report ${complaint.id}!`;
      type = 'critical';
      break;
  }

  return createNotification(complaint.id, message, type);
}
