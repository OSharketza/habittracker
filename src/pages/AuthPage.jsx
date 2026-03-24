import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [view, setView] = useState('login'); // login, signup, reset
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        console.log(`[AuthPage] Submitting ${view} request for ${email}...`);

        try {
            if (view === 'reset') {
                console.log("[AuthPage] Calling resetPassword...");
                const { error } = await resetPassword(email);
                if (error) throw error;
                setMessage('Check your email for the password reset link.');
                console.log("[AuthPage] Reset email successfully requested.");
            } else if (view === 'login') {
                console.log("[AuthPage] Calling signIn...");
                const { error } = await signIn({ email, password });
                if (error) throw error;
                console.log("[AuthPage] Sign in API call successful. Should navigate soon...");
                navigate('/');
            } else {
                console.log("[AuthPage] Calling signUp...");
                const { error } = await signUp({ email, password });
                if (error) throw error;
                setMessage('Registration successful! Check your email for verification.');
                console.log("[AuthPage] Sign up API call successful.");
            }
        } catch (err) {
            console.error(`[AuthPage] ${view} failure:`, err.message);
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
                    <h1 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>HabiTrack</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {view === 'login' && 'Welcome back!'}
                        {view === 'signup' && 'Create your account'}
                        {view === 'reset' && 'Reset your password'}
                    </p>
                </div>

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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    {view !== 'reset' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    )}

                    {view === 'login' && (
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="button"
                                onClick={() => { setView('reset'); setError(''); setMessage(''); }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: 'var(--gradient-main)',
                            color: 'white',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? 'Processing...' : (
                            view === 'login' ? 'Sign In' : (
                                view === 'signup' ? 'Sign Up' : 'Send Reset Link'
                            )
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {view === 'reset' ? (
                        <button
                            type="button"
                            onClick={() => { setView('login'); setError(''); setMessage(''); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-info)', cursor: 'pointer' }}
                        >
                            Back to Login
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent-info)',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
