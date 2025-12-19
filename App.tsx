
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AnswerPage } from './pages/AnswerPage';
import { InterviewPage } from './pages/InterviewPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/question/:id" element={<AnswerPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
