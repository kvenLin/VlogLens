import React from 'react';

interface ProcessingStatusProps {
  status: 'extracting' | 'analyzing';
  progress: number; // 0-100
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, progress }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        {/* Spinner ring */}
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {status === 'extracting' ? '正在提取画面...' : 'AI 正在观看视频...'}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        {status === 'extracting' 
          ? '正在压缩视觉数据以便分析' 
          : 'Gemini 正在为您生成视觉日记'}
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-md overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
