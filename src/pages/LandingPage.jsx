import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Shield, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [visitCount, setVisitCount] = useState(0);

    useEffect(() => {
        const logVisit = async () => {
            // Log visit
            await supabase.from('page_visits').insert([{ page_path: '/' }]);

            // Fetch count
            const { count } = await supabase
                .from('page_visits')
                .select('*', { count: 'exact', head: true });

            setVisitCount(count || 0);
        };

        logVisit();

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            overflowX: 'hidden'
        }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: '24px 48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: scrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                transition: 'all 0.3s ease',
                zIndex: 50,
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    HabiTrack
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '999px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(4px)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <section style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 24px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Visitor Count Badge */}
                <div style={{
                    zIndex: 2,
                    marginBottom: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    <Users size={16} color="#60a5fa" />
                    <span>Join {visitCount.toLocaleString()} visitors building better habits</span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(3rem, 5vw, 5rem)',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    maxWidth: '800px',
                    zIndex: 1
                }}>
                    Master Your Day <br />
                    <span style={{ background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        One Habit at a Time.
                    </span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: '#94a3b8',
                    marginBottom: '48px',
                    maxWidth: '500px',
                    lineHeight: '1.6',
                    zIndex: 1
                }}>
                    Build potential through consistency. Track your habits, analyze your progress, and become the best version of yourself.
                </p>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'white',
                        color: '#0f172a',
                        padding: '16px 48px',
                        borderRadius: '999px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                        zIndex: 1
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
                    }}
                >
                    Start Journey <ArrowRight size={20} />
                </button>

                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    animation: 'bounce 2s infinite',
                    opacity: 0.5
                }}>
                    <p style={{ fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll to Explore</p>
                </div>
            </section>

            {/* Features / Benefits Section */}
            <section style={{
                padding: '120px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '80px', textAlign: 'center' }}>Why HabiTrack?</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    maxWidth: '1200px',
                    width: '100%'
                }}>
                    <BenefitCard
                        icon={<CheckCircle2 size={32} color="#60a5fa" />}
                        title="Track Simply"
                        description="Log your daily habits with a single click. No clutter, just progress."
                    />
                    <BenefitCard
                        icon={<TrendingUp size={32} color="#a855f7" />}
                        title="Analyze Growth"
                        description="Visualize your streaks and consistency with beautiful, intuitive charts."
                    />
                    <BenefitCard
                        icon={<Shield size={32} color="#f472b6" />}
                        title="Stay Accountable"
                        description="Set goals and reminders to keep yourself on track, every single day."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '0.9rem'
            }}>
                <p>Made by 1factlab</p>
            </footer>

            <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>
        </div>
    );
};

const BenefitCard = ({ icon, title, description }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '40px',
        borderRadius: '24px',
        transition: 'transform 0.3s ease',
        cursor: 'default'
    }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>{title}</h3>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{description}</p>
    </div>
);

export default LandingPage;
