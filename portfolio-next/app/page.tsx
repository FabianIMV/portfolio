'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/portfolioStore';
import IncidentAlert from '@/components/Incident/IncidentAlert';

// Dynamically import Terminal (heavy component)
const Terminal = dynamic(() => import('@/components/Terminal/Terminal'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-green-400 font-mono animate-pulse">Loading Terminal...</div>
    </div>
  )
});

export default function Home() {
  const { incidentState, triggerIncident } = usePortfolioStore();

  // Easter egg: trigger incident with Ctrl+Shift+I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I' && incidentState === 'none') {
        e.preventDefault();
        triggerIncident();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerIncident, incidentState]);

  return (
    <main className="h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-cyan-900/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Incident Alert Overlay */}
      <IncidentAlert />

      {/* Back to Portfolio Button */}
      <motion.a
        href="../../"
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800/60 backdrop-blur-md border border-gray-600/30 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Portfolio
      </motion.a>

      {/* Terminal (Full Screen) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-screen p-4 pt-16 md:p-8 md:pt-16"
      >
        <Terminal className="h-full shadow-2xl shadow-cyan-500/10" />
      </motion.div>
    </main>
  );
}
