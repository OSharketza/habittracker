import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/Button';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%',
            padding: '20px'
        }}>
            <div className="glass-panel fade-in" style={{
                padding: '2rem',
                maxWidth: '400px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Set New Password</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter your new password below.</p>
                </div>

                {message && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--accent-success)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--accent-danger)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-glass)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--accent-primary)' }}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
