import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { analyzeComplaint, analyzeImage, regenerateComplaint, isUsingRealAI } from '../services/aiService';
import ImageUpload from '../components/ImageUpload';
import AIAnalysisLoader from '../components/AIAnalysisLoader';
import EmergencyAlert from '../components/EmergencyAlert';
import PriorityBadge from '../components/PriorityBadge';
import type { AIAnalysisResult, ImageAnalysisResult, Priority, Category } from '../types';
import { DEPARTMENT_MAP } from '../types';

const ReportIssue: React.FC = () => {
  const { addComplaint, getNextComplaintId } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  
  const [editingComplaint, setEditingComplaint] = useState(false);
  const [editedFormalComplaint, setEditedFormalComplaint] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  const handleImageSelect = (file: File | null, dataUrl: string) => {
    setImageFile(file);
    setImagePreview(dataUrl ? dataUrl : undefined);
  };

  const handleAnalyze = async () => {
    if (!description.trim() && !imagePreview) return;
    setAnalyzing(true);
    try {
      let result = await analyzeComplaint(description || 'Issue reported via image attachment.');
      
      if (imagePreview) {
        const imgResult = await analyzeImage(imagePreview);
        setImageAnalysisResult(imgResult);
        
        // If no description, use image result directly for category/priority
        if (!description.trim()) {
          result = {
            ...result,
            title: 'Image Upload Issue',
            category: imgResult.category,
            priority: imgResult.priority,
            safetyRisk: imgResult.safetyRisk,
            suggestedAction: imgResult.suggestedAction,
            // We can resolve department later or here, but let's just keep result.department
            // since analyzeComplaint with mock will still return a department based on category.
          };
          // Re-evaluate department if category changed
          if (DEPARTMENT_MAP[imgResult.category]) {
            result.department = DEPARTMENT_MAP[imgResult.category];
          }
        }
      }

      setAnalysisResult(result);
      setEditedFormalComplaint(result.formalComplaint);
      
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRegenerate = async () => {
    if (!analysisResult) return;
    setAnalyzing(true);
    try {
      const newText = await regenerateComplaint(description, analysisResult.category, analysisResult.priority);
      setEditedFormalComplaint(newText);
      setAnalysisResult({ ...analysisResult, formalComplaint: newText });
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!analysisResult) return;
    const newId = getNextComplaintId();
    
    // Add logic for deadline based on priority here if needed.
    
    addComplaint({
      id: newId,
      title: analysisResult.title,
      description,
      category: analysisResult.category,
      priority: analysisResult.priority,
      priorityReason: analysisResult.priorityReason,
      department: analysisResult.department,
      location: analysisResult.location || '',
      building: '',
      room: '',
      safetyRisk: analysisResult.safetyRisk,
      suggestedAction: analysisResult.suggestedAction,
      formalComplaint: editedFormalComplaint,
      isEmergency: analysisResult.isEmergency,
      imageUrl: imagePreview,
      status: 'Submitted',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      escalated: false,
      resolutionNote: '',
      feedback: '',
      rating: null,
    });
    
    setSubmittedId(newId);
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Report New Issue</h1>
        <p className="text-gray-400">Step {step} of {step === 4 ? 4 : 3}</p>
      </div>

      {step === 1 && (
        <div className="glass-card space-y-6 animate-fade-in">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Describe your campus problem in detail...</label>
            <textarea
              className="input-field min-h-[150px]"
              placeholder="e.g. The projector in room 302 of the science building is making a loud noise and smells like burning..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Add a photo (optional)</label>
            <ImageUpload onImageSelect={handleImageSelect} preview={imagePreview} />
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex flex-col items-center">
            <button
              onClick={handleAnalyze}
              disabled={(!description.trim() && !imagePreview) || analyzing}
              className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
            >
              🤖 Analyze with AI
            </button>
            <p className="text-gray-400 text-sm mt-3">AI will automatically detect category, priority, and department</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/20">
              {isUsingRealAI() ? 'Powered by Gemini AI' : 'Demo Mode (Mock AI)'}
            </div>
          </div>
        </div>
      )}

      {analyzing && step === 1 && <AIAnalysisLoader message="Analyzing your issue..." />}
      {analyzing && step === 2 && <AIAnalysisLoader message="Regenerating complaint..." />}

      {step === 2 && analysisResult && !analyzing && (
        <div className="space-y-6 animate-fade-in">
          {analysisResult.isEmergency && <EmergencyAlert message="Emergency detected! Please ensure you are safe." />}
          
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">AI Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Generated Title</span>
                <p className="text-white font-medium">{analysisResult.title}</p>
              </div>
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Category</span>
                <p className="text-white bg-slate-800 px-3 py-1 rounded-md inline-block">{analysisResult.category}</p>
              </div>
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Priority</span>
                <div><PriorityBadge priority={analysisResult.priority} /></div>
              </div>
              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Department</span>
                <p className="text-white">{analysisResult.department}</p>
              </div>
              {analysisResult.location && (
                <div className="space-y-2 md:col-span-2">
                  <span className="text-gray-400 text-sm">Location</span>
                  <p className="text-white">{analysisResult.location}</p>
                </div>
              )}
              {analysisResult.safetyRisk && (
                <div className="space-y-2 md:col-span-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <span className="text-red-400 text-sm font-medium">Safety Risk Detected</span>
                  <p className="text-red-200">{analysisResult.safetyRisk}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue to Review</button>
          </div>
        </div>
      )}

      {step === 3 && analysisResult && (
        <div className="glass-card space-y-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-white">Review Formal Complaint</h3>
          <p className="text-gray-400 text-sm">AI has drafted a formal complaint. You can edit it before submitting.</p>
          
          <textarea
            className="input-field min-h-[200px]"
            value={editedFormalComplaint}
            onChange={(e) => setEditedFormalComplaint(e.target.value)}
          />

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button onClick={handleRegenerate} className="btn-secondary bg-slate-700 hover:bg-slate-600">🔄 Regenerate</button>
            <button onClick={handleSubmit} className="btn-primary ml-auto">✅ Submit Complaint</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass-card text-center py-12 space-y-6 animate-fade-in glow-blue">
          <div className="text-green-400 mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Complaint Submitted Successfully</h2>
            <p className="text-gray-400">Your issue has been logged and routed to the appropriate department.</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg inline-block">
            <span className="text-sm text-gray-400">Complaint ID:</span>
            <p className="text-xl font-mono text-blue-400 font-bold">{submittedId}</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={() => navigate(`/complaint/${submittedId}`)} className="btn-secondary">View Complaint</button>
            <button onClick={() => {
              setStep(1);
              setDescription('');
              setImageFile(null);
              setImagePreview(undefined);
            }} className="btn-primary">Report Another Issue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
