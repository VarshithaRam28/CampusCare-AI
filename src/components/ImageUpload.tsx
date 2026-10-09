import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  preview?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelect(file, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden glass-card border border-white/20 group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onImageSelect(null as any, '')}
              className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 flex items-center gap-2 backdrop-blur-md"
            >
              <X size={18} /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full h-32 px-4 py-6 
            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-blue-400 bg-blue-500/10 glow-blue' 
              : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Upload size={28} className={`mb-3 ${isDragging ? 'text-blue-400 animate-bounce' : 'text-gray-400'}`} />
            <p className="mb-1 text-sm text-gray-300">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
          </div>
          <input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={onFileChange} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
