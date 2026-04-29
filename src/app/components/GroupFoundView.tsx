"use client";
import React from 'react';
import PageLayout from './PageLayout';
import { ViewType } from './types';

interface GroupFoundViewProps {
  setView: (val: ViewType) => void;
  studentName?: string;
  onSimulateMultiUser?: () => void;
}

const GroupFoundView: React.FC<GroupFoundViewProps> = ({ setView, studentName = 'Speaker', onSimulateMultiUser }) => (
  <PageLayout activeTab="initial" setActiveTab={setView}>
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-[120px]" />

      <div className="relative flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Group Ready</span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">Room</p>
              <h2 className="text-4xl font-bold text-gray-900">Room 102</h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
              <p className="text-gray-700 font-medium leading-relaxed">
                Should AI tools be encouraged in language learning classrooms?
              </p>
            </div>

            <button
              onClick={() => setView('listener')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              Enter Discussion Room
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <button
              disabled
              className="w-full mt-3 bg-gray-100 text-gray-400 border border-gray-200 py-3 rounded-xl font-medium text-sm cursor-not-allowed"
            >
              Simulate Multi-User Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default GroupFoundView;