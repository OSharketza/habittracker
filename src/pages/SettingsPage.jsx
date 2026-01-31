import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMessage('Password updated successfully!');
            setNewPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <h1 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Settings</h1>

            <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Account Security</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email</label>
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)'
                    }}>
                        {user?.email}
                    </div>
                </div>

                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={6}
                            placeholder="Enter new password"
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

                    <Button type="submit" disabled={loading} style={{ background: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
