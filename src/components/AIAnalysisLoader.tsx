import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

interface AIAnalysisLoaderProps {
  message?: string;
}

const AIAnalysisLoader: React.FC<AIAnalysisLoaderProps> = ({ message = 'Analyzing with AI...' }) => {
  return (
    <div className="w-full glass-card rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden my-4 border border-blue-500/30">
      {/* Background animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-ai-pulse"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5 animate-float shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center">
              <Brain size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
          <Sparkles size={20} className="absolute -top-1 -right-2 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
          <Sparkles size={14} className="absolute bottom-1 -left-2 text-pink-400 animate-spin" style={{ animationDuration: '2s' }} />
        </div>

        <h3 className="text-lg font-bold gradient-text tracking-wide mb-3">{message}</h3>
        
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisLoader;
