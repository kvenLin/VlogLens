import React, { useState } from 'react';
import { GeneratedContent, ProcessedFrame } from '../types';

interface DiaryCardProps {
  content: GeneratedContent;
  frames: ProcessedFrame[];
  onReset: () => void;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ content, frames, onReset }) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'social'>('diary');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content.social_caption);
    alert('文案已复制到剪贴板！');
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[800px]">
      
      {/* Header Area */}
      <div className="p-6 md:p-8 border-b border-gray-100 bg-white z-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
              {content.mood}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {content.title}
            </h2>
          </div>
          <button 
            onClick={onReset}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-50 rounded-full"
            title="重新开始"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mt-6">
          <button
            className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'diary' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('diary')}
          >
            📖 视觉日记
          </button>
          <button
            className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'social' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('social')}
          >
            ✨ 种草文案
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto p-6 md:p-8 bg-gray-50 custom-scrollbar flex-grow">
        
        {activeTab === 'diary' && (
          <div className="space-y-12 animate-fade-in max-w-2xl mx-auto">
            {content.diary_blocks.map((block, idx) => {
              // Ensure we don't crash if AI hallucinates an index
              const frame = frames[block.frame_index] || frames[0];
              
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   {/* Text Header */}
                   <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-lg mr-3">
                        {block.emoji}
                      </div>
                      <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                        {block.time_label}
                      </span>
                   </div>
                   
                   {/* The Content Text */}
                   <p className="text-gray-800 leading-relaxed mb-4 text-sm md:text-base font-medium">
                     {block.text}
                   </p>

                   {/* The Interleaved Image */}
                   <div className="rounded-xl overflow-hidden shadow-inner border border-gray-100 aspect-video bg-gray-100 relative group">
                     {frame ? (
                        <img 
                          src={frame.dataUrl} 
                          alt="Moment snapshot" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                     ) : (
                       <div className="flex items-center justify-center h-full text-gray-300 text-xs">No image available</div>
                     )}
                   </div>
                </div>
              );
            })}
            
            {/* End marker */}
            <div className="text-center text-gray-300 text-xs tracking-widest uppercase">
              • The End •
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="animate-fade-in max-w-xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative group">
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-gray-50 hover:bg-indigo-50 p-2 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                title="复制文案"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              
              <div className="prose prose-sm prose-indigo max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-7">
                  {content.social_caption}
                </pre>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {content.hashtags.map((tag, i) => (
                  <span key={i} className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 cursor-pointer transition-colors">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-4">
              点击右上角复制，直接粘贴到小红书或朋友圈
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;
