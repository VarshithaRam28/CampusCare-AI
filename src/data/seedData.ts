import type { Complaint, AppNotification } from '../types';
import { PRIORITY_DEADLINES } from '../types';

export function getInitialComplaints(): Complaint[] {
  const now = new Date('2026-10-08T12:00:00Z').getTime();
  const day = 24 * 60 * 60 * 1000;

  const createDate = (daysAgo: number) => new Date(now - daysAgo * day).toISOString();

  const baseComplaints: Partial<Complaint>[] = [
    {
      id: 'CC-2026-001',
      title: 'Water Leakage Near Library Fountain',
      description: 'There is a continuous water leak near the main fountain outside the library, making the pathway slippery.',
      category: 'Plumbing',
      priority: 'HIGH',
      priorityReason: 'Slippery surface poses a safety hazard for students walking by.',
      department: 'Maintenance',
      location: 'Library',
      building: 'Library',
      safetyRisk: 'High risk of slipping and falling',
      suggestedAction: 'Immediately shut off water supply to the fountain and fix the broken pipe.',
      formalComplaint: 'I am reporting a significant water leak near the library fountain. The water is pooling on the pedestrian pathway, creating a severe slipping hazard. Prompt maintenance is required to prevent accidents.',
      isEmergency: false,
      status: 'In Progress',
      createdAt: createDate(5),
    },
    {
      id: 'CC-2026-002',
      title: 'Wi-Fi Down in CSE Block',
      description: 'The Wi-Fi network in the entire CSE block has been down since morning.',
      category: 'IT & Network',
      priority: 'HIGH',
      priorityReason: 'Affects all students and faculty in the building.',
      department: 'IT Support',
      location: 'CSE Block',
      building: 'CSE Block',
      safetyRisk: 'None',
      suggestedAction: 'Restart main router or check ISP connection.',
      formalComplaint: 'The wireless internet connection in the Computer Science and Engineering block is currently completely unresponsive. This outage is significantly disrupting academic activities and requires immediate technical intervention.',
      isEmergency: false,
      status: 'Under Review',
      createdAt: createDate(4),
    },
    {
      id: 'CC-2026-003',
      title: 'Flickering Lights in ECE Block Corridor',
      description: 'The tube lights on the second floor corridor of the ECE block are flickering constantly.',
      category: 'Electrical',
      priority: 'MEDIUM',
      priorityReason: 'Annoying but not immediately dangerous.',
      department: 'Electrical Maintenance',
      location: 'ECE Block',
      building: 'ECE Block',
      safetyRisk: 'Low risk, possible short circuit if ignored',
      suggestedAction: 'Replace faulty fluorescent tubes or starters.',
      formalComplaint: 'Several light fixtures in the second-floor corridor of the ECE Block are flickering continuously. This issue creates an uncomfortable environment and should be addressed to ensure proper illumination and electrical safety.',
      isEmergency: false,
      status: 'In Progress',
      createdAt: createDate(2),
    },
    {
      id: 'CC-2026-004',
      title: 'Broken Projector in Room 302',
      description: 'The projector in room 302 is not turning on. The power cable seems loose.',
      category: 'Classroom Equipment',
      priority: 'MEDIUM',
      priorityReason: 'Disrupts classes in that specific room.',
      department: 'Academic Support',
      location: 'Main Block',
      building: 'Main Block',
      room: '302',
      safetyRisk: 'None',
      suggestedAction: 'Check power cable and replace if necessary.',
      formalComplaint: 'The multimedia projector installed in Room 302 is currently non-functional. It appears to be a power supply issue. Please dispatch a technician to restore functionality before the next scheduled lecture.',
      isEmergency: false,
      status: 'Submitted',
      createdAt: createDate(1),
    },
    {
      id: 'CC-2026-005',
      title: 'Overflowing Dustbin Near Cafeteria Entrance',
      description: 'The main garbage bin near the cafeteria entrance is overflowing and smells bad.',
      category: 'Cleanliness',
      priority: 'LOW',
      priorityReason: 'Cosmetic and hygiene issue, localized.',
      department: 'Housekeeping',
      location: 'Cafeteria',
      building: 'Cafeteria',
      safetyRisk: 'Hygiene concern',
      suggestedAction: 'Empty the dustbin and clean the surrounding area.',
      formalComplaint: 'The waste receptacle located near the primary entrance of the cafeteria is overflowing, resulting in unsanitary conditions and unpleasant odors. Routine waste collection needs to be performed promptly.',
      isEmergency: false,
      status: 'Resolved',
      createdAt: createDate(3),
      updatedAt: createDate(1),
      resolutionNote: 'Dustbin emptied and area sanitized.',
      rating: 4,
    },
    {
      id: 'CC-2026-006',
      title: 'Broken Door Lock in Hostel B Room 105',
      description: 'The main door lock of room 105 is jammed and won\'t lock properly.',
      category: 'Hostel',
      priority: 'HIGH',
      priorityReason: 'Compromises student security and privacy.',
      department: 'Hostel Administration',
      location: 'Hostel B',
      building: 'Hostel B',
      room: '105',
      safetyRisk: 'Theft risk',
      suggestedAction: 'Replace the door lock mechanism immediately.',
      formalComplaint: 'The primary locking mechanism on the door of Room 105 in Hostel B is defective, preventing the door from being secured. This poses a significant security risk to the occupants and their belongings.',
      isEmergency: false,
      status: 'In Progress',
      createdAt: createDate(3),
    },
    {
      id: 'CC-2026-007',
      title: 'Unauthorized Entry Attempt at Parking Area',
      description: 'Someone tried to force open the gate at the back parking lot.',
      category: 'Security',
      priority: 'CRITICAL',
      priorityReason: 'Direct security threat to the campus.',
      department: 'Campus Security',
      location: 'Parking',
      building: 'Parking',
      safetyRisk: 'High risk of theft or unauthorized access',
      suggestedAction: 'Review CCTV footage and increase patrols.',
      formalComplaint: 'An incident involving an attempted forced entry was observed at the rear parking lot gate. This represents a severe security breach attempt. Immediate review of surveillance footage and heightened security patrols are strongly advised.',
      isEmergency: true,
      status: 'Under Review',
      createdAt: createDate(2),
    },
    {
      id: 'CC-2026-008',
      title: 'Broken Bench in Sports Area',
      description: 'One of the wooden benches near the basketball court has a broken plank.',
      category: 'Maintenance',
      priority: 'LOW',
      priorityReason: 'Minor damage, alternative seating available.',
      department: 'Maintenance',
      location: 'Sports Area',
      building: 'Sports Area',
      safetyRisk: 'Minor risk of splinters',
      suggestedAction: 'Repair or replace the broken wooden plank.',
      formalComplaint: 'A seating bench situated adjacent to the basketball court has sustained structural damage, specifically a broken wooden plank. Repair work should be scheduled to prevent any minor injuries to users.',
      isEmergency: false,
      status: 'Submitted',
      createdAt: createDate(1),
    },
    {
      id: 'CC-2026-009',
      title: 'Wheelchair Ramp Damaged Near Main Block',
      description: 'The concrete on the wheelchair ramp at the main block entrance is cracked and uneven.',
      category: 'Accessibility',
      priority: 'MEDIUM',
      priorityReason: 'Hinders accessibility for disabled students.',
      department: 'Maintenance',
      location: 'Main Block',
      building: 'Main Block',
      safetyRisk: 'Risk of tripping or wheelchair getting stuck',
      suggestedAction: 'Patch the concrete and smooth the surface.',
      formalComplaint: 'The concrete surface of the accessibility ramp at the Main Block entrance has deteriorated, presenting uneven sections and cracks. This significantly impedes access for individuals utilizing mobility aids and requires prompt remediation.',
      isEmergency: false,
      status: 'Resolved',
      createdAt: createDate(5),
      updatedAt: createDate(2),
      resolutionNote: 'Ramp surface repaired and leveled.',
      rating: 5,
    },
    {
      id: 'CC-2026-010',
      title: 'Sparking Electrical Socket in ECE Block Lab 3',
      description: 'A wall socket in lab 3 sparked and smoked when a machine was plugged in.',
      category: 'Electrical',
      priority: 'CRITICAL',
      priorityReason: 'Immediate fire hazard.',
      department: 'Electrical Maintenance',
      location: 'ECE Block',
      building: 'ECE Block',
      room: 'Lab 3',
      safetyRisk: 'Severe risk of fire and electrocution',
      suggestedAction: 'Isolate power to the lab and replace the faulty socket.',
      formalComplaint: 'An electrical wall receptacle in Lab 3 of the ECE Block exhibited sparking and emitted smoke during use. This constitutes a critical fire and electrocution hazard. Immediate isolation of the circuit and replacement of the fixture is mandatory.',
      isEmergency: true,
      status: 'Resolved',
      createdAt: createDate(4),
      updatedAt: createDate(3),
      resolutionNote: 'Power isolated, socket replaced, and circuit tested.',
      rating: 3,
    },
    {
      id: 'CC-2026-011',
      title: 'Printer Not Working in Library',
      description: 'The student printer on the ground floor of the library is displaying an error code.',
      category: 'IT & Network',
      priority: 'LOW',
      priorityReason: 'Inconvenient but not critical.',
      department: 'IT Support',
      location: 'Library',
      building: 'Library',
      safetyRisk: 'None',
      suggestedAction: 'Check error code and service printer.',
      formalComplaint: 'The designated student printing station located on the ground floor of the library is currently out of service, displaying a system error code. Technical support is requested to restore printing services.',
      isEmergency: false,
      status: 'In Progress',
      createdAt: createDate(2),
    },
    {
      id: 'CC-2026-012',
      title: 'Vending Machine Broken in Cafeteria',
      description: 'The snack vending machine ate my money and didn\'t dispense anything.',
      category: 'Cafeteria',
      priority: 'LOW',
      priorityReason: 'Minor inconvenience.',
      department: 'Cafeteria Management',
      location: 'Cafeteria',
      building: 'Cafeteria',
      safetyRisk: 'None',
      suggestedAction: 'Inspect machine mechanism and refund student.',
      formalComplaint: 'The snack vending apparatus situated in the cafeteria is malfunctioning. It is accepting currency without dispensing the selected items. Maintenance and a review of the dispensing mechanism are required.',
      isEmergency: false,
      status: 'Under Review',
      createdAt: createDate(1),
    }
  ];

  return baseComplaints.map(c => {
    const createdAtTime = new Date(c.createdAt!).getTime();
    const deadlineHours = PRIORITY_DEADLINES[c.priority as keyof typeof PRIORITY_DEADLINES];
    const deadlineTime = createdAtTime + deadlineHours * 60 * 60 * 1000;
    
    let escalated = false;
    let status = c.status;
    
    if (status !== 'Resolved' && now > deadlineTime) {
      escalated = true;
      status = 'Escalated';
    }

    return {
      ...c,
      updatedAt: c.updatedAt || c.createdAt,
      deadline: new Date(deadlineTime).toISOString(),
      escalated,
      status,
    } as Complaint;
  });
}

export function getInitialNotifications(): AppNotification[] {
  const complaints = getInitialComplaints();
  const notifications: AppNotification[] = [];
  
  const addNotif = (complaintId: string, message: string, type: AppNotification['type'], daysAgo: number) => {
    notifications.push({
      id: `notif-${Math.random().toString(36).substring(2)}`,
      complaintId,
      message,
      type,
      read: false,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  addNotif('CC-2026-001', 'Complaint CC-2026-001 has been escalated because it exceeded its resolution deadline.', 'warning', 0);
  addNotif('CC-2026-002', 'Complaint CC-2026-002 has been escalated because it exceeded its resolution deadline.', 'warning', 0);
  addNotif('CC-2026-005', 'Your complaint CC-2026-005 has been resolved.', 'success', 1);
  addNotif('CC-2026-007', '🚨 Critical emergency issue detected in your report CC-2026-007!', 'critical', 2);
  addNotif('CC-2026-009', 'Your complaint CC-2026-009 has been resolved.', 'success', 2);
  addNotif('CC-2026-010', 'Your complaint CC-2026-010 has been resolved.', 'success', 3);

  return notifications;
}
