import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate('/login', { state: { role } });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
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
                        {/* Participant Card */}
                        <button
                            onClick={() => handleRoleSelect('participante')}
                            className="role-card"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
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
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
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
                fontSize: '0.875rem'
            }}>
                &copy; 2026 EventOS. Todos los derechos reservados.
            </footer>

            <style>{`
        .role-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
        </div>
    );
}
