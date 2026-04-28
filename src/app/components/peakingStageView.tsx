"use client";
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { ViewType, SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from './types';

interface SpeakingStageViewProps {
  setView: (val: ViewType) => void;
  submittedPoint?: string;
  pointForAIPrompt?: string;
  studentName?: string;
  onSubmitDraft?: (point: string) => void;
  onFinishSpeaking?: (point: string) => void;
}

const SpeakingStageView: React.FC<SpeakingStageViewProps> = ({ setView, submittedPoint = '', pointForAIPrompt = '', studentName = 'Speaker', onSubmitDraft, onFinishSpeaking }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [viewpoint, setViewpoint] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSelectedPrompt('');
  }, []);

const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert('需要麦克风权限才能使用语音识别。请允许麦克风访问。');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('语音识别在此浏览器不支持');
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognitionAPI();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.serviceURI = 'https://www.google.com/';

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setViewpoint(transcript);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error);
      if (event.error === 'network') {
        alert('语音识别网络错误。尝试手动输入或检查网络设置。');
      } else if (event.error === 'not-allowed') {
        alert('麦克风权限被拒绝。请允许麦克风访问。');
      }
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error);
      if (event.error === 'network') {
        alert('语音识别需要网络连接。请检查网络或使用手动输入。');
      }
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.start();
    setRecognition(rec);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
};
  
  const generatePrompt = async (approachType: string) => {
    setSelectedPrompt(approachType);
    setIsGenerating(true);

    const contentForAI = pointForAIPrompt || submittedPoint;

    console.log('contentForAI:', contentForAI);
    console.log('pointForAIPrompt:', pointForAIPrompt);
    console.log('submittedPoint:', submittedPoint);

    if (!contentForAI) {
      alert('请先在ListenerView中提交你的观点');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discussionContent: contentForAI, approachType }),
      });

      const data = await response.json();
      if (data.prompt) {
        setSelectedPrompt(data.prompt);
      } else if (data.error) {
        console.error('AI错误:', data.error);
        alert('AI生成失败: ' + JSON.stringify(data.error));
      }
    } catch (error) {
      console.error('生成提示词失败:', error);
      alert('网络错误，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const prompts = [
    { icon: 'bulb', title: "I believe that...", desc: "State your position", gradient: 'from-blue-400 to-indigo-500' },
    { icon: 'plus', title: "Building on...", desc: "Expand arguments", gradient: 'from-blue-500 to-indigo-600' },
    { icon: 'x', title: "I disagree because...", desc: "Challenge with evidence", gradient: 'from-blue-600 to-purple-600' },
    { icon: 'book', title: "Looking at data...", desc: "Present facts", gradient: 'from-blue-400 to-teal-500' },
    { icon: 'question', title: "Can we clarify...", desc: "Ensure understanding", gradient: 'from-blue-500 to-purple-500' },
    { icon: 'link', title: "To summarize...", desc: "Connect points", gradient: 'from-cyan-400 to-blue-500' }
  ];

  const icons: Record<string, React.ReactNode> = {
    bulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    question: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    link: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  };

  return (
    <PageLayout activeTab="speakingStage" setActiveTab={setView}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{studentName?.charAt(0) || 'S'}</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{studentName || 'Speaker'}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-600 font-medium text-xs">Now Speaking</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Choose Your Approach</p>
          <div className="grid grid-cols-3 gap-3">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => generatePrompt(prompt.title)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                disabled={isGenerating}
                className={`relative p-5 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                  selectedPrompt === prompt.title
                    ? `bg-gradient-to-br ${prompt.gradient} shadow-xl scale-[1.02]`
                    : hoveredIndex === index
                    ? 'bg-white/70 border-2 border-white/60 -translate-y-2 shadow-2xl backdrop-blur-2xl'
                    : 'bg-white/40 border border-white/30 hover:bg-white/60 hover:border-white/50 backdrop-blur-xl'
                }`}
              >
                {hoveredIndex === index && !(selectedPrompt === prompt.title) && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${prompt.gradient} opacity-20 rounded-2xl`} />
                )}
                <div className={`relative p-2.5 rounded-xl mb-3 transition-all duration-300 ${
                  selectedPrompt === prompt.title ? 'bg-white/30 scale-110' : 'bg-gray-100/70 group-hover:bg-white group-hover:scale-110 backdrop-blur-xl'
                }`}>
                  <svg className={`w-6 h-6 transition-colors duration-300 ${selectedPrompt === prompt.title ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isGenerating && selectedPrompt === prompt.title ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : icons[prompt.icon]}
                  </svg>
                </div>
                <h4 className={`relative font-semibold text-sm mb-1 transition-colors duration-300 ${
                  selectedPrompt === prompt.title ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'
                }`}>
                  {prompt.title}
                </h4>
                <p className={`relative text-xs transition-colors duration-300 ${
                  selectedPrompt === prompt.title ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                  {prompt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Your Point</h2>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-full backdrop-blur-xl">Required</span>
            </div>
            <div className="relative">
              <textarea
                className="w-full h-36 p-4 pr-16 rounded-xl backdrop-blur-xl bg-white/40 border border-white/30 text-gray-700 text-sm outline-none focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20 transition-all resize-none"
                placeholder="Enter or speak your viewpoint..."
                value={viewpoint}
                onChange={(e) => setViewpoint(e.target.value)}
              />
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`absolute right-3 bottom-3 p-3 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {isRecording ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v2a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">{viewpoint.length}/500</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Your Prompt</h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-100/50 px-3 py-1.5 rounded-full backdrop-blur-xl">Auto-generated</span>
            </div>
            <textarea
              className="w-full p-4 rounded-xl backdrop-blur-xl bg-white/40 border border-white/30 text-gray-700 text-sm outline-none focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20 transition-all resize-none"
              rows={2}
              placeholder="Select an approach above to generate AI prompt..."
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{selectedPrompt.length}/200</div>
          </div>

          <button
            onClick={() => {
              if (onSubmitDraft) {
                onSubmitDraft(viewpoint);
              } else {
                setView('listener');
              }
            }}
            disabled={!viewpoint.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SpeakingStageView;