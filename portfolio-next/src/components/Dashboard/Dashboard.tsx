'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/portfolioStore';
import { profile, experience, skills, projects } from '@/data/profile';

function MetricCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 hover:border-gray-600/50 transition-all">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color }}>
                {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
                <span className="text-sm text-gray-400 ml-1">{unit}</span>
            </p>
        </div>
    );
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
    return (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{name}</span>
                <span style={{ color }}>{level}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { latency, cpu, memory, health, updateMetrics, incidentState, setMode, triggerIncident } = usePortfolioStore();
    const [time, setTime] = useState('--:--:--');
    const [careerDays, setCareerDays] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(updateMetrics, 2000);
        return () => clearInterval(interval);
    }, [updateMetrics]);

    useEffect(() => {
        const start = new Date(profile.careerStartDate);
        const now = new Date();
        setCareerDays(Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen p-4 md:p-8 relative z-10"
        >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        SRE Control Center
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">System Operations Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 text-xs text-gray-400 font-mono">
                        <span>TIME: {time}</span>
                        <span>ZONE: America/Santiago</span>
                    </div>
                    <button
                        onClick={() => setMode('terminal')}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg text-sm font-mono text-gray-300 transition-all flex items-center gap-2"
                    >
                        <span className="text-green-400">$</span> Terminal
                    </button>
                </div>
            </motion.header>

            {/* Status Bar */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 p-3 rounded-lg bg-black/30 border border-gray-700/30">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${incidentState === 'active' ? 'bg-red-500/20 text-red-400' :
                        incidentState === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${incidentState === 'active' ? 'bg-red-500 animate-pulse' :
                            incidentState === 'investigating' ? 'bg-yellow-500 animate-pulse' :
                                'bg-green-500'
                        }`} />
                    {incidentState === 'active' ? 'INCIDENT ACTIVE' :
                        incidentState === 'investigating' ? 'INVESTIGATING' :
                            'ALL SYSTEMS NOMINAL'}
                </div>
                <span className="text-gray-500 text-xs">|</span>
                <span className="text-gray-400 text-xs">UPTIME: {careerDays}d</span>
                <span className="text-gray-500 text-xs">|</span>
                <span className="text-gray-400 text-xs">NODE: sre-portfolio-01</span>
                <button
                    onClick={triggerIncident}
                    className="ml-auto px-3 py-1 text-xs text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/50 rounded transition-all"
                >
                    🚨 Simulate Incident
                </button>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Profile Card */}
                <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-green-400 font-mono text-sm">SRE.profile</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">ACTIVE</span>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold">
                                FM
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                            <p className="text-cyan-400 font-medium">{profile.role}</p>
                            <p className="text-gray-400 text-sm mt-1">📍 {profile.location}</p>
                            <div className="flex gap-3 mt-4">
                                <a href={profile.github} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </a>
                                <a href={profile.linkedin} target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                                <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-300 mt-6 leading-relaxed">{profile.bio.en}</p>
                </motion.div>

                {/* Metrics */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
                    <h3 className="text-sm text-gray-400 font-mono mb-4">LIVE.metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard label="Latency" value={Math.round(latency)} unit="ms" color={latency > 100 ? '#ef4444' : '#4ade80'} />
                        <MetricCard label="CPU" value={Math.round(cpu)} unit="%" color={cpu > 80 ? '#f59e0b' : '#22d3ee'} />
                        <MetricCard label="Memory" value={Math.round(memory)} unit="%" color={memory > 85 ? '#ef4444' : '#8b5cf6'} />
                        <MetricCard label="Health" value={health} unit="%" color="#4ade80" />
                    </div>
                </motion.div>

                {/* Career Stats */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
                    <h3 className="text-sm text-gray-400 font-mono mb-4">CAREER.stats</h3>
                    <div className="text-center">
                        <p className="text-5xl font-bold text-cyan-400 font-mono">{careerDays}</p>
                        <p className="text-gray-400 text-sm mt-2">Days in SRE</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-700/30">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">SLA Commitment</span>
                            <span className="text-green-400 font-mono">99.99%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Experience */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
                    <h3 className="text-sm text-gray-400 font-mono mb-4">DEPLOYMENT.history</h3>
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${exp.status === 'ACTIVE' ? 'border-green-500/30 bg-green-500/5' :
                                    exp.status === 'STABLE' ? 'border-cyan-500/30 bg-cyan-500/5' :
                                        'border-gray-700/30 bg-gray-800/20'
                                }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${exp.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                                                exp.status === 'STABLE' ? 'bg-cyan-500/20 text-cyan-400' :
                                                    'bg-gray-600/20 text-gray-400'
                                            }`}>
                                            [{exp.status}] {exp.version}
                                        </span>
                                        <span className="text-gray-300 ml-2">→ {exp.company}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs">{exp.period}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{exp.description.en}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {exp.tags.slice(0, 5).map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-700/30 text-gray-300 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Skills */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
                    <h3 className="text-sm text-gray-400 font-mono mb-4">SYSTEM.resources</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-cyan-400 text-sm font-medium mb-3">Observability</h4>
                            {skills.observability.slice(0, 4).map(skill => (
                                <SkillBar key={skill.name} {...skill} color="#4ade80" />
                            ))}
                        </div>
                        <div>
                            <h4 className="text-purple-400 text-sm font-medium mb-3">Cloud & Infra</h4>
                            {skills.cloud.map(skill => (
                                <SkillBar key={skill.name} {...skill} color="#8b5cf6" />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Projects */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
                    <h3 className="text-sm text-gray-400 font-mono mb-4">ACTIVE.services</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {projects.map((project, i) => (
                            <a
                                key={i}
                                href={project.url}
                                target="_blank"
                                className="p-3 bg-black/30 hover:bg-black/50 border border-gray-700/30 hover:border-cyan-500/30 rounded-xl transition-all group"
                            >
                                <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{project.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{project.tech}</p>
                            </a>
                        ))}
                    </div>
                    <a
                        href="https://github.com/FabianIMV?tab=repositories"
                        target="_blank"
                        className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        View all projects →
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
}
