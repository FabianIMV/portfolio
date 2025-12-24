'use client';
import { create } from 'zustand';

export type ViewMode = 'terminal' | 'dashboard';
export type IncidentState = 'none' | 'active' | 'investigating' | 'resolved';

interface IncidentData {
    type: 'latency' | 'pods' | 'db' | 'memory';
    severity: 'warning' | 'critical';
    message: string;
    startTime: number;
}

interface PortfolioState {
    // View mode
    mode: ViewMode;
    setMode: (mode: ViewMode) => void;
    toggleMode: () => void;

    // Incident simulation
    incidentState: IncidentState;
    currentIncident: IncidentData | null;
    incidentsResolved: number;
    triggerIncident: () => void;
    investigateIncident: () => void;
    resolveIncident: () => void;

    // Terminal state
    commandHistory: string[];
    addCommand: (cmd: string) => void;
    currentSection: string;
    setSection: (section: string) => void;

    // Live metrics
    latency: number;
    cpu: number;
    memory: number;
    health: number;
    updateMetrics: () => void;
}

const incidents: IncidentData[] = [
    { type: 'latency', severity: 'critical', message: '🔴 ALERT: API latency spike detected (p99 > 500ms)', startTime: 0 },
    { type: 'pods', severity: 'critical', message: '🔴 ALERT: Pod fabian-main-x7a2k CrashLoopBackOff', startTime: 0 },
    { type: 'db', severity: 'warning', message: '🟡 WARNING: PostgreSQL connection pool exhausted', startTime: 0 },
    { type: 'memory', severity: 'warning', message: '🟡 WARNING: Memory usage exceeding 85% threshold', startTime: 0 },
];

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    // Initial state
    mode: 'dashboard',
    incidentState: 'none',
    currentIncident: null,
    incidentsResolved: 0,
    commandHistory: [],
    currentSection: 'home',
    latency: 42,
    cpu: 23,
    memory: 67,
    health: 99.99,

    // Actions
    setMode: (mode) => set({ mode }),
    toggleMode: () => set((state) => ({ mode: state.mode === 'terminal' ? 'dashboard' : 'terminal' })),

    triggerIncident: () => {
        const incident = incidents[Math.floor(Math.random() * incidents.length)];
        set({
            incidentState: 'active',
            currentIncident: { ...incident, startTime: Date.now() },
            latency: incident.type === 'latency' ? 520 + Math.random() * 200 : get().latency,
            cpu: incident.type === 'memory' ? 85 + Math.random() * 10 : get().cpu,
        });
    },

    investigateIncident: () => set({ incidentState: 'investigating' }),

    resolveIncident: () => set((state) => ({
        incidentState: 'resolved',
        incidentsResolved: state.incidentsResolved + 1,
        latency: 35 + Math.random() * 15,
        cpu: 20 + Math.random() * 10,
    })),

    addCommand: (cmd) => set((state) => ({
        commandHistory: [...state.commandHistory.slice(-50), cmd]
    })),

    setSection: (section) => set({ currentSection: section }),

    updateMetrics: () => set((state) => ({
        latency: state.incidentState === 'active'
            ? state.latency + (Math.random() - 0.3) * 20
            : Math.max(30, state.latency + (Math.random() - 0.5) * 10),
        cpu: Math.max(15, Math.min(95, state.cpu + (Math.random() - 0.5) * 5)),
        memory: Math.max(50, Math.min(90, state.memory + (Math.random() - 0.5) * 3)),
        health: state.incidentState === 'active' ? 99.5 + Math.random() * 0.4 : 99.9 + Math.random() * 0.09,
    })),
}));
