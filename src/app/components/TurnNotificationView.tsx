"use client";
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { ViewType } from './types';

interface TurnNotificationViewProps {
  setView: (val: ViewType) => void;
  onStartSpeaking?: () => void;
}

const TurnNotificationView: React.FC<TurnNotificationViewProps> = ({ setView, onStartSpeaking }) => {
  const [notificationTimer, setNotificationTimer] = useState<number>(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notificationTimer > 0) {
        setNotificationTimer(notificationTimer - 1);
      } else {
        setView('speakingStage');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [notificationTimer, setView]);

  return (
    <PageLayout activeTab="speakingStage" setActiveTab={setView}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gradient-to-b from-violet-400/40 via-fuchsia-400/30 to-pink-400/40 rounded-full blur-[150px]" />

        <div className="relative flex flex-col items-center justify-center min-h-[80vh]">
          <div className="relative mb-10">
            <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-fuchsia-500/40 rotate-3">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="absolute -inset-4 border-2 border-fuchsia-400/30 rounded-[40px] animate-ping" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">You're Up!</h1>
            <p className="text-gray-500 text-lg">Your turn to speak is about to begin</p>
          </div>

          <div className="backdrop-blur-3xl bg-white/30 rounded-[32px] border border-white/30 p-8 mb-8 shadow-2xl shadow-black/10">
            <span className="text-6xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {notificationTimer}
            </span>
          </div>

          <div className="flex gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i <= notificationTimer
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/50'
                    : 'bg-gray-200/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (onStartSpeaking) {
                onStartSpeaking();
              } else {
                setView('speakingStage');
              }
            }}
            className="backdrop-blur-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-fuchsia-500/25 hover:shadow-2xl hover:shadow-fuchsia-500/30 transition-all flex items-center gap-2"
          >
            Start Speaking
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TurnNotificationView;