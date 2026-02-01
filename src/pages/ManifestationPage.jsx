import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Send, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ManifestationPage = () => {
    const { user } = useAuth();
    const [manifestation, setManifestation] = useState('');
    const [loading, setLoading] = useState(false);
    const [todayManifestation, setTodayManifestation] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            fetchManifestations();
        }
    }, [user]);

    const fetchManifestations = async () => {
        try {
            const { data, error } = await supabase
                .from('manifestations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setHistory(data || []);

            // Check if there's one for today
            const today = new Date().toDateString();
            const foundToday = data.find(m => new Date(m.created_at).toDateString() === today);
            setTodayManifestation(foundToday);

        } catch (error) {
            console.error('Error fetching manifestations:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!manifestation.trim()) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('manifestations')
                .insert([
                    { user_id: user.id, content: manifestation }
                ])
                .select();

            if (error) throw error;

            setManifestation('');
            fetchManifestations();
        } catch (error) {
            console.error('Error saving manifestation:', error);
            alert('Failed to save manifestation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in">
            <h1 style={{ marginBottom: '24px' }}>Daily Manifestation</h1>

            <div className="grid-responsive">
                <div style={{ flex: 1 }}>
                    <Card title="Today's Intention">
                        {todayManifestation ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div style={{
                                    background: 'var(--accent-success-transparent)',
                                    display: 'inline-flex',
                                    padding: '16px',
                                    borderRadius: '50%',
                                    color: 'var(--accent-success)',
                                    marginBottom: '16px'
                                }}>
                                    <CheckCircle size={48} />
                                </div>
                                <h3 style={{ marginBottom: '12px' }}>Manifestation Recorded!</h3>
                                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', opacity: 0.9 }}>
                                    "{todayManifestation.content}"
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                        What do you want to attract into your life today?
                                    </label>
                                    <textarea
                                        value={manifestation}
                                        onChange={(e) => setManifestation(e.target.value)}
                                        placeholder="I am capable, confident, and ready to achieve my goals..."
                                        rows={6}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            resize: 'vertical',
                                            fontSize: '1.1rem'
                                        }}
                                    />
                                </div>
                                <Button type="submit" disabled={loading || !manifestation.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                                    {loading ? 'Saving...' : 'Manifest It'} <Send size={18} style={{ marginLeft: '8px' }} />
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '16px' }}>Your Journal</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {history.length > 0 ? (
                            history.map((item) => (
                                <div key={item.id} className="glass-card" style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        <span>{format(new Date(item.created_at), 'PPP')}</span>
                                    </div>
                                    <p style={{ lineHeight: '1.5' }}>{item.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                                No manifestations yet. Start today!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManifestationPage;
