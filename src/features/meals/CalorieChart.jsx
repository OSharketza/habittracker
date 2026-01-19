import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { extendedFoodDB } from '../../data/extendedFoodDB';
import Button from '../../components/Button';

const CalorieChart = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredData = useMemo(() => {
        return extendedFoodDB.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'All' ||
                (filter === 'Veg' && item.diet === 'vegetarian') ||
                (filter === 'Non-Veg' && item.diet === 'non vegetarian');
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filter]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '800px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>Calorie Reference Chart</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 36px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-glass)',
                                    background: 'var(--bg-glass)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['All', 'Veg', 'Non-Veg'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border-glass)',
                                        background: filter === f ? 'var(--accent-primary)' : 'var(--bg-glass)',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                        {filteredData.map((item, index) => (
                            <div key={index}
                                className="food-card"
                                onClick={() => onSelect(item)}
                                style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--border-glass)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: item.diet === 'vegetarian' ? '#4caf50' : '#f44336',
                                    border: '2px solid rgba(255,255,255,0.2)'
                                }} />
                                <h4 style={{ marginRight: '20px', marginBottom: '4px' }}>{item.name}</h4>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.category}</div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                                    <div style={{ color: 'var(--accent-warning)', fontWeight: 'bold' }}>{item.calories} kcal</div>
                                    <div style={{ textAlign: 'right' }}>P: {item.protein}g</div>
                                    <div>C: {item.carbs}g</div>
                                    <div style={{ textAlign: 'right' }}>F: {item.fat}g</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalorieChart;
