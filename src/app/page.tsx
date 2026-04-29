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
    setView('groupFound');
  };

  const handleSubmitDraft = (point: string) => {
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
    const topics = [
      { text: 'AI tools should be encouraged because they help students learn faster', agree: 3, disagree: 1 },
      { text: 'Students rely too much on AI and do not develop skills', agree: 1, disagree: 3 },
      { text: 'It depends on how we use AI as a supplement', agree: 2, disagree: 0 },
      { text: 'AI has improved student engagement significantly', agree: 2, disagree: 1 },
      { text: 'Some students use AI to cheat rather than learn', agree: 0, disagree: 2 },
    ];
    
    const shuffled = topics.sort(() => Math.random() - 0.5);
    const selectedPoints = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
    
    setPreviousViewpoints([]);
    setViewpointVotes([]);
    setDiscussionContent('');
    for (const p of selectedPoints) {
      await new Promise(r => setTimeout(r, 100));
      setPreviousViewpoints(prev => [...prev, p.text]);
      setViewpointVotes(prev => [...prev, { point: p.text, agree: p.agree, disagree: p.disagree }]);
      setDiscussionContent(p.text);
    }
    setView('listener');
  };

  console.log('Page state:', { view, discussionContent, previousViewpoints, studentName });

  switch (view) {
    case 'initial':
      return <InitialView setView={setView} onJoinRoom={handleJoinRoom} />;
    case 'groupFound':
      return <GroupFoundView setView={setView} studentName={studentName} onSimulateMultiUser={simulateMultiUser} />;
    case 'listener':
      return <ListenerView setView={setView} submittedPoint={submittedPoint} />;
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