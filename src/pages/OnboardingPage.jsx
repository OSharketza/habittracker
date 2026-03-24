import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Sparkles, Activity, Calendar, PenTool, TrendingUp } from 'lucide-react';
import Button from '../components/Button';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const slides = [
        {
            title: "Welcome to HabitMaster",
            desc: "Your all-in-one tool to stay organized, manage tasks, and build strong habits.",
            icon: <Sparkles size={120} className="text-accent-primary" />,
            color: 'linear-gradient(135deg, #FF3D71 0%, #FF80AB 100%)'
        },
        {
            title: "Make Each Day Count",
            desc: "Every day, our AI Motivator prepares your list of activities. Stay on track with custom reminders.",
            icon: <Activity size={120} className="text-accent-warning" />,
            color: 'linear-gradient(135deg, #FF9100 0%, #FFAB40 100%)'
        },
        {
            title: "Start Building Your Routine",
            desc: "Add any activities you want to track. The Habit Architect skill helps you keep everything in order.",
            icon: <Calendar size={120} className="text-accent-success" />,
            color: 'linear-gradient(135deg, #00E676 0%, #69F0AE 100%)'
        },
        {
            title: "Customize Your Journey",
            desc: "Make HabitMaster fit your style, keep a daily journal, and discover a better you.",
            icon: <PenTool size={120} className="text-accent-info" />,
            color: 'linear-gradient(135deg, #00B0FF 0%, #40C4FF 100%)'
        },
        {
            title: "Stay Motivated",
            desc: "Keep your streaks alive, achieve your goals, and use AI insights to see how much you've improved.",
            icon: <TrendingUp size={120} className="text-accent-primary" />,
            color: 'linear-gradient(135deg, #651FFF 0%, #7C4DFF 100%)'
        }
    ];

    const handleNext = () => {
        if (page < slides.length - 1) {
            setPage(page + 1);
        } else {
            // After slides, go to actual setup or dashboard
            // For now, let's assume moving to dashboard or login
            navigate('/auth'); 
        }
    };

    const handleBack = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <div className="onboarding-container" style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '24px'
        }}>
            <div className="onboarding-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="icon-wrapper bounce" style={{ 
                    padding: '40px', 
                    borderRadius: '32px', 
                    background: slides[page].color,
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    {slides[page].icon}
                </div>
                
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '800' }}>{slides[page].title}</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '400px', lineHeight: '1.6' }}>{slides[page].desc}</p>
            </div>

            <div className="onboarding-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' }}>
                <Button variant="ghost" onClick={() => navigate('/auth')}>Skip</Button>
                
                <div className="dot-indicators" style={{ display: 'flex', gap: '8px' }}>
                    {slides.map((_, i) => (
                        <div key={i} style={{ 
                            width: page === i ? '24px' : '8px', 
                            height: '8px', 
                            borderRadius: '4px', 
                            background: page === i ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>

                <Button onClick={handleNext}>
                    {page === slides.length - 1 ? 'Got it!' : 'Next'}
                </Button>
            </div>

            <style>{`
                .onboarding-container {
                    overflow: hidden;
                }
                .bounce {
                    animation: bounce 2s infinite ease-in-out;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default OnboardingPage;
