"use client";
import React from 'react';
import { ViewType } from './types';

interface PageLayoutProps {
  activeTab?: ViewType;
  setActiveTab?: (tab: ViewType) => void;
  children?: React.ReactNode;
  noPadding?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ activeTab, setActiveTab, children, noPadding }) => {
  const handleSetActiveTab = (tab: ViewType) => {
    if (setActiveTab) setActiveTab(tab);
  };

  const navItems = [
    { id: 'queued', icon: 'users', label: 'Speaker Queue' },
    { id: 'speakingStage', icon: 'chat', label: 'Discussion Stage' },
    { id: 'ai-summary', icon: 'chart', label: 'AI Summary' },
  ];

  const icons: Record<string, React.ReactNode> = {
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 h-screen sticky top-0 p-4">
        <div className="h-full backdrop-blur-3xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl shadow-black/5 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900 font-bold text-lg">SpeakEasy</h1>
                <p className="text-gray-500 text-xs">Discussion Platform</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-4">Navigation</p>

            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSetActiveTab(item.id as ViewType)}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20'
                    : 'hover:bg-white/60'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100/50 group-hover:bg-white'}`}>
                  <svg className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[item.icon]}
                  </svg>
                </div>
                <span className={`font-medium text-sm transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </nav>

          <div className="p-4">
            <button
              onClick={() => handleSetActiveTab('initial')}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all"
            >
              + New Topic
            </button>
          </div>

          <div className="p-4 border-t border-gray-200/30">
            <div className="flex items-center gap-4 px-2">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-gray-900 font-semibold text-sm">Y</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm">Guest User</p>
                <p className="text-gray-400 text-xs">Active now</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;