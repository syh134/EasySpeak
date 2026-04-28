"use client";
import React, { useState } from 'react';
import PageLayout from './PageLayout';
import { ViewType, Votes } from './types';

interface ListenerViewProps {
  setView: (val: ViewType) => void;
  submittedPoint?: string;
}

const ListenerView: React.FC<ListenerViewProps> = ({ setView, submittedPoint = '' }) => {
  const [votes, setVotes] = useState<Votes>({ agree: 72, disagree: 28 });
  const [userVoted, setUserVoted] = useState<boolean>(false);

  const total = votes.agree + votes.disagree;
  const agreePercent = Math.round((votes.agree / total) * 100);

  const previousViewpoints = [
    { speaker: "Sarah Jenkins", quote: "The shift toward free verse wasn't just a stylistic choice, but a fundamental reconceptualization of what poetry could be.", time: "2:34", avatar: "S" },
    { speaker: "Michael Chen", quote: "I think the data actually shows that structured verse helped students understand rhythm better initially.", time: "2:15", avatar: "M" },
    { speaker: "Emma Rodriguez", quote: "But what about cultural context? Free verse allows for more authentic expression of diverse voices.", time: "1:58", avatar: "E" },
  ];

  return (
    <PageLayout activeTab="listener" setActiveTab={setView}>
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Discussion</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-blue-600 font-semibold">+{votes.agree}</span>
              <span className="text-gray-300">|</span>
              <span className="text-rose-500 font-semibold">+{votes.disagree}</span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${agreePercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0%</span>
            <span className="font-semibold text-gray-600">{agreePercent}% Agreement</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Previous Perspectives</p>
          <div className="space-y-3">
            {previousViewpoints.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shrink-0">
                    <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900">{point.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{point.speaker}</span>
                      <span className="text-xs text-gray-400 font-mono">{point.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">"{point.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Now Speaking</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Point</h4>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 mb-5">
            <p className="text-white leading-relaxed text-center italic text-sm">"{submittedPoint || 'No point submitted'}"</p>
          </div>

          <div className="flex gap-3 mb-4">
            {userVoted ? (
              <>
                <button className="flex-1 py-3 rounded-xl font-medium text-sm bg-blue-50 text-blue-600 border border-blue-100 cursor-not-allowed">
                  Agreed
                </button>
                <button className="flex-1 py-3 rounded-xl font-medium text-sm bg-rose-50 text-rose-600 border border-rose-100 cursor-not-allowed">
                  Disagreed
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setVotes(v => ({ ...v, agree: v.agree + 1 })); setUserVoted(true); }}
                  className="flex-1 py-3 rounded-xl font-medium text-sm bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                >
                  Agree
                </button>
                <button
                  onClick={() => { setVotes(v => ({ ...v, disagree: v.disagree + 1 })); setUserVoted(true); }}
                  className="flex-1 py-3 rounded-xl font-medium text-sm bg-gray-50 text-gray-700 border border-gray-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all"
                >
                  Disagree
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setView('queued')}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Request to Speak
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ListenerView;