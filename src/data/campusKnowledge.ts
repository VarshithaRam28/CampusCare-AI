import type { Complaint } from '../types';

export interface KnowledgeItem {
  keywords: string[];
  topic: string;
  department: string;
  response: string;
}

export const CAMPUS_KNOWLEDGE: KnowledgeItem[] = [
  {
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'connection', 'broadband', 'ethernet', 'eduroam', 'router', 'slow internet'],
    topic: 'Wi-Fi/Internet problems',
    department: 'IT Support',
    response: 'For Wi-Fi or internet issues, please contact IT Support located in the IT Building Room 101, or email them at ithelp@campus.edu. You can also report connectivity problems via the "Report Issue" section.'
  },
  {
    keywords: ['water', 'plumbing', 'leak', 'pipe', 'tap', 'drain', 'flush', 'cooler', 'sink', 'fountain', 'sewage', 'water supply', 'no water', 'burst pipe'],
    topic: 'Water/Plumbing',
    department: 'Maintenance Department',
    response: 'Plumbing and water-related issues (such as leaking pipes, broken taps, sewage, or water cooler problems) are handled by the Maintenance Department in the Admin Block Room 005.'
  },
  {
    keywords: ['electrical', 'light', 'power', 'socket', 'electricity', 'spark', 'fan', 'ac', 'air conditioner', 'switchboard', 'blackout', 'bulb', 'fuse'],
    topic: 'Electrical issues',
    department: 'Electrical Maintenance',
    response: 'For electrical problems, including room lighting, power sockets, ceiling fans, or air conditioning, contact Electrical Maintenance in the Admin Block Room 006.'
  },
  {
    keywords: ['projector', 'whiteboard', 'desk', 'chair', 'classroom', 'av', 'audio', 'microphone', 'mic', 'podium', 'smartboard', 'speaker'],
    topic: 'Projector/Classroom equipment',
    department: 'Academic / AV Support',
    response: 'Issues with classroom equipment like projectors, microphones, sound systems, or whiteboards should be reported to Academic / AV Support in the Admin Block Room 201.'
  },
  {
    keywords: ['clean', 'dirty', 'garbage', 'dustbin', 'sweep', 'housekeeping', 'trash', 'waste', 'mop', 'spill', 'hygiene', 'restroom', 'washroom', 'bathroom', 'toilet clean', 'unclean', 'smell', 'stench'],
    topic: 'Cleaning/Cleanliness',
    department: 'Housekeeping',
    response: 'Cleanliness and housekeeping requests (such as overflowing dustbins, dirty restrooms, or campus spills) are managed by the Housekeeping team in the Facilities Wing.'
  },
  {
    keywords: ['security', 'theft', 'unauthorized', 'suspicious', 'guard', 'stolen', 'safety', 'gate', 'intruder', 'harassment'],
    topic: 'Security',
    department: 'Campus Security',
    response: 'For security concerns, safety issues, or unauthorized campus entry, approach Campus Security at the Main Gate Security Office. In case of emergency, call extension 1234.'
  },
  {
    keywords: ['hostel', 'dorm', 'dormitory', 'warden', 'room lock', 'bed', 'mess', 'hostel room', 'roommate'],
    topic: 'Hostel',
    department: 'Hostel Administration',
    response: 'Hostel-related complaints and room maintenance should be directed to the Hostel Administration located in the Hostel Office Block.'
  },
  {
    keywords: ['library', 'book', 'study room', 'reading room', 'librarian', 'borrowing'],
    topic: 'Library',
    department: 'Library Administration',
    response: 'Library facilities, quiet study spaces, and book resources are managed by the Library Administration on the Library Ground Floor.'
  },
  {
    keywords: ['cafeteria', 'food', 'canteen', 'vending', 'dining', 'mess food', 'meal', 'snack'],
    topic: 'Cafeteria/Food',
    department: 'Cafeteria Management',
    response: 'Queries and complaints regarding food hygiene, cafeteria services, and vending machines should be taken to Cafeteria Management in the Cafeteria Building.'
  },
  {
    keywords: ['transport', 'bus', 'shuttle', 'parking', 'vehicle', 'commute'],
    topic: 'Transport',
    department: 'Transport Department',
    response: 'Transport schedules, campus shuttle buses, and vehicle parking allocations are handled by the Transport Department in the Admin Block Room 012.'
  },
  {
    keywords: ['accessibility', 'ramp', 'wheelchair', 'disability', 'lift', 'elevator', 'accessible'],
    topic: 'Accessibility',
    department: 'Accessibility Support',
    response: 'Accessibility concerns, damaged wheelchair ramps, and elevator repairs are addressed by Accessibility Support in the Admin Block Room 010.'
  },
  {
    keywords: ['how to', 'report', 'complaint process', 'issue', 'file a complaint', 'submit complaint', 'how does this work'],
    topic: 'General complaints process',
    department: 'General',
    response: 'To report an issue, use the "Report Issue" section in this application. Describe your problem in natural language, optionally add a photo, and our AI will automatically detect the category, priority, and route it to the appropriate department.'
  },
  {
    keywords: ['emergency', 'fire', 'danger', 'accident', 'help', 'evacuate', 'ambulance'],
    topic: 'Emergency procedures',
    department: 'Campus Security',
    response: 'In an emergency, immediately call Campus Security at extension 1234. If there is a fire or immediate danger, evacuate the area following the marked exit routes.'
  }
];

export function findKnowledgeResponse(question: string, complaints?: Complaint[]): string {
  const lower = question.toLowerCase().trim();

  // 1. Complaint ID Lookup (e.g., CC-2026-001)
  const idMatch = question.match(/\b(CC-2026-\d{1,4})\b/i);
  if (idMatch) {
    const matchedId = idMatch[1].toUpperCase();
    if (complaints && complaints.length > 0) {
      const found = complaints.find(c => c.id.toUpperCase() === matchedId);
      if (found) {
        let deadlineStr = 'Not specified';
        try {
          deadlineStr = new Date(found.deadline).toLocaleString();
        } catch {
          deadlineStr = found.deadline;
        }

        let extraNote = '';
        if (found.status === 'Resolved') {
          extraNote = `\n• **Resolution Details**: Marked as Resolved.${found.resolutionNote ? ` Note: "${found.resolutionNote}"` : ''} If the problem still persists, you can submit a follow-up complaint referencing this ID.`;
        } else if (found.escalated || found.status === 'Escalated') {
          extraNote = `\n• **Escalation**: ⚠️ This issue has been escalated to campus administration for urgent action because it exceeded its resolution deadline.`;
        }

        return `Here is the current status of complaint **${found.id}**:
• **Title**: ${found.title}
• **Category**: ${found.category}
• **Department**: ${found.department}
• **Current Status**: **${found.status}**
• **Priority**: ${found.priority}
• **Target Deadline**: ${deadlineStr}${extraNote}

You can view complete history and tracking details in the **My Complaints** section.`;
      } else {
        return `I checked your records, but could not find a complaint with ID **${matchedId}**. Please verify the ID under the **My Complaints** section.`;
      }
    }
  }

  // 2. Complaint marked resolved but problem still exists / Reopen / Resubmit
  const isResolvedStillPresent = 
    /(marked\s+resolved|marked\s+as\s+resolved|resolved|closed|fixed)/i.test(lower) &&
    /(still\s+(exists|broken|there|present|happening|unresolved|not\s+working|problem|issue|leaking)|not\s+fixed|not\s+solved|persists?|problem\s+remains)/i.test(lower);
  
  const isReopenInquiry = /(reopen|re-open|resubmit|reopen\s+a\s+complaint|reopening)/i.test(lower);

  if (isResolvedStillPresent || isReopenInquiry) {
    return 'If your complaint was marked resolved but the problem still exists, check the complaint details and contact the responsible department. If the application supports reopening complaints, use that option. In CampusCare AI, direct in-app reopening is currently not supported; instead, please submit a follow-up complaint via **Report Issue** referencing your original complaint ID (e.g., CC-2026-XXX) and explain that the issue remains unresolved. You can also view any recorded resolution notes under **My Complaints**.';
  }

  // 3. Escalation / SLA / Overdue / Taking too long / Delay
  const isEscalationOrDelay = 
    /(why\s+is\s+it\s+escalated|how\s+does\s+escalation\s+work|what\s+does\s+escalated\s+mean|how\s+to\s+escalate|escalat(e|ed|ion)|taking\s+too\s+long|delayed|overdue|deadline\s+passed|exceeded\s+deadline|no\s+(update|response|action)|when\s+will.*(be\s+)?(fixed|resolved))/i.test(lower);

  if (isEscalationOrDelay) {
    return 'CampusCare AI features automatic escalation based on priority resolution deadlines:\n• **CRITICAL**: 24-hour resolution deadline\n• **HIGH**: 24-hour resolution deadline\n• **MEDIUM**: 48-hour resolution deadline\n• **LOW**: 72-hour resolution deadline\n\nIf a complaint is not resolved within its deadline, the system automatically flags it as **Escalated** for priority administrator intervention. You do not need to manually request escalation; the system monitors deadlines automatically. You can check the target deadline for your complaints in the **My Complaints** section.';
  }

  // 4. Recurring / Repeated problems
  const isRecurring = /(recur|recurring|keeps?\s+(breaking|happening|failing|stopping)|again\s+and\s+again|same\s+(issue|problem)\s+again|repeated\s+issue|happened\s+again)/i.test(lower);
  if (isRecurring) {
    return 'For recurring issues, please submit a new report through **Report Issue** and explicitly state in your description that this problem has occurred repeatedly, referencing any previous complaint IDs if available. This helps the assigned department conduct an in-depth root-cause investigation rather than just a quick temporary fix.';
  }

  // 5. Lost ID Cards / Campus ID / Access badges
  const isLostId = /(lost|misplaced|found|replace).*(id\s*card|student\s*id|access\s*card|campus\s*card|smart\s*card|badge)|(id\s*card|student\s*id).*(lost|misplaced|missing)/i.test(lower);
  if (isLostId) {
    return 'Lost ID cards and campus access cards are handled by **Campus Security** at the **Main Gate Security Office**. If you have lost your student ID card, report it to Security immediately to prevent unauthorized use, and visit the Administration Office in the Admin Block to apply for a replacement card.';
  }

  // 6. Immediate Electrical / Fire Hazards
  const isHazard = /(spark|sparking|smoke|fire|electric\s*shock|exposed\s*wire|burning\s*smell|short\s*circuit|gas\s*leak)/i.test(lower);
  if (isHazard) {
    return '⚠️ **Immediate Safety Warning**: If you observe sparks, smoke, exposed live wires, or active hazards:\n1. Move away to a safe distance immediately.\n2. Call **Campus Security** immediately at extension **1234**.\n3. Inform **Electrical Maintenance** (Admin Block Room 006).\n4. When reporting through **Report Issue**, describe the hazard; CampusCare AI will flag it as **CRITICAL** for emergency response.';
  }

  // 7. Complaint Tracking / Viewing status
  const isTracking = /(where|how).*(see|view|track|check|find).*(my\s+)?(complaint|report|ticket|status)|(check|track)\s+(my\s+)?(complaint|status)/i.test(lower);
  if (isTracking) {
    return 'You can track the progress of all your submitted issues in the **My Complaints** section (via the sidebar). Each complaint shows its current status (Submitted, Under Review, In Progress, Resolved, or Escalated), assigned department, priority level, and target resolution deadline.';
  }

  // 8. General Complaint Reporting Process
  const isReportProcess = /(how\s+(to|do\s+i)|where\s+do\s+i|steps?\s+to).*(report|file|submit|lodge|create).*(issue|problem|complaint)|what('s|\s+is)\s+the\s+complaint\s+process/i.test(lower);
  if (isReportProcess) {
    return 'To report a campus problem with CampusCare AI:\n1. Click **Report Issue** in the navigation sidebar.\n2. Describe your problem in natural language (e.g., *"The projector in Room 302 is flickering and has no audio"*).\n3. Optionally upload a photo of the problem.\n4. Click **Analyze with AI**—the system automatically identifies the category, priority level, responsible department, and drafts a formal complaint.\n5. Review the drafted text and click **Submit Complaint** to receive your tracking ID (e.g., CC-2026-001).';
  }

  // 9. Department & Topic Matches from Knowledge Base (Scored Word-Boundary Matching)
  let bestItem: KnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of CAMPUS_KNOWLEDGE) {
    let score = 0;
    for (const k of item.keywords) {
      const isMultiWord = k.includes(' ') || k.includes('-');
      const regex = isMultiWord 
        ? new RegExp(k.replace('-', '[-\\s]'), 'i') 
        : new RegExp(`\\b${k}\\b`, 'i');
      if (regex.test(lower)) {
        score += k.length >= 6 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore > 0) {
    return bestItem.response;
  }

  // 10. Fallback for unsupported or ambiguous questions
  return "I don't have enough campus information to answer that specific question. For campus facility, maintenance, or administrative issues, you can file a report through the **Report Issue** section or contact the General Administration Office.";
}
