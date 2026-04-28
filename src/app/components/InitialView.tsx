"use client";
import React, { useState } from 'react';
import PageLayout from './PageLayout';
import { ViewType } from './types';

interface InitialViewProps {
  setView: (val: ViewType) => void;
  onJoinRoom?: (name: string) => void;
}

const InitialView: React.FC<InitialViewProps> = ({ setView, onJoinRoom }) => {
  const [secretKey, setSecretKey] = useState<string>('XJ92');
  const [studentName, setStudentName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <PageLayout noPadding>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-8">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Live Discussion</span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Enter the <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Atmosphere</span>
                </h1>
                <p className="text-gray-500 text-base">Join a live discussion room</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 mb-6">
                <div className="flex items-center">
                  <div className="flex-1 px-6 py-4">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Room Code</label>
                    <input
                      type="text"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value.toUpperCase())}
                      className="w-full outline-none font-bold text-2xl text-gray-800 bg-transparent tracking-[0.25em]"
                    />
                  </div>
                  <div className="w-px h-14 bg-gray-200" />
                  <div className="flex-[1.5] px-6 py-4">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={studentName}
                      className="w-full outline-none font-medium text-gray-700 bg-transparent"
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => { 
                  if (onJoinRoom) {
                    onJoinRoom(studentName);
                  } else {
                    setIsModalOpen(true);
                    setView('groupFound');
                  }
                }}
                disabled={!studentName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Discussion
              </button>

              <div className="mt-10 flex items-center justify-center gap-6">
                {[
                  { icon: '🔒', text: 'Private Rooms' },
                  { icon: '🗳️', text: 'Live Voting' },
                  { icon: '✨', text: 'AI Insights' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/30" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white rounded-[32px] border border-gray-100 p-10 max-w-sm w-full shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-500/30 rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome!</h2>
              <p className="text-gray-500 text-center mb-8">Ready to join the discussion?</p>

              <button
                onClick={() => { setIsModalOpen(false); setView('groupFound'); }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25"
              >
                Let's Start
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default InitialView;