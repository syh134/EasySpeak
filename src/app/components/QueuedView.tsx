"use client";
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { ViewType } from './types';

interface QueuedViewProps {
  setView: (val: ViewType) => void;
  submittedPoint?: string;
}

const QueuedView: React.FC<QueuedViewProps> = ({ setView, submittedPoint = '' }) => {
  const [queueTimer, setQueueTimer] = useState<number>(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (queueTimer > 0) {
        setQueueTimer(queueTimer - 1);
      } else {
        setView('turnNotification');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [queueTimer, setView]);

  return (
    <PageLayout activeTab="queued" setActiveTab={setView}>
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">In Queue</h3>
              <p className="text-sm text-gray-500">You are #3 in line</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">~{queueTimer}s</div>
              <p className="text-xs text-gray-400">until your turn</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Your Point</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4">
            <p className="text-white text-sm leading-relaxed">"{submittedPoint || 'No point submitted'}"</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <button
            onClick={() => setView('listener')}
            className="w-full bg-rose-50 text-rose-500 border border-rose-100 py-3.5 rounded-xl font-medium text-sm hover:bg-rose-100 transition-all"
          >
            Leave Queue
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default QueuedView;