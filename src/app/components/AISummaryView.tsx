"use client";
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { ViewType } from './types';

interface AISummaryViewProps {
  setView: (val: ViewType) => void;
  discussionContent?: string;
  previousViewpoints?: string[];
  viewpointVotes?: Array<{point: string, agree: number, disagree: number}>;
}

interface SummaryData {
  topic: string;
  keyPoints: Array<{ sentiment: string; text: string; votes: number }>;
  consensus: string;
  duration: string;
  participants: number;
  views: number;
  supportData?: Array<{ label: string; value: number; color: string }>;
  decisionTree?: Array<{
    question: string;
    children: Array<{ answer: string; next: string; support: number }>;
  }>;
}

const defaultSummaryData: SummaryData = {
  topic: "No discussion content available",
  keyPoints: [],
  consensus: "No consensus reached",
  duration: "00:00",
  participants: 0,
  views: 0,
};

const defaultSupportData = [
  { label: "Support", value: 50, color: "from-emerald-400 to-teal-500" },
  { label: "Opposition", value: 30, color: "from-rose-400 to-pink-500" },
  { label: "Neutral", value: 20, color: "from-violet-400 to-purple-500" },
];

const defaultDecisionTree = [
  {
    question: "Is there a consensus?",
    children: [
      { answer: "Yes", next: "Summarize agreement", support: 60 },
      { answer: "No", next: "Identify key differences", support: 40 },
    ],
  },
];

const AISummaryView: React.FC<AISummaryViewProps> = ({ setView, discussionContent = '', previousViewpoints = [], viewpointVotes = [] }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'tree'>('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<SummaryData>(defaultSummaryData);

  useEffect(() => {
    console.log('AISummary received:', { discussionContent, previousViewpoints });
    
    if (!discussionContent && previousViewpoints.length === 0) {
      console.log('No content, returning');
      setIsLoading(false);
      return;
    }

    const generateSummary = async () => {
      console.log('Calling AI...');
      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discussionContent, previousViewpoints }),
        });

        const data = await response.json();
        console.log('AI response:', data);

        if (data.summary) {
          setSummaryData({
            ...data.summary,
            supportData: data.summary.supportData || defaultSupportData,
            decisionTree: data.summary.decisionTree || defaultDecisionTree,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, []);

  const decisionTree = summaryData.decisionTree || defaultDecisionTree;
  const supportData = summaryData.supportData || defaultSupportData;

  return (
    <PageLayout activeTab="ai-summary" setActiveTab={setView}>
      <div className="space-y-5">
        <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">AI Summary</p>
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-400">
              <span>{summaryData.duration}</span>
              <span>{summaryData.participants} participants</span>
              <span>{summaryData.views} views</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'summary'
                ? 'backdrop-blur-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/25'
                : 'backdrop-blur-xl bg-white/20 text-gray-600 border border-white/30 hover:bg-white/30'
            }`}
          >
            Content Summary
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'tree'
                ? 'backdrop-blur-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/25'
                : 'backdrop-blur-xl bg-white/20 text-gray-600 border border-white/30 hover:bg-white/30'
            }`}
          >
            Decision Tree
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div>
            {isLoading ? (
              <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-10">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-14 h-14 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-400/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-fuchsia-500 animate-spin" />
                    <div className="absolute inset-3 rounded-full border-3 border-transparent border-t-fuchsia-400 border-l-pink-400 animate-spin" style={{ animationDuration: '1.5s' }} />
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1">AI is thinking...</p>
                  <p className="text-sm text-gray-400">Analyzing discussion content</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="backdrop-blur-3xl bg-gradient-to-r from-violet-500/90 via-fuchsia-500/90 to-pink-500/90 rounded-2xl border border-white/20 p-6 shadow-xl shadow-fuchsia-500/15">
                  <p className="text-lg font-medium text-white leading-relaxed">{summaryData.topic}</p>
                </div>

                <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Key Takeaways</p>
                  <div className="space-y-3">
                    {summaryData.keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-xl border ${
                          point.sentiment === 'pro'
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : point.sentiment === 'con'
                            ? 'bg-rose-500/10 border-rose-500/20'
                            : 'bg-violet-500/10 border-violet-500/20'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl ${
                          point.sentiment === 'pro' ? 'bg-emerald-500/20' : point.sentiment === 'con' ? 'bg-rose-500/20' : 'bg-violet-500/20'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            point.sentiment === 'pro' ? 'text-emerald-500' : point.sentiment === 'con' ? 'text-rose-500' : 'text-violet-500'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {point.sentiment === 'pro' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2" />
                            ) : point.sentiment === 'con' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-700 text-sm">{point.text}</p>
                        </div>
                        <span className="font-semibold text-gray-500 text-sm">+{point.votes}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 p-5">
                  <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">Group Consensus</p>
                  <p className="text-gray-600">{summaryData.consensus}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Discussion Flow</p>

              <div className="flex flex-col items-center">
                <div className="w-64 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl p-4 text-center shadow-xl shadow-fuchsia-500/15 mb-6">
                  <p className="font-semibold text-white text-sm">{summaryData.topic}</p>
                </div>

                {viewpointVotes && viewpointVotes.length > 0 ? (
                  <div className="flex flex-col items-center w-full">
                    {viewpointVotes.map((v: {point: string, agree: number, disagree: number}, idx: number) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-px h-8 bg-violet-300/50 mb-2" />
                        <div className="backdrop-blur-xl bg-white/60 rounded-xl p-3 border border-violet-200/30 mb-2 max-w-md">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
                              {idx + 1}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">发言 {idx + 1}</p>
                          </div>
                          <p className="text-sm text-gray-700 text-center">{v.point}</p>
                        </div>
                        
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <div className="w-px h-4 bg-emerald-300/50 mb-2" />
                            <div className="rounded-full px-4 py-2 bg-emerald-500/20 border border-emerald-400/30">
                              <span className="text-emerald-600 text-sm font-medium">👍 同意 ({v.agree})</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-px h-4 bg-rose-300/50 mb-2" />
                            <div className="rounded-full px-4 py-2 bg-rose-500/20 border border-rose-400/30">
                              <span className="text-rose-600 text-sm font-medium">👎 不同意 ({v.disagree})</span>
                            </div>
                          </div>
                        </div>

                        {idx < viewpointVotes.length - 1 && (
                          <div className="w-px h-8 bg-violet-300/50 mt-2" />
                        )}
                      </div>
                    ))}
                    
                    <div className="w-px h-8 bg-violet-300/50 mb-2" />
                    <div className="backdrop-blur-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl p-4 mt-2">
                      <p className="text-white font-medium text-sm text-center">{summaryData.consensus}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-14 items-start">
                    {decisionTree.map((branch: { question: string; children: Array<{ answer: string; next: string; support: number }> }, idx: number) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-px h-6 bg-gray-300/50 mb-4" />
                        <div className="backdrop-blur-xl bg-white/50 rounded-xl p-4 border border-white/30 mb-4 min-w-[180px]">
                          <p className="font-medium text-gray-700 text-sm text-center">{branch.question}</p>
                        </div>
                        <div className="flex gap-3">
                          {branch.children.map((child: { answer: string; next: string; support: number }, cidx: number) => (
                            <div key={cidx} className="flex flex-col items-center">
                              <div className="w-px h-3 bg-gray-300/50 mb-2" />
                              <div className={`rounded-xl px-3 py-2 text-center ${
                                cidx === 0 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-violet-500/10 border border-violet-500/30'
                              }`}>
                                <p className="font-medium text-gray-700 text-xs">{child.answer}</p>
                              </div>
                              <div className="w-px h-3 bg-gray-300/50 my-2" />
                              <div className="backdrop-blur-xl bg-white/40 rounded-xl px-3 py-2 border border-dashed border-gray-300/50">
                                <p className="text-xs text-gray-500">{child.next}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="backdrop-blur-3xl bg-white/20 rounded-2xl border border-white/30 shadow-xl shadow-black/5 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Support Rate</p>
              <div className="space-y-4">
                {supportData.map((item: { label: string; value: number; color: string }, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-800">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200/30 rounded-full overflow-hidden backdrop-blur-xl">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200/30">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryData.participants}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setView('initial')}
            className="flex-1 backdrop-blur-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-fuchsia-500/25 hover:shadow-2xl hover:shadow-fuchsia-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start New Discussion
          </button>
          <button className="flex-1 backdrop-blur-xl bg-white/30 text-gray-700 py-4 rounded-2xl font-medium text-sm border border-white/30 hover:bg-white/50 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Summary
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AISummaryView;