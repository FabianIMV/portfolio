'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '@/store/portfolioStore';

function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);
    const { incidentState } = usePortfolioStore();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(3000 * 3);
        for (let i = 0; i < 3000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    const color = incidentState === 'active' ? '#ff5555' : incidentState === 'investigating' ? '#fbbf24' : '#4ade80';

    return (
        <Points ref={pointsRef} positions={particlesPosition} stride={3}>
            <PointMaterial
                transparent
                color={color}
                size={0.08}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function DataStreams() {
    const groupRef = useRef<THREE.Group>(null);

    // Create static line data
    const linesData = useMemo(() => {
        const data: THREE.Vector3[][] = [];
        for (let i = 0; i < 15; i++) {
            const points: THREE.Vector3[] = [];
            const startX = (Math.random() - 0.5) * 30;
            const startY = (Math.random() - 0.5) * 30;

            for (let j = 0; j < 30; j++) {
                points.push(new THREE.Vector3(
                    startX + Math.sin(j * 0.3) * 2,
                    startY + Math.cos(j * 0.2) * 2,
                    -25 + j
                ));
            }
            data.push(points);
        }
        return data;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {linesData.map((points, i) => (
                <mesh key={i}>
                    <tubeGeometry args={[
                        new THREE.CatmullRomCurve3(points),
                        30,
                        0.02,
                        8,
                        false
                    ]} />
                    <meshBasicMaterial color="#22d3ee" opacity={0.3} transparent />
                </mesh>
            ))}
        </group>
    );
}

function FloatingNodes() {
    const groupRef = useRef<THREE.Group>(null);
    const { incidentState } = usePortfolioStore();

    const nodes = useMemo(() => [
        { position: [8, 5, -10] as [number, number, number], color: '#4ade80', label: 'K8s' },
        { position: [-10, -3, -15] as [number, number, number], color: '#f97316', label: 'Datadog' },
        { position: [5, -8, -20] as [number, number, number], color: '#8b5cf6', label: 'Grafana' },
        { position: [-6, 8, -12] as [number, number, number], color: '#06b6d4', label: 'Prometheus' },
        { position: [12, 0, -18] as [number, number, number], color: '#ec4899', label: 'AWS' },
    ], []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((node, i) => {
                node.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
                node.rotation.y = state.clock.elapsedTime * 0.5;
                node.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.2;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <mesh key={i} position={node.position}>
                    <icosahedronGeometry args={[0.8, 1]} />
                    <meshBasicMaterial
                        color={incidentState === 'active' ? '#ff5555' : node.color}
                        wireframe
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

interface Scene3DProps {
    className?: string;
}

export default function Scene3D({ className = '' }: Scene3DProps) {
    return (
        <div className={`absolute inset-0 ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <ParticleField />
                <DataStreams />
                <FloatingNodes />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.3}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
}
