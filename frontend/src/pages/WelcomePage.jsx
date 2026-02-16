import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
    const navigate = useNavigate();
    const [balloons, setBalloons] = useState([]);

    useEffect(() => {
        const initialBalloons = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
            color: ['#ff6b6b', '#d400ffff', '#45b7d1', '#f8f8f8ff', '#a855f7', '#65b241ff'][Math.floor(Math.random() * 6)]
        }));
        setBalloons(initialBalloons);

        const interval = setInterval(() => {
            const newBalloon = {
                id: Date.now(),
                left: Math.random() * 100,
                delay: 0,
                duration: 8 + Math.random() * 4,
                color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ff0073ff', '#a855f7', '#38bdf8'][Math.floor(Math.random() * 6)]
            };
            setBalloons(prev => [...prev.slice(-7), newBalloon]);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const handleRoleSelect = (role) => {
        navigate('/login', { state: { role } });
    };

    const popBalloon = (id) => {
        setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {balloons.map((balloon) => (
                <div
                    key={balloon.id}
                    onClick={() => popBalloon(balloon.id)}
                    style={{
                        position: 'absolute',
                        left: `${balloon.left}%`,
                        bottom: '-60px',
                        width: '35px',
                        height: '45px',
                        cursor: 'pointer',
                        animation: `float ${balloon.duration}s ease-in ${balloon.delay}s infinite`,
                        zIndex: 1
                    }}
                >
                    <div style={{
                        width: '35px',
                        height: '45px',
                        background: balloon.color,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        position: 'relative',
                        boxShadow: `inset -5px -5px 10px rgba(0,0,0,0.2), 0 0 15px ${balloon.color}50`,
                        transition: 'transform 0.1s ease'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '10px',
                            width: '12px',
                            height: '12px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '50%'
                        }}></div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-15px',
                        left: '50%',
                        width: '1px',
                        height: '15px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateX(-50%)'
                    }}></div>
                </div>
            ))}

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="animate-fade-in">
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        EventOS
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        marginBottom: '4rem',
                        lineHeight: 1.6
                    }}>
                        La plataforma integral para la gestión y participación en eventos exclusivos.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => handleRoleSelect('participante')}
                            className="role-card"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.98)',
                                borderRadius: '1.5rem',
                                padding: '2.5rem',
                                width: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{
                                background: 'rgba(56, 189, 248, 0.1)',
                                padding: '1rem',
                                borderRadius: '1rem',
                                marginBottom: '1.5rem',
                                color: '#38bdf8'
                            }}>
                                <Users size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>Participante</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5, textAlign: 'center' }}>
                                Explora eventos disponibles, inscríbete y gestiona tu agenda personal.
                            </p>
                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#38bdf8',
                                fontWeight: 500
                            }}>
                                Ingresar <ArrowRight size={18} />
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('empleado')}
                            className="role-card"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 1)',
                                borderRadius: '1.5rem',
                                padding: '2.5rem',
                                width: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{
                                background: 'rgba(168, 85, 247, 0.1)',
                                padding: '1rem',
                                borderRadius: '1rem',
                                marginBottom: '1.5rem',
                                color: '#a855f7'
                            }}>
                                <Briefcase size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>Organizador</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5, textAlign: 'center' }}>
                                Crea eventos, administra salas y gestiona la lista de asistentes.
                            </p>
                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#a855f7',
                                fontWeight: 500
                            }}>
                                Administrar <ArrowRight size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <footer style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.875rem',
                position: 'relative',
                zIndex: 2
            }}>
                &copy; 2026 EventOS. Todos los derechos reservados.
            </footer>

            <style>{`
                .role-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }

                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(20px) rotate(15deg);
                        opacity: 0;
                    }
                }

                div[style*="cursor: pointer"]:hover > div {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}