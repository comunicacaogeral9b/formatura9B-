/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationProvider, useGraduation } from './context/GraduationContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Financial } from './components/Financial';
import { Events } from './components/Events';
import { Store } from './components/Store';
import { Navbar } from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { user } = useGraduation();
  const [currentTab, setCurrentTab] = useState('home');

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard setTab={setCurrentTab} />;
      case 'finance':
        return <Financial />;
      case 'events':
        return <Events />;
      case 'store':
        return <Store />;
      default:
        return <Dashboard setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-blue-50 min-h-screen shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      <Navbar currentTab={currentTab} setTab={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GraduationProvider>
        <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans antialiased">
          <AppContent />
        </div>
      </GraduationProvider>
    </ErrorBoundary>
  );
}
