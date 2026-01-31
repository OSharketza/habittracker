
import React from 'react';
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

const InsightCard = ({ insight, suggestion, type }) => {
    if (!insight) return null;

    return (
        <div className="glass-panel fade-in" style={{
            marginBottom: 'var(--spacing-lg)',
            borderLeft: '4px solid var(--accent-primary)',
            background: 'linear-gradient(to right, rgba(124, 58, 237, 0.1), rgba(255, 255, 255, 0.05))'
        }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px',
                    borderRadius: '12px',
                    color: 'var(--accent-warning)'
                }}>
                    <Sparkles size={24} />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--accent-primary)',
                        marginBottom: '4px'
                    }}>
                        Smart Intelligence
                    </div>

                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        marginBottom: '8px',
                        color: 'var(--text-primary)'
                    }}>
                        {insight}
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(0,0,0,0.1)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        width: 'fit-content'
                    }}>
                        <Lightbulb size={16} />
                        <span>{suggestion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightCard;
