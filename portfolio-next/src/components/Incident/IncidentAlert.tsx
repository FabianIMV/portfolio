'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/store/portfolioStore';

export default function IncidentAlert() {
    const { incidentState, currentIncident, resolveIncident, investigateIncident, incidentsResolved } = usePortfolioStore();
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (incidentState === 'active' || incidentState === 'investigating') {
            const interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setTimeElapsed(0);
        }
    }, [incidentState]);

    if (incidentState === 'none') return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
                {incidentState === 'resolved' ? (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-green-900/90 to-emerald-900/90 backdrop-blur-xl border border-green-500/50 rounded-2xl p-6 shadow-2xl shadow-green-500/20"
                    >
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="text-5xl"
                            >
                                🎉
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-green-400">Incident Resolved!</h3>
                                <p className="text-green-300/70 text-sm">MTTR: {formatTime(timeElapsed)}</p>
                                <p className="text-green-300/50 text-xs mt-1">
                                    Total incidents resolved: {incidentsResolved}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        animate={{
                            boxShadow: incidentState === 'active'
                                ? ['0 0 20px rgba(239,68,68,0.5)', '0 0 40px rgba(239,68,68,0.8)', '0 0 20px rgba(239,68,68,0.5)']
                                : '0 0 20px rgba(251,191,36,0.5)',
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`backdrop-blur-xl rounded-2xl p-6 border ${incidentState === 'active'
                            ? 'bg-gradient-to-r from-red-900/90 to-orange-900/90 border-red-500/50'
                            : 'bg-gradient-to-r from-yellow-900/90 to-amber-900/90 border-yellow-500/50'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="text-4xl"
                            >
                                🚨
                            </motion.div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className={`text-lg font-bold ${incidentState === 'active' ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {incidentState === 'active' ? 'INCIDENT DETECTED' : 'INVESTIGATING...'}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${currentIncident?.severity === 'critical'
                                        ? 'bg-red-500/30 text-red-300'
                                        : 'bg-yellow-500/30 text-yellow-300'
                                        }`}>
                                        {currentIncident?.severity?.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">{currentIncident?.message}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400 font-mono">
                                        Time: {formatTime(timeElapsed)}
                                    </span>
                                    {incidentState === 'active' && (
                                        <button
                                            onClick={investigateIncident}
                                            className="px-4 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm font-medium transition-all"
                                        >
                                            Investigate
                                        </button>
                                    )}
                                    <button
                                        onClick={resolveIncident}
                                        className="px-4 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 text-sm font-medium transition-all"
                                    >
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
