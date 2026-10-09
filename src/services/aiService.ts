import type { AIAnalysisResult, ImageAnalysisResult, Category, Priority, Complaint } from '../types';
import { DEPARTMENT_MAP } from '../types';
import { findKnowledgeResponse } from '../data/campusKnowledge';

export function isUsingRealAI(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}

export async function analyzeComplaint(text: string): Promise<AIAnalysisResult> {
  if (isUsingRealAI()) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: "Analyze the complaint and output a JSON object matching the AIAnalysisResult structure: { title: string, category: string, priority: string, priorityReason: string, department: string, location: string, safetyRisk: string, suggestedAction: string, isEmergency: boolean, formalComplaint: string }" }] },
          contents: [{ parts: [{ text }] }]
        })
      });
      const data = await response.json();
      let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResult) {
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textResult) as AIAnalysisResult;
      }
    } catch (error) {
      console.error('Gemini API failed, falling back to mock:', error);
    }
  }
  return mockAnalyzeComplaint(text);
}

export async function analyzeImage(imageDataUrl: string): Promise<ImageAnalysisResult> {
  if (isUsingRealAI()) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const base64Image = imageDataUrl.split(',')[1];
      const mimeType = imageDataUrl.split(';')[0].split(':')[1];
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this image and return a JSON object with: { detected: string, category: string, priority: string, safetyRisk: string, suggestedAction: string }" },
              { inlineData: { mimeType, data: base64Image } }
            ]
          }]
        })
      });
      const data = await response.json();
      let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResult) {
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textResult) as ImageAnalysisResult;
      }
    } catch (error) {
      console.error('Gemini API failed, falling back to mock:', error);
    }
  }
  return mockAnalyzeImage(imageDataUrl);
}

export async function regenerateComplaint(description: string, category: Category, priority: Priority): Promise<string> {
  if (isUsingRealAI()) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Rewrite this complaint professionally: "${description}". Category: ${category}, Priority: ${priority}. Provide just the rewritten text.` }] }]
        })
      });
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (error) {
      console.error('Gemini API failed, falling back to mock:', error);
    }
  }
  return mockRegenerateComplaint(description, category, priority);
}

export async function askAssistant(question: string, complaints?: Complaint[]): Promise<string> {
  // If complaint ID or workflow-specific intent (like resolved-still-broken, escalation policy, lost ID) is detected,
  // evaluate with grounded campus knowledge base first for precision
  const directResponse = findKnowledgeResponse(question, complaints);
  const isGenericFallback = directResponse.startsWith("I don't have enough campus information");

  if (!isGenericFallback) {
    return directResponse;
  }

  if (isUsingRealAI()) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { 
            parts: [{ 
              text: "You are the CampusCare AI Assistant. Answer student questions about campus services, maintenance, and complaints accurately and politely. If you don't know the specific campus detail, tell the user to file a report under 'Report Issue' or contact the General Administration Office. Do not invent departments or contact numbers." 
            }] 
          },
          contents: [{ parts: [{ text: question }] }]
        })
      });
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (error) {
      console.error('Gemini API failed, falling back to mock:', error);
    }
  }
  return mockAskAssistant(question, complaints);
}

// --- Mock Implementations ---

async function mockAnalyzeComplaint(text: string): Promise<AIAnalysisResult> {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700)); // 800-1500ms delay
  
  const lower = text.toLowerCase();
  
  let category: Category = 'Maintenance';
  if (/(water|leak|pipe|tap|drain|plumbing)/.test(lower)) category = 'Plumbing';
  else if (/(wifi|wi-fi|internet|network|server|router)/.test(lower)) category = 'IT & Network';
  else if (/(light|electrical|socket|wire|spark|power|electricity)/.test(lower)) category = 'Electrical';
  else if (/(projector|whiteboard|desk|chair|classroom|board)/.test(lower)) category = 'Classroom Equipment';
  else if (/(dirty|trash|dustbin|garbage|clean|sweep|mop)/.test(lower)) category = 'Cleanliness';
  else if (/(hostel|dorm|room lock|warden)/.test(lower)) category = 'Hostel';
  else if (/(theft|security|unauthorized|suspicious|intruder)/.test(lower)) category = 'Security';
  else if (/(bus|transport|shuttle|parking)/.test(lower)) category = 'Transport';
  else if (/(ramp|wheelchair|disability|accessible)/.test(lower)) category = 'Accessibility';
  else if (/(library|book|study room)/.test(lower)) category = 'Library';
  else if (/(cafeteria|food|canteen|vending)/.test(lower)) category = 'Cafeteria';
  else if (/(fan|ac|air conditioner)/.test(lower)) category = 'Maintenance';

  let priority: Priority = 'MEDIUM';
  if (/(fire|smoke|spark|gas leak|flood|emergency|danger|electrocution|collapse)/.test(lower)) priority = 'CRITICAL';
  else if (/(not working|broken|down|leak|slippery|unsafe|multiple|entire|all students)/.test(lower)) priority = 'HIGH';
  else if (/(minor|small|cosmetic|one chair|scratch|slow)/.test(lower)) priority = 'LOW';

  const isEmergency = priority === 'CRITICAL' && /(fire|danger|emergency|smoke)/.test(lower);

  let location = 'Campus Area';
  const locations = ['Main Block', 'CSE Block', 'ECE Block', 'Library', 'Hostel', 'Cafeteria', 'Sports Area', 'Parking'];
  for (const loc of locations) {
    if (lower.includes(loc.toLowerCase())) {
      location = loc;
      break;
    }
  }
  const roomMatch = lower.match(/room\s*(\d+)/);
  if (roomMatch) location += `, Room ${roomMatch[1]}`;

  const title = (text.split('.')[0] || text).substring(0, 50).replace(/\b\w/g, l => l.toUpperCase()) + ' Issue';
  const department = DEPARTMENT_MAP[category] || 'General Administration';

  return {
    title,
    category,
    priority,
    priorityReason: `Assigned based on keyword analysis indicating a ${priority.toLowerCase()} severity issue.`,
    department,
    location,
    safetyRisk: priority === 'CRITICAL' ? 'Severe safety hazard present.' : priority === 'HIGH' ? 'Moderate safety concern.' : 'Low or no immediate safety risk.',
    suggestedAction: `Please dispatch a team from ${department} for immediate assessment.`,
    isEmergency,
    formalComplaint: `I am formally reporting an issue classified under ${category}. The issue details are as follows: ${text}. Immediate attention from the ${department} is requested to ensure campus standards are met.`
  };
}

async function mockAnalyzeImage(imageDataUrl: string): Promise<ImageAnalysisResult> {
  await new Promise(r => setTimeout(r, 1000));
  return {
    detected: 'Potential campus infrastructure issue detected in uploaded image',
    category: 'Maintenance',
    priority: 'MEDIUM',
    safetyRisk: 'Visual inspection recommended to assess safety impact',
    suggestedAction: 'Dispatch maintenance team for on-site inspection and assessment'
  };
}

async function mockRegenerateComplaint(description: string, category: Category, priority: Priority): Promise<string> {
  await new Promise(r => setTimeout(r, 600));
  return `Formal Report (${category}): I am writing to report the following matter - ${description}. Considering its nature, I believe it warrants a ${priority} priority level response. Kindly expedite resolution.`;
}

async function mockAskAssistant(question: string, complaints?: Complaint[]): Promise<string> {
  await new Promise(r => setTimeout(r, 400));
  return findKnowledgeResponse(question, complaints);
}
