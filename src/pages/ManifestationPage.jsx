import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '../components/Button';
import Card from '../components/Card';
import { Sparkles, Send, History, Quote, Wind, Sun } from 'lucide-react';
import ReminderSettings from '../components/ReminderSettings';
import { useAgents } from '../agents/useAgents';

const ManifestationPage = () => {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [logs, setLogs] = useState([]);
    const [isZenMode, setIsZenMode] = useState(false);
    const agents = useAgents();

    useEffect(() => {
        if (!user) return;
        fetchLogs();
    }, [user]);

    const fetchLogs = async () => {
        const { data } = await supabase
            .from('manifestations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setLogs(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const { error } = await supabase.from('manifestations').insert([{ user_id: user.id, text }]);
        if (!error) {
            setText('');
            fetchLogs();
            setIsZenMode(false);
        }
    };

    if (isZenMode) {
        return (
            <div className="fade-in" style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'linear-gradient(225deg, #0f172a 0%, #1e1b4b 100%)', 
                zIndex: 3000, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '24px'
            }}>
                <button 
                    onClick={() => setIsZenMode(false)}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                >
                    Close Zen Mode
                </button>
                
                <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
                    <div className="breathing-circle" style={{ marginBottom: '40px' }}>
                        <Sun size={48} color="#c026d3" style={{ opacity: 0.8 }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '40px', letterSpacing: '0.05em' }}>What do you wish to create today?</h2>
                    
                    <textarea
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Speak it into existence..."
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            outline: 'none',
                            minHeight: '200px',
                            resize: 'none',
                            fontStyle: 'italic',
                            lineHeight: '1.6'
                        }}
                    />
                    
                    <div style={{ marginTop: '40px' }}>
                        <Button onClick={handleSubmit} size="lg" style={{ background: 'var(--gradient-primary)', padding: '16px 40px', borderRadius: '40px' }}>
                            Manifest <Sparkles size={18} style={{ marginLeft: '10px' }} />
                        </Button>
                    </div>
                </div>

                <style>{`
                    .breathing-circle {
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        background: rgba(192, 38, 211, 0.1);
                        display: flex;
                        align-items: center;
                        justifyContent: center;
                        animation: breathe 8s ease-in-out infinite;
                        margin: 0 auto;
                    }
                    @keyframes breathe {
                        0%, 100% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 20px rgba(192, 38, 211, 0.2); }
                        50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 60px rgba(192, 38, 211, 0.4); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="container fade-in">
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Intention & Vision</h1>
                    <p className="text-muted">Align your actions with your future self.</p>
                </div>
                <Button variant="secondary" onClick={() => setIsZenMode(true)} style={{ gap: '8px' }}>
                    <Wind size={18} /> Zen Mode
                </Button>
            </div>

            <div className="grid-auto">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Card style={{ padding: '32px', background: 'var(--gradient-dark)', border: '1px solid rgba(192, 38, 211, 0.2)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Quote size={20} color="#c026d3" /> Today's Affirmation
                        </h3>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="I am becoming the version of myself that..."
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '1.1rem',
                                minHeight: '120px',
                                marginBottom: '20px',
                                resize: 'none'
                            }}
                        />
                        <Button onClick={handleSubmit} style={{ width: '100%', padding: '16px' }}>
                            Log Intention <Send size={18} style={{ marginLeft: '10px' }} />
                        </Button>
                    </Card>

                    <div>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <History size={20} className="text-muted" /> Vision Archive
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {logs.map(log => (
                                <div key={log.id} className="glass-card fade-in" style={{ padding: '20px', borderLeft: '4px solid #c026d3' }}>
                                    <div style={{ fontStyle: 'italic', marginBottom: '8px', opacity: 0.9 }}>"{log.text}"</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Manifestation Mirror">
                        <div style={{ fontStyle: 'italic', color: 'var(--accent-info)', marginBottom: '8px' }}>
                            AI Reflection:
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {agents.insights.reflectOnManifestation ? agents.insights.reflectOnManifestation(logs[0]?.text) : "Your vision is clearing..."}
                        </p>
                    </Card>
                    <ReminderSettings module="manifestations" label="Intentions" />
                    <Card title="The Science of Intention">
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Writing your goals down increases the likelihood of achieving them by 42%. Visualizing the process, not just the result, is the elite key to neuroplasticity.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ManifestationPage;
