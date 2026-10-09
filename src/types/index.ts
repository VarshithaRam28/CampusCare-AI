export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Status = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Escalated';

export type Category =
  | 'Maintenance'
  | 'Electrical'
  | 'Plumbing'
  | 'IT & Network'
  | 'Classroom Equipment'
  | 'Cleanliness'
  | 'Hostel'
  | 'Security'
  | 'Transport'
  | 'Accessibility'
  | 'Library'
  | 'Cafeteria'
  | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  priorityReason: string;
  department: string;
  location: string;
  building: string;
  room: string;
  safetyRisk: string;
  suggestedAction: string;
  formalComplaint: string;
  isEmergency: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  escalated: boolean;
  resolutionNote: string;
  feedback: string;
  rating: number | null;
  imageUrl?: string;
}

export interface AppNotification {
  id: string;
  complaintId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'critical';
  read: boolean;
  createdAt: string;
}

export interface AIAnalysisResult {
  title: string;
  category: Category;
  priority: Priority;
  priorityReason: string;
  department: string;
  location: string;
  safetyRisk: string;
  suggestedAction: string;
  isEmergency: boolean;
  formalComplaint: string;
}

export interface ImageAnalysisResult {
  detected: string;
  category: Category;
  priority: Priority;
  safetyRisk: string;
  suggestedAction: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type UserRole = 'student' | 'admin';

export const CATEGORIES: Category[] = [
  'Maintenance',
  'Electrical',
  'Plumbing',
  'IT & Network',
  'Classroom Equipment',
  'Cleanliness',
  'Hostel',
  'Security',
  'Transport',
  'Accessibility',
  'Library',
  'Cafeteria',
  'Other',
];

export const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const STATUSES: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Escalated'];

export const DEPARTMENT_MAP: Record<Category, string> = {
  Maintenance: 'Maintenance Department',
  Electrical: 'Electrical Maintenance',
  Plumbing: 'Maintenance Department',
  'IT & Network': 'IT Support',
  'Classroom Equipment': 'Academic / AV Support',
  Cleanliness: 'Housekeeping',
  Hostel: 'Hostel Administration',
  Security: 'Campus Security',
  Transport: 'Transport Department',
  Accessibility: 'Accessibility Support',
  Library: 'Library Administration',
  Cafeteria: 'Cafeteria Management',
  Other: 'General Administration',
};

export const CAMPUS_LOCATIONS = [
  'Main Block',
  'CSE Block',
  'ECE Block',
  'Library',
  'Hostel A',
  'Hostel B',
  'Cafeteria',
  'Sports Area',
  'Parking',
  'Admin Block',
  'Auditorium',
  'Lab Complex',
] as const;

export const PRIORITY_DEADLINES: Record<Priority, number> = {
  CRITICAL: 24,
  HIGH: 24,
  MEDIUM: 48,
  LOW: 72,
};
