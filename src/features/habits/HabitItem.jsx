import React from 'react';
import { Check, Eye, Flame, Lock, Trash2, Users } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { calculateStreak, getLast7DaysStatus } from '../../utils/StreakUtils';
import { buildIdentityReflection } from '../../utils/identity';
import HabitSupportManager from '../../components/HabitSupportManager';

const visibilityConfig = {
  private: { label: 'Private', icon: Lock },
  buddy: { label: 'Buddy', icon: Eye },
  group: { label: 'Group', icon: Users }
};

const HabitItem = ({ habit }) => {
  const { toggleHabit, removeHabit } = useHabits();
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completedDates.includes(today);
  const streak = calculateStreak(habit.completedDates);
  const last7Days = getLast7DaysStatus(habit.completedDates);
  const reflection = buildIdentityReflection(habit);
  const visibility = visibilityConfig[habit.visibility] || visibilityConfig.private;
  const VisibilityIcon = visibility.icon;

  return (
    <div
      className="glass-card fade-in"
      style={{
        padding: '20px',
        marginBottom: '16px',
        border: isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
        background: isCompleted ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => toggleHabit(habit.id)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              border: isCompleted ? 'none' : '2px solid rgba(255,255,255,0.2)',
              background: isCompleted ? 'var(--accent-success)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {isCompleted && <Check size={20} color="white" />}
          </button>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{habit.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={badgeStyle}>{habit.category}</span>
              <span style={badgeStyle}>
                <VisibilityIcon size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {visibility.label}
              </span>
              {streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <Flame size={14} fill="#f59e0b" /> {streak} day streak
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => removeHabit(habit.id)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
          className="hover-danger"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            Identity Cue
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>{habit.identityLabel}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{reflection}</div>
          {habit.motivationNote && (
            <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{habit.motivationNote}</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>LAST 7 DAYS</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {last7Days.map((done, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: done ? 'var(--accent-success)' : 'rgba(255,255,255,0.05)',
                  border: done ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: done ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
                }}
                title={index === 6 ? 'Today' : `${6 - index} days ago`}
              />
            ))}
          </div>
        </div>
        {(habit.visibility === 'buddy' || habit.visibility === 'group') && <HabitSupportManager habit={habit} />}
      </div>
    </div>
  );
};

const badgeStyle = {
  fontSize: '0.75rem',
  padding: '2px 8px',
  borderRadius: '4px',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--text-muted)'
};

export default HabitItem;
