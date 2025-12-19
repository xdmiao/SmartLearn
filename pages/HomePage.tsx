
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GENERAL_QUESTIONS } from '../constants';
import { Category } from '../types';
import { dbService } from '../services/db';

const STORAGE_KEY_AI_PREF = 'smart_learn_ai_preference';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MASTERED' | 'UNMASTERED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  
  // Initialize from LocalStorage
  const [useAISearch, setUseAISearch] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AI_PREF) === 'true';
  });

  // Load initial state from LocalStorage
  useEffect(() => {
    dbService.getAllMasteredIds().then(setMasteredIds);
  }, []);

  const toggleAISearch = () => {
    const newValue = !useAISearch;
    setUseAISearch(newValue);
    localStorage.setItem(STORAGE_KEY_AI_PREF, String(newValue));
  };

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

  // 动态生成类别列表：仅显示首页题目中实际存在的类别
  const categories = useMemo(() => {
    const uniqueCategories = new Set(GENERAL_QUESTIONS.map(q => q.category));
    return Array.from(uniqueCategories);
  }, []);

  const { totalCount, masteredCount, unmasteredCount } = useMemo(() => {
    const categoryQuestions = GENERAL_QUESTIONS.filter(q => 
      selectedCategory === 'ALL' || q.category === selectedCategory
    );

    const mastered = categoryQuestions.filter(q => masteredIds.has(q.id)).length;
    
    return {
      totalCount: categoryQuestions.length,
      masteredCount: mastered,
      unmasteredCount: categoryQuestions.length - mastered
    };
  }, [selectedCategory, masteredIds]);

  const filteredQuestions = useMemo(() => {
    return GENERAL_QUESTIONS.filter((q) => {
      const isMastered = masteredIds.has(q.id);

      const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (q.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'MASTERED') {
        matchesStatus = isMastered;
      } else if (statusFilter === 'UNMASTERED') {
        matchesStatus = !isMastered;
      }

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [selectedCategory, searchQuery, masteredIds, statusFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-[2rem] p-8 md:p-14 text-white text-center shadow-2xl shadow-blue-200/50 mx-2 md:mx-0">
        <div className="relative z-10 flex flex-col items-center gap-4">
           <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
             智学助手 <span className="font-light text-blue-100/90 ml-2">SmartLearn</span>
           </h1>
           <p className="text-blue-50 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
             基于 Gemini 3 的智能编程导师，助您从入门到精通。
           </p>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Sticky Control Bar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 md:mx-0 md:px-0 transition-all">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl p-3 md:p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar mask-image-linear-gradient">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch">
            {/* Status Select */}
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-0 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
              >
                <option value="ALL">全部状态 ({totalCount})</option>
                <option value="MASTERED">已掌握 ({masteredCount})</option>
                <option value="UNMASTERED">未掌握 ({unmasteredCount})</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索题目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-0 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 hover:bg-slate-100 transition-colors"
              />
            </div>

            {/* AI Toggle */}
            <div 
              className="flex items-center justify-between sm:justify-start gap-3 px-4 py-2 bg-slate-50 rounded-lg border-0 cursor-pointer group hover:bg-slate-100 transition-colors select-none"
              onClick={toggleAISearch}
            >
              <span className={`text-sm font-medium transition-colors ${useAISearch ? 'text-indigo-600' : 'text-slate-500'}`}>
                AI 模式
              </span>
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                useAISearch ? 'bg-indigo-600' : 'bg-slate-300'
              }`}>
                <span
                  className={`${
                    useAISearch ? 'translate-x-4' : 'translate-x-1'
                  } inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-2 md:px-0">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isMastered = masteredIds.has(q.id);
            return (
              <Link
                key={q.id}
                to={`/question/${q.id}?ai=${useAISearch}`}
                state={{ backUrl: '/' }}
                className={`group flex flex-col relative bg-white rounded-2xl p-6 border transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1 ${
                  isMastered 
                    ? 'border-green-200/60 bg-green-50/30 shadow-sm hover:shadow-md hover:border-green-300' 
                    : 'border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200'
                }`}
              >
                {/* Header: Difficulty & Category */}
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        q.difficulty === '入门' ? 'bg-emerald-100 text-emerald-700' :
                        q.difficulty === '进阶' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {q.category}
                      </span>
                   </div>
                   
                   {/* Mastery Button */}
                   <button
                    onClick={(e) => toggleMastery(e, q.id)}
                    className={`relative z-10 p-2 rounded-full transition-all ${
                      isMastered 
                        ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                        : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'
                    }`}
                    title={isMastered ? "标记为未掌握" : "标记为已掌握"}
                  >
                    {isMastered ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Content */}
                <h3 className={`text-lg font-bold mb-3 leading-snug transition-colors ${
                  isMastered ? 'text-slate-600' : 'text-slate-800 group-hover:text-blue-600'
                }`}>
                  {q.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {q.description}
                </p>

                {/* Footer Action */}
                <div className={`mt-auto pt-4 border-t flex items-center justify-between text-sm font-semibold transition-all ${
                  isMastered 
                    ? 'border-green-100 text-green-600'
                    : 'border-slate-50 text-slate-300 group-hover:border-slate-100 group-hover:text-blue-600'
                }`}>
                  <span>{isMastered ? '复习知识点' : '开始学习'}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">未找到相关题目</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              尝试调整搜索词或筛选条件，或者切换类别查看更多内容。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
