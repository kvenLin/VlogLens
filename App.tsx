import React, { useState, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import ProcessingStatus from './components/ProcessingStatus';
import DiaryCard from './components/DiaryCard';
import ApiKeySettings from './components/ApiKeySettings';
import { extractFramesFromVideo } from './utils/videoUtils';
import { analyzeVideoFrames, hasApiKey, resetAI } from './services/geminiService';
import { AppState, GeneratedContent, ProcessedFrame } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState<ProcessedFrame[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);

  // 检查 API Key 是否已配置
  useEffect(() => {
    setApiKeyConfigured(hasApiKey());
  }, []);

  const handleApiKeySave = (apiKey: string) => {
    resetAI(); // 重置 AI 实例以使用新的 key
    setApiKeyConfigured(!!apiKey);
  };

  const handleFileSelect = async (file: File) => {
    try {
      setAppState(AppState.PROCESSING_VIDEO);
      setErrorMsg(null);
      setProgress(0);

      // 1. Client-side Processing: Extract frames
      // Limit to 20 frames for performance and API limits
      const extractedFrames = await extractFramesFromVideo(file, 20, (pct) => {
        setProgress(pct);
      });
      
      setFrames(extractedFrames);

      // 2. AI Generation
      setAppState(AppState.GENERATING_AI);
      setProgress(10); // Start a fake progress for AI
      
      // Simulate progress for AI (indeterminate)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 5;
        });
      }, 500);

      const content = await analyzeVideoFrames(extractedFrames);
      
      clearInterval(interval);
      setProgress(100);
      setGeneratedContent(content);
      setAppState(AppState.COMPLETE);

    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err instanceof Error ? err.message : "发生意外错误，请重试。");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setFrames([]);
    setGeneratedContent(null);
    setProgress(0);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* Settings Button - Fixed Position */}
      <button
        onClick={() => setShowSettings(true)}
        className={`fixed top-4 right-4 p-3 rounded-xl shadow-lg transition-all hover:scale-105 z-40
          ${apiKeyConfigured 
            ? 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 animate-pulse'
          }`}
        title={apiKeyConfigured ? '修改 API 密钥' : '设置 API 密钥'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* API Key Settings Modal */}
      <ApiKeySettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleApiKeySave}
      />

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4 border border-indigo-50">
           <span className="text-2xl mr-2">📷</span>
           <span className="font-bold text-gray-800 tracking-tight">VlogLens</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          你的私人 <span className="text-indigo-600">AI 视频日记助手</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500">
          拖入随手拍的视频片段，Gemini 自动为你生成图文并茂的视觉日记和种草文案。
        </p>
      </div>

      <div className="w-full max-w-3xl">
        
        {/* Error Banner */}
        {appState === AppState.ERROR && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errorMsg}
                  <button onClick={handleReset} className="ml-2 font-bold underline">重试</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {appState === AppState.IDLE && (
             <VideoUploader onFileSelect={handleFileSelect} />
          )}

          {(appState === AppState.PROCESSING_VIDEO || appState === AppState.GENERATING_AI) && (
            <ProcessingStatus 
              status={appState === AppState.PROCESSING_VIDEO ? 'extracting' : 'analyzing'} 
              progress={progress} 
            />
          )}

          {appState === AppState.COMPLETE && generatedContent && (
            <DiaryCard 
              content={generatedContent} 
              frames={frames}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-400 text-xs md:text-sm">
        <p>Powered by Gemini 2.5 Flash • 视频纯前端处理，不上传后台</p>
      </footer>
    </div>
  );
}

export default App;
