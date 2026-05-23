import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import DailyQuestion from './pages/DailyQuestion';
import Challenges from './pages/Challenges';
import Memories from './pages/Memories';
import Quiz from './pages/Quiz';
import Insights from './pages/Insights';
import Profile from './pages/Profile';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const { isOnboarded } = useCouple();
  const location = useLocation();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  const showNav = !['question'].some(p => location.pathname.includes(p));

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/question" element={<PageTransition><DailyQuestion /></PageTransition>} />
          <Route path="/challenges" element={<PageTransition><Challenges /></PageTransition>} />
          <Route path="/memories" element={<PageTransition><Memories /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <CoupleProvider>
      <Router>
        <div className="app-shell">
          <AppRoutes />
        </div>
      </Router>
    </CoupleProvider>
  );
}
