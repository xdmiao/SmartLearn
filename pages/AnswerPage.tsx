
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { QUESTIONS } from '../constants';
import { fetchAnswerFromGemini } from '../services/geminiService';
import { AnswerState } from '../types';

const STORAGE_KEY_AI_PREF = 'smart_learn_ai_preference';

export const AnswerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const question = QUESTIONS.find((q) => q.id === id);

  // Determine if we show the toggle. Logic: Show only if there is a standard answer.
  const hasStandardAnswer = !!question?.standardAnswer;

  // Initialize AI Mode state
  // Priority: 1. URL Param (if explicitly set) -> 2. LocalStorage -> 3. Default (false)
  const [isAIMode, setIsAIMode] = useState<boolean>(() => {
    const urlParam = searchParams.get('ai');
    if (urlParam !== null) {
      // If URL has param, use it and sync to storage
      const val = urlParam === 'true';
      localStorage.setItem(STORAGE_KEY_AI_PREF, String(val));
      return val;
    }
    // Fallback to storage
    const stored = localStorage.getItem(STORAGE_KEY_AI_PREF);
    return stored === 'true';
  });

  const [answerState, setAnswerState] = useState<AnswerState>({
    isLoading: true,
    content: null,
    error: null,
  });

  // Handler for toggling the mode
  const toggleAIMode = () => {
    const newValue = !isAIMode;
    setIsAIMode(newValue);
    localStorage.setItem(STORAGE_KEY_AI_PREF, String(newValue));
    
    // Update URL without reloading to keep state shareable
    setSearchParams(prev => {
      prev.set('ai', String(newValue));
      return prev;
    }, { replace: true });
  };

  useEffect(() => {
    if (!question) return;

    // Logic: 
    // 1. If we have a standard answer AND AI mode is off, show standard answer.
    // 2. Otherwise (AI Mode ON OR No standard answer), fetch from Gemini.
    if (hasStandardAnswer && !isAIMode) {
      setAnswerState({
        isLoading: false,
        content: question.standardAnswer!,
        error: null,
      });
      return;
    }

    let isMounted = true;
    setAnswerState(prev => ({ ...prev, isLoading: true })); 

    const loadAnswer = async () => {
      try {
        const text = await fetchAnswerFromGemini(question.title, question.description || '', isAIMode || !hasStandardAnswer);
        if (isMounted) {
          setAnswerState({
            isLoading: false,
            content: text,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setAnswerState({
            isLoading: false,
            content: null,
            error: '加载答案失败，请检查网络连接。',
          });
        }
      }
    };

    loadAnswer();

    return () => {
      isMounted = false;
    };
  }, [question, isAIMode, hasStandardAnswer]); 

  // Helper to render markdown-like content with basic code highlighting
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} className="my-6 relative group">
            <div className="absolute -top-3 right-4 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Code
            </div>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto text-sm md:text-base leading-relaxed shadow-inner border border-slate-700">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-base md:text-lg text-slate-700 break-words">
          {part.split('\n').map((line, lineIdx) => {
            if (!line.trim()) return <div key={lineIdx} className="h-2" />; 
            
            if (line.startsWith('**') && line.endsWith('**') && line.length < 50) {
                 return <h3 key={lineIdx} className="text-xl font-bold text-slate-900 mt-6 mb-3">{line.slice(2, -2)}</h3>
            }

            const lineParts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={lineIdx} className={`${line.startsWith('●') ? 'pl-4 mb-2' : 'mb-2'}`}>
                {lineParts.map((p, i) => 
                  p.startsWith('**') && p.endsWith('**') ? 
                  <strong key={i} className="text-slate-900 font-bold">{p.slice(2, -2)}</strong> : 
                  <span key={i}>{p}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  };

  if (!question) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header Card - Updated to match Home Page Gradient Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-10 text-white shadow-lg">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-4">
            
            {/* Title and Tags */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                  {question.category}
                </span>
                <span className="text-blue-100 text-xs font-medium">
                  {question.difficulty} 难度
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-white">
                {question.title}
              </h1>
              
              <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-2xl">
                {question.description}
              </p>
            </div>

            {/* AI Toggle Switch (Radio-like behavior) - Show only if standard answer exists */}
            {hasStandardAnswer && (
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 self-start">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium transition-colors ${isAIMode ? 'text-blue-200' : 'text-white'}`}>
                    标准
                  </span>
                  
                  <button
                    onClick={toggleAIMode}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white ${
                      isAIMode ? 'bg-green-400' : 'bg-slate-700/50'
                    }`}
                    role="switch"
                    aria-checked={isAIMode}
                  >
                    <span className="sr-only">切换 AI 模式</span>
                    <span
                      className={`${
                        isAIMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`}
                    />
                  </button>
                  
                  <span className={`text-sm font-medium transition-colors ${isAIMode ? 'text-white font-bold' : 'text-blue-200'}`}>
                    AI 解析
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Answer Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${answerState.isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {answerState.isLoading 
                ? 'AI 正在思考...' 
                : (isAIMode || !hasStandardAnswer
                    ? 'AI 智能解析' 
                    : '标准参考答案')
              }
            </span>
          </div>
          {!answerState.isLoading && (
             <span className="text-xs text-slate-400 hidden sm:inline">
               {isAIMode || !hasStandardAnswer ? 'Powered by Gemini 3 Flash' : 'Local Database'}
             </span>
          )}
        </div>

        <div className="p-5 md:p-8">
          {answerState.isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-32 bg-slate-100 rounded w-full mt-6"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3 mt-6"></div>
            </div>
          ) : answerState.error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
              {answerState.error}
              <button 
                onClick={() => window.location.reload()} 
                className="block mx-auto mt-2 text-sm underline hover:text-red-800"
              >
                重试
              </button>
            </div>
          ) : (
            <div className="prose prose-slate prose-lg max-w-none">
               {answerState.content && renderContent(answerState.content)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
