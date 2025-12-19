
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INTERVIEW_QUESTIONS } from '../constants';
import { dbService } from '../services/db';

export const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MASTERED' | 'UNMASTERED'>('ALL');
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Load initial mastery state
  useEffect(() => {
    dbService.getAllMasteredIds().then(setMasteredIds);
  }, []);

  const toggleMastery = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const isCurrentlyMastered = masteredIds.has(id);
    
    // Optimistic UI Update
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyMastered) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      await dbService.toggleMastery(id, isCurrentlyMastered);
    } catch (error) {
      console.error("Storage failed:", error);
      // Rollback UI if save fails
      setMasteredIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyMastered) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      alert("无法保存状态，请检查浏览器设置");
    }
  };

  // Extract unique companies from the data
  const companies = useMemo(() => {
    const uniqueCategories = new Set(INTERVIEW_QUESTIONS.map(q => q.category));
    return Array.from(uniqueCategories);
  }, []);

  // Group questions by Category and apply filters (Category + Status)
  const groupedQuestions = useMemo(() => {
    const groups: Record<string, typeof INTERVIEW_QUESTIONS> = {};
    let count = 0;
    
    INTERVIEW_QUESTIONS.forEach(q => {
      // 1. Company Filter
      const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;

      // 2. Status Filter
      const isMastered = masteredIds.has(q.id);
      let matchesStatus = true;
      if (statusFilter === 'MASTERED') {
        matchesStatus = isMastered;
      } else if (statusFilter === 'UNMASTERED') {
        matchesStatus = !isMastered;
      }

      if (matchesCategory && matchesStatus) {
        if (!groups[q.category]) {
          groups[q.category] = [];
        }
        groups[q.category].push(q);
        count++;
      }
    });

    return { entries: Object.entries(groups), totalCount: count };
  }, [selectedCategory, statusFilter, masteredIds]);

  const handleRandomPick = () => {
    // Filter available questions based on current view to make random pick more relevant
    const availableQuestions = INTERVIEW_QUESTIONS.filter(q => {
       const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
       const isMastered = masteredIds.has(q.id);
       let matchesStatus = true;
       if (statusFilter === 'MASTERED') matchesStatus = isMastered;
       if (statusFilter === 'UNMASTERED') matchesStatus = !isMastered;
       return matchesCategory && matchesStatus;
    });

    if (availableQuestions.length === 0) {
      alert('当前筛选条件下没有可用的题目');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const randomId = availableQuestions[randomIndex].id;
    navigate(`/question/${randomId}?ai=true`, { state: { backUrl: '/interview' } });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
              面试题集锦
            </h1>
            <p className="text-indigo-100 text-base md:text-lg opacity-90">
              系统复习知识点，查漏补缺，从容应对技术面试。
            </p>
          </div>
          
          <button
            onClick={handleRandomPick}
            className="group relative inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              随机模拟面试
            </span>
          </button>
        </div>
        
        {/* Abstract Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl"></div>
      </div>

      {/* Filter Bar (Sticky) */}
      <div className="sticky top-16 z-30 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl p-4 space-y-4">
            {/* Row 1: Companies */}
            <div className="flex flex-wrap gap-2 w-full">
                <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                    selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                }`}
                >
                全部公司
                </button>
                {companies.map((comp) => (
                <button
                    key={comp}
                    onClick={() => setSelectedCategory(comp)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                    selectedCategory === comp
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200 ring-offset-1'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                    {comp}
                </button>
                ))}
            </div>

            {/* Row 2: Status Filter */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">题目状态</span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[
                        { value: 'ALL', label: '全部' },
                        { value: 'UNMASTERED', label: '待攻克' },
                        { value: 'MASTERED', label: '已掌握' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setStatusFilter(opt.value as any)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                statusFilter === opt.value
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-xs font-medium text-slate-400">
                    共找到 {groupedQuestions.totalCount} 题
                </div>
            </div>
        </div>
      </div>

      {/* Directory List */}
      <div className="space-y-8">
        {groupedQuestions.entries.length > 0 ? (
          groupedQuestions.entries.map(([category, questions]) => (
            <div key={category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  {category}
                </h2>
                <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
                  {questions.length} 题
                </span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {questions.map((q, index) => {
                  const isMastered = masteredIds.has(q.id);
                  return (
                    <Link
                      key={q.id}
                      to={`/question/${q.id}?ai=true`}
                      state={{ backUrl: '/interview' }}
                      className={`block px-6 py-4 transition-all group ${
                          isMastered ? 'bg-slate-50/50 hover:bg-slate-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-grow">
                          <span className={`font-mono text-sm mt-0.5 w-6 flex-shrink-0 transition-colors ${
                              isMastered ? 'text-green-500 font-bold' : 'text-slate-400'
                          }`}>
                            {isMastered ? '✓' : (index + 1).toString().padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className={`text-base font-medium transition-colors ${
                                isMastered ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800 group-hover:text-indigo-600'
                            }`}>
                              {q.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1 opacity-80">
                              {q.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                             {/* Difficulty Badge */}
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                                q.difficulty === '入门' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                q.difficulty === '进阶' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {q.difficulty}
                            </span>

                            {/* Mastery Toggle */}
                            <button
                                onClick={(e) => toggleMastery(e, q.id)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all border ${
                                    isMastered
                                        ? 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'
                                        : 'bg-white text-slate-300 border-slate-200 hover:text-indigo-500 hover:border-indigo-200'
                                }`}
                                title={isMastered ? "标记为未掌握" : "标记为已掌握"}
                            >
                                <svg className="w-5 h-5" fill={isMastered ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-600">没有符合条件的题目</h3>
            <p className="text-slate-400 mt-2">请尝试切换筛选状态或选择其他公司</p>
          </div>
        )}
      </div>
    </div>
  );
};
