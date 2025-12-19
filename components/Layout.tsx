
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Retrieve backUrl from router state, defaulting to '/' if not present
  const state = location.state as { backUrl?: string } | null;
  const backUrl = state?.backUrl || '/';
  const backLabel = backUrl === '/interview' ? '返回题库' : '返回首页';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-700 transition-colors">
                智
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                智学助手
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                首页
              </Link>
              <Link 
                to="/interview" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/interview' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                面试题库
              </Link>
            </nav>
          </div>
          
          {/* Mobile/Auxiliary Action */}
          <div className="flex items-center">
            {!isHome && location.pathname !== '/interview' && (
              <Link 
                to={backUrl} 
                className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {backLabel}
              </Link>
            )}
            {/* Mobile Nav Link (Visible only on small screens if not on home) */}
            <div className="md:hidden ml-4">
               {location.pathname !== '/interview' && <Link to="/interview" className="text-sm font-bold text-slate-600">题库</Link>}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} 智学助手 (SmartLearn) | Powered by Google Gemini</p>
        </div>
      </footer>
    </div>
  );
};
