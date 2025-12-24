'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { profile, experience, skills, projects, certifications } from '@/data/profile';
import { usePortfolioStore } from '@/store/portfolioStore';
import { t, getLang, Lang } from '@/data/i18n';

// Color codes
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const MAGENTA = '\x1b[35m';
const WHITE = '\x1b[37m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

// ASCII Art Logo
const LOGO = `
  ███████╗ █████╗ ██████╗ ██╗ █████╗ ███╗   ██╗
  ██╔════╝██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║
  █████╗  ███████║██████╔╝██║███████║██╔██╗ ██║
  ██╔══╝  ██╔══██║██╔══██╗██║██╔══██║██║╚██╗██║
  ██║     ██║  ██║██████╔╝██║██║  ██║██║ ╚████║
  ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`;

interface TerminalProps {
    className?: string;
}

export default function Terminal({ className = '' }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const commandRef = useRef<string>('');
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const langRef = useRef<Lang>(getLang());

    const { addCommand, triggerIncident, incidentState, resolveIncident, investigateIncident } = usePortfolioStore();

    const getCareerDays = () => {
        const start = new Date(profile.careerStartDate);
        const now = new Date();
        return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    // Command implementations
    const commands: Record<string, (args: string[]) => string> = {
        help: () => {
            const lang = langRef.current;
            const cmds: [string, string, string][] = [
                ['whoami', t.commands.whoami.es, t.commands.whoami.en],
                ['neofetch', t.commands.neofetch.es, t.commands.neofetch.en],
                ['contact', t.commands.contact.es, t.commands.contact.en],
                ['ls', t.commands.ls.es, t.commands.ls.en],
                ['cat <file>', t.commands.cat.es, t.commands.cat.en],
                ['skills', t.commands.skills.es, t.commands.skills.en],
                ['projects', t.commands.projects.es, t.commands.projects.en],
                ['certs', t.commands.certs.es, t.commands.certs.en],
                ['kubectl', t.commands.kubectl.es, t.commands.kubectl.en],
                ['docker', t.commands.docker.es, t.commands.docker.en],
                ['incident', t.commands.incident.es, t.commands.incident.en],
                ['resolve', t.commands.resolve.es, t.commands.resolve.en],
                ['lang es|en', 'Cambiar idioma', 'Change language'],
                ['clear', t.commands.clear.es, t.commands.clear.en],
                ['matrix', t.commands.matrix.es, t.commands.matrix.en],
                ['exit', t.commands.exit.es, t.commands.exit.en],
            ];

            let output = `\n${CYAN}${BOLD}${t.availableCommands[lang]}${RESET}\n\n`;
            cmds.forEach(([cmd, descEs, descEn]) => {
                output += `  ${GREEN}${cmd.padEnd(14)}${RESET} ${DIM}${lang === 'es' ? descEs : descEn}${RESET}\n`;
            });
            output += `\n${DIM}${t.tip[lang]}${RESET}`;
            return output;
        },

        lang: (args) => {
            const newLang = args[0]?.toLowerCase();
            if (newLang === 'es' || newLang === 'en') {
                langRef.current = newLang;
                return newLang === 'es'
                    ? `${GREEN}✓ Idioma cambiado a Español${RESET}`
                    : `${GREEN}✓ Language changed to English${RESET}`;
            }
            return `${YELLOW}Usage: lang es|en${RESET}\n${DIM}Current: ${langRef.current}${RESET}`;
        },

        whoami: () => `
${CYAN}${BOLD}${profile.name}${RESET}
${WHITE}${profile.role}${RESET} @ ${GREEN}${profile.company}${RESET}
${DIM}📍 ${profile.location}${RESET}

${profile.bio.en}
`,

        neofetch: () => {
            const info = [
                `${CYAN}${BOLD}${profile.name}${RESET}`,
                `${DIM}${'─'.repeat(30)}${RESET}`,
                `${YELLOW}Role${RESET}:       ${profile.role}`,
                `${YELLOW}Company${RESET}:    ${profile.company}`,
                `${YELLOW}Location${RESET}:   ${profile.location}`,
                `${YELLOW}Career${RESET}:     ${getCareerDays()} days`,
                `${YELLOW}Uptime${RESET}:     99.99%`,
                ``,
                `${YELLOW}Languages${RESET}:  Python, JS, Bash, Go`,
                `${YELLOW}Cloud${RESET}:      AWS, GCP`,
                `${YELLOW}Containers${RESET}: Kubernetes, Docker`,
                `${YELLOW}Monitoring${RESET}: Datadog, Grafana, Prometheus`,
                ``,
                `${DIM}${'─'.repeat(30)}${RESET}`,
                `${RED}●${RESET} ${YELLOW}●${RESET} ${GREEN}●${RESET} ${CYAN}●${RESET} ${MAGENTA}●${RESET} ${WHITE}●${RESET}`,
            ];
            const logoLines = LOGO.split('\n');
            let output = '';
            for (let i = 0; i < Math.max(logoLines.length, info.length); i++) {
                const logo = logoLines[i] || '                                                ';
                const infoLine = info[i] || '';
                output += `${CYAN}${logo}${RESET}  ${infoLine}\n`;
            }
            return output;
        },

        ls: () => `
${CYAN}drwxr-xr-x${RESET}  fabian  ${GREEN}experience/${RESET}
${CYAN}drwxr-xr-x${RESET}  fabian  ${GREEN}projects/${RESET}
${CYAN}drwxr-xr-x${RESET}  fabian  ${GREEN}skills/${RESET}
${CYAN}drwxr-xr-x${RESET}  fabian  ${GREEN}certifications/${RESET}
${CYAN}-rw-r--r--${RESET}  fabian  ${WHITE}README.md${RESET}
${CYAN}-rw-r--r--${RESET}  fabian  ${WHITE}contact.txt${RESET}
`,

        cat: (args) => {
            const file = args[0]?.toLowerCase() || '';
            if (file === 'readme.md' || file === 'readme') {
                return `\n${CYAN}# ${profile.name}${RESET}\n\n${profile.bio.en}\n`;
            }
            if (file === 'contact.txt' || file === 'contact') {
                return commands.contact([]);
            }
            if (file.includes('experience')) {
                return commands.kubectl(['get', 'pods']);
            }
            if (file.includes('skills')) {
                return commands.skills([]);
            }
            if (file.includes('projects')) {
                return commands.projects([]);
            }
            if (file.includes('cert')) {
                return commands.certs([]);
            }
            return `${RED}cat: ${file}: No such file or directory${RESET}`;
        },

        kubectl: (args) => {
            const [action, resource] = args;
            if (action === 'get') {
                if (resource === 'pods' || resource === 'experience' || !resource) {
                    let output = `\n${WHITE}${BOLD}NAME                      NAMESPACE        STATUS       AGE${RESET}\n`;
                    experience.forEach(exp => {
                        const name = exp.company.toLowerCase().replace(/\s/g, '-').padEnd(26);
                        const ns = exp.namespace.padEnd(16);
                        let statusColor = GREEN;
                        if (exp.status === 'STABLE') statusColor = CYAN;
                        if (exp.status === 'LEGACY') statusColor = DIM;
                        const status = `${statusColor}${exp.status.padEnd(12)}${RESET}`;
                        output += `${name}${ns}${status}${exp.period.split(' - ')[0]}\n`;
                    });
                    return output;
                }
                if (resource === 'ns' || resource === 'namespaces') {
                    return `\n${WHITE}${BOLD}NAME              STATUS${RESET}\n` +
                        `${CYAN}banking${RESET}           Active\n` +
                        `${CYAN}consulting${RESET}        Active\n` +
                        `${DIM}startup${RESET}           Terminated\n`;
                }
                if (resource === 'svc' || resource === 'services') {
                    return `\n${WHITE}${BOLD}NAME               TYPE           CLUSTER-IP${RESET}\n` +
                        `observability      ClusterIP      10.0.0.42\n` +
                        `monitoring         LoadBalancer   10.0.0.100\n`;
                }
            }
            if (action === 'describe' && (resource === 'pod' || args[2]?.includes('fabian'))) {
                return commands.skills([]);
            }
            if (!action) {
                return `${YELLOW}Usage: kubectl [get|describe] [resource]${RESET}\n` +
                    `${DIM}Resources: pods, ns, svc${RESET}`;
            }
            return `${RED}error: unknown command "${action}"${RESET}`;
        },

        docker: (args) => {
            const [action] = args;
            if (action === 'ps' || !action) {
                return `\n${WHITE}${BOLD}CONTAINER ID   IMAGE                         STATUS${RESET}\n` +
                    `${DIM}a7f3x2b1c${RESET}      fabian/portfolio:latest       ${GREEN}Up 3 years${RESET}\n` +
                    `${DIM}k8s-monitor${RESET}    grafana/grafana:10.0          ${GREEN}Up 1 year${RESET}\n`;
            }
            if (action === 'images') {
                return `\n${WHITE}${BOLD}REPOSITORY              TAG        SIZE${RESET}\n` +
                    `datadog/agent           latest     850MB\n` +
                    `grafana/grafana         10.0       320MB\n` +
                    `prom/prometheus         v2.47      200MB\n`;
            }
            return `${YELLOW}Usage: docker [ps|images]${RESET}`;
        },

        skills: () => {
            let output = `\n${CYAN}${BOLD}Technical Skills${RESET}\n`;
            output += `${DIM}${'─'.repeat(50)}${RESET}\n\n`;

            output += `${YELLOW}Observability:${RESET}\n`;
            skills.observability.forEach(s => {
                const bar = '█'.repeat(Math.floor(s.level / 5)) + '░'.repeat(20 - Math.floor(s.level / 5));
                output += `  ${s.name.padEnd(14)} ${GREEN}${bar}${RESET} ${s.level}%\n`;
            });

            output += `\n${YELLOW}Cloud & Infrastructure:${RESET}\n`;
            skills.cloud.forEach(s => {
                const bar = '█'.repeat(Math.floor(s.level / 5)) + '░'.repeat(20 - Math.floor(s.level / 5));
                output += `  ${s.name.padEnd(14)} ${CYAN}${bar}${RESET} ${s.level}%\n`;
            });

            output += `\n${YELLOW}Development:${RESET}\n`;
            skills.development.forEach(s => {
                const bar = '█'.repeat(Math.floor(s.level / 5)) + '░'.repeat(20 - Math.floor(s.level / 5));
                output += `  ${s.name.padEnd(14)} ${MAGENTA}${bar}${RESET} ${s.level}%\n`;
            });

            return output;
        },

        projects: () => {
            let output = `\n${CYAN}${BOLD}Personal Projects${RESET}\n`;
            output += `${DIM}${'─'.repeat(50)}${RESET}\n\n`;
            projects.forEach(p => {
                output += `${GREEN}▸${RESET} ${BOLD}${p.name}${RESET} ${DIM}(${p.tech})${RESET}\n`;
                output += `  ${p.description}\n`;
                output += `  ${DIM}${p.url}${RESET}\n\n`;
            });
            return output;
        },

        certs: () => {
            let output = `\n${CYAN}${BOLD}Certifications${RESET}\n`;
            output += `${DIM}${'─'.repeat(50)}${RESET}\n\n`;
            certifications.forEach(c => {
                output += `  ${GREEN}✓${RESET} ${c}\n`;
            });
            return output + '\n';
        },

        contact: () => `
${CYAN}${BOLD}Contact Information${RESET}
${DIM}${'─'.repeat(40)}${RESET}

  ${GREEN}📧${RESET} Email:    ${profile.email}
  ${GREEN}💼${RESET} LinkedIn: ${profile.linkedin}
  ${GREEN}🐙${RESET} GitHub:   ${profile.github}
`,

        exit: () => {
            setTimeout(() => window.history.back(), 100);
            return `${GREEN}Returning to portfolio...${RESET}`;
        },

        clear: () => '\x1bc',

        matrix: () => `${GREEN}
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░█░█░█░█░▀█▀░█▀▀░▀█▀░█░█░▀█▀░█▀█░█▀▀░
  ░█▄█░█▀█░░█░░▀▀█░░█░░█▀█░░█░░█░█░▀▀█░
  ░▀░▀░▀░▀░▀▀▀░▀▀▀░░▀░░▀░▀░▀▀▀░▀░▀░▀▀▀░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
${RESET}
${DIM}Wake up, ${profile.name.split(' ')[0]}...${RESET}
${DIM}The SRE has you...${RESET}
${DIM}Follow the white rabbit. 🐰${RESET}
`,

        incident: () => {
            if (incidentState === 'active' || incidentState === 'investigating') {
                return `${YELLOW}Incident already active. Use 'investigate' or 'resolve'.${RESET}`;
            }
            setTimeout(() => triggerIncident(), 100);
            return `${RED}${BOLD}🚨 TRIGGERING INCIDENT SIMULATION...${RESET}`;
        },

        investigate: () => {
            if (incidentState !== 'active') {
                return `${YELLOW}No active incident to investigate.${RESET}`;
            }
            investigateIncident();
            return `${CYAN}Investigating incident...${RESET}\n${DIM}Analyzing logs, metrics, and traces...${RESET}`;
        },

        resolve: () => {
            if (incidentState !== 'active' && incidentState !== 'investigating') {
                return `${YELLOW}No active incident to resolve.${RESET}`;
            }
            setTimeout(() => resolveIncident(), 100);
            return `${GREEN}✅ Incident resolved! MTTR: ${Math.floor(Math.random() * 10 + 5)} minutes${RESET}`;
        },
    };

    const processCommand = useCallback((cmd: string): string => {
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0]?.toLowerCase() || '';
        const args = parts.slice(1);

        if (!command) return '';

        addCommand(cmd);
        historyRef.current.push(cmd);
        historyIndexRef.current = historyRef.current.length;

        if (commands[command]) {
            return commands[command](args);
        }

        return `${RED}Command not found: ${command}${RESET}\n${DIM}Type ${GREEN}help${RESET}${DIM} for available commands.${RESET}`;
    }, [addCommand, incidentState]);

    const writePrompt = useCallback(() => {
        if (xtermRef.current) {
            xtermRef.current.write(`\r\n${GREEN}fabian@sre${RESET}:${CYAN}~${RESET}$ `);
        }
    }, []);

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const term = new XTerm({
            convertEol: true, // Convert \n to \r\n automatically
            theme: {
                background: '#0a0a1a',
                foreground: '#e0e0e0',
                cursor: '#4ade80',
                cursorAccent: '#0a0a1a',
                selectionBackground: 'rgba(99, 102, 241, 0.3)',
                black: '#1a1a2e',
                red: '#ff5555',
                green: '#4ade80',
                yellow: '#fbbf24',
                blue: '#60a5fa',
                magenta: '#c084fc',
                cyan: '#22d3ee',
                white: '#e0e0e0',
                brightBlack: '#6b7280',
                brightRed: '#ff7777',
                brightGreen: '#86efac',
                brightYellow: '#fcd34d',
                brightBlue: '#93c5fd',
                brightMagenta: '#d8b4fe',
                brightCyan: '#67e8f9',
                brightWhite: '#ffffff',
            },
            fontFamily: '"Fira Code", "JetBrains Mono", Menlo, Monaco, monospace',
            fontSize: 14,
            lineHeight: 1.2,
            cursorBlink: true,
            cursorStyle: 'block',
            allowProposedApi: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);

        // Delay fit to ensure DOM is ready
        setTimeout(() => fitAddon.fit(), 100);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Welcome message
        const initLang = langRef.current;
        term.writeln('');
        term.writeln(`${CYAN}${LOGO}${RESET}`);
        term.writeln(`${WHITE}${BOLD}  ${t.welcome[initLang]}${RESET}`);
        term.writeln('');
        term.writeln(`  ${DIM}${t.helpTip[initLang].replace('help', `${GREEN}help${RESET}${DIM}`)}${RESET}`);
        term.writeln(`  ${DIM}${initLang === 'es' ? 'Cambiar idioma:' : 'Change language:'} ${GREEN}lang es${RESET}${DIM} | ${GREEN}lang en${RESET}`);
        writePrompt();

        // Handle input
        term.onKey(({ key, domEvent }) => {
            const char = domEvent.key;

            if (char === 'Enter') {
                const output = processCommand(commandRef.current);
                if (output) {
                    term.write('\r\n' + output);
                }
                commandRef.current = '';
                writePrompt();
            } else if (char === 'Backspace') {
                if (commandRef.current.length > 0) {
                    commandRef.current = commandRef.current.slice(0, -1);
                    term.write('\b \b');
                }
            } else if (char === 'ArrowUp') {
                if (historyRef.current.length > 0 && historyIndexRef.current > 0) {
                    historyIndexRef.current--;
                    const prevCmd = historyRef.current[historyIndexRef.current];
                    term.write('\r\x1b[K');
                    term.write(`${GREEN}fabian@sre${RESET}:${CYAN}~${RESET}$ ${prevCmd}`);
                    commandRef.current = prevCmd;
                }
            } else if (char === 'ArrowDown') {
                if (historyIndexRef.current < historyRef.current.length - 1) {
                    historyIndexRef.current++;
                    const nextCmd = historyRef.current[historyIndexRef.current];
                    term.write('\r\x1b[K');
                    term.write(`${GREEN}fabian@sre${RESET}:${CYAN}~${RESET}$ ${nextCmd}`);
                    commandRef.current = nextCmd;
                } else {
                    historyIndexRef.current = historyRef.current.length;
                    term.write('\r\x1b[K');
                    term.write(`${GREEN}fabian@sre${RESET}:${CYAN}~${RESET}$ `);
                    commandRef.current = '';
                }
            } else if (char === 'Tab') {
                domEvent.preventDefault();
                const partial = commandRef.current.toLowerCase();
                const matches = Object.keys(commands).filter(c => c.startsWith(partial));
                if (matches.length === 1) {
                    const remaining = matches[0].slice(partial.length);
                    commandRef.current += remaining;
                    term.write(remaining);
                } else if (matches.length > 1) {
                    term.write('\r\n' + matches.join('  '));
                    writePrompt();
                    term.write(commandRef.current);
                }
            } else if (!domEvent.ctrlKey && !domEvent.altKey && !domEvent.metaKey && key.length === 1) {
                commandRef.current += key;
                term.write(key);
            } else if (domEvent.ctrlKey && char === 'c') {
                commandRef.current = '';
                term.write('^C');
                writePrompt();
            } else if (domEvent.ctrlKey && char === 'l') {
                term.clear();
                writePrompt();
            }
        });

        // Handle resize
        const handleResize = () => {
            setTimeout(() => fitAddon.fit(), 100);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
            xtermRef.current = null;
        };
    }, [processCommand, writePrompt]);

    return (
        <div className={`h-full w-full bg-[#0a0a1a] rounded-lg overflow-hidden border border-gray-700/30 ${className}`}>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1a1a2e] to-[#0f0f23] border-b border-gray-700/30">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" onClick={() => window.history.back()} />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-400 ml-2 font-mono">fabian@sre-portfolio ~ terminal</span>
            </div>
            <div ref={terminalRef} className="h-[calc(100%-40px)] p-2" />
        </div>
    );
}
