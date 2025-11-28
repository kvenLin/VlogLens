import React, { useRef, useState } from 'react';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onFileSelect(file);
      } else {
        alert("请拖入有效的视频文件。");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`
        w-full h-64 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        accept="video/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileInput}
      />
      
      <div className="bg-indigo-100 p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      
      <p className="text-xl font-semibold text-gray-700">将视频拖放到这里</p>
      <p className="text-sm text-gray-500 mt-2">或者点击选择文件</p>
      <p className="text-xs text-gray-400 mt-4">支持 MP4, MOV, WebM 格式</p>
    </div>
  );
};

export default VideoUploader;
