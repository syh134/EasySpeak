"use client";
import React, { useState, useEffect } from 'react';
import { InitialView, GroupFoundView, QueuedView, TurnNotificationView, SpeakingStageView, ListenerView, AISummaryView } from './components';

type ViewType = 'initial' | 'groupFound' | 'listener' | 'queued' | 'turnNotification' | 'speakingStage' | 'ai-summary';

export default function SpeakeasySystem() {
  const [view, setView] = useState<ViewType>('initial');
  const [mounted, setMounted] = useState<boolean>(false);
  const [discussionContent, setDiscussionContent] = useState<string>('');
  const [previousViewpoints, setPreviousViewpoints] = useState<string[]>([]);
  const [submittedPoint, setSubmittedPoint] = useState<string>('');
  const [pointForAIPrompt, setPointForAIPrompt] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [viewpointVotes, setViewpointVotes] = useState<Array<{point: string, agree: number, disagree: number}>>([]);
  
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const handleJoinRoom = (name: string) => {
    setStudentName(name);
    setDiscussionContent('');
    setPreviousViewpoints([]);
    setSubmittedPoint('');
    setPointForAIPrompt('');
    setViewpointVotes([]);
    setView('groupFound');
  };

  const handleSubmitDraft = (point: string) => {
    console.log('handleSubmitDraft called with:', point);
    setSubmittedPoint(point);
    setPointForAIPrompt(point);
    setDiscussionContent(point);
    setPreviousViewpoints(prev => [...prev, point]);
    setView('listener');
  };

  const handleEnterSpeakingStage = () => {
    setSubmittedPoint('');
    setPointForAIPrompt('');  // 清除这个
    setView('speakingStage');
  };

  const handleFinishSpeaking = (finalPoint: string) => {
    setPreviousViewpoints(prev => [...prev, finalPoint]);
    setDiscussionContent(finalPoint);
    setSubmittedPoint('');
    setView('listener');
  };

  const addQuickPoint = (point: string) => {
    setPreviousViewpoints(prev => [...prev, point]);
    setDiscussionContent(point);
  };

  const simulateMultiUser = async () => {
    setPreviousViewpoints([]);
    setViewpointVotes([]);
    setDiscussionContent('');
    setView('listener');
  };

  console.log('Page state:', { view, discussionContent, previousViewpoints, studentName });

  switch (view) {
    case 'initial':
      return <InitialView setView={setView} onJoinRoom={handleJoinRoom} />;
    case 'groupFound':
      return <GroupFoundView setView={setView} studentName={studentName} onSimulateMultiUser={simulateMultiUser} />;
    case 'listener':
      return <ListenerView setView={setView} submittedPoint={submittedPoint} previousViewpoints={previousViewpoints} />;
    case 'queued':
      return <QueuedView setView={setView} submittedPoint={submittedPoint} />;
    case 'turnNotification':
      return <TurnNotificationView setView={setView} onStartSpeaking={handleEnterSpeakingStage} />;
    case 'speakingStage':
      return <SpeakingStageView setView={setView} submittedPoint={submittedPoint} pointForAIPrompt={pointForAIPrompt} studentName={studentName} onSubmitDraft={handleSubmitDraft} onFinishSpeaking={handleFinishSpeaking} />;
    case 'ai-summary':
      return <AISummaryView setView={setView} discussionContent={discussionContent} previousViewpoints={previousViewpoints} viewpointVotes={viewpointVotes} />;
    default:
      return null;
  }
}