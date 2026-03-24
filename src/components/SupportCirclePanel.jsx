import React, { useMemo, useState } from 'react';
import Card from './Card';
import Button from './Button';
import { useAccountability } from '../context/AccountabilityContext';
import { useHabits } from '../context/HabitContext';
import { HeartHandshake, Send, Users } from 'lucide-react';

const startOfWeek = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const SupportCirclePanel = () => {
  const { enabled, groups, setEnabled, createGroup, sendSupport, linkHabitToGroup } = useAccountability();
  const { habits } = useHabits();
  const [form, setForm] = useState({
    name: '',
    members: '',
    weeklyGoal: 5
  });

  const habitMap = useMemo(() => Object.fromEntries(habits.map((habit) => [habit.id, habit])), [habits]);
  const weekStart = startOfWeek();

  const getWeeklyProgress = (group) =>
    group.habitIds.reduce((total, habitId) => {
      const habit = habitMap[habitId];
      if (!habit) return total;
      return total + (habit.completedDates || []).filter((date) => new Date(date) >= weekStart).length;
    }, 0);

  const handleCreate = (event) => {
    event.preventDefault();
    createGroup({
      name: form.name,
      members: form.members.split(',').map((member) => member.trim()),
      habitIds: [],
      weeklyGoal: form.weeklyGoal
    });
    setForm({ name: '', members: '', weeklyGoal: 5 });
  };

  return (
    <Card title="Support Circle">
      <div style={{ display: 'grid', gap: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enable small-group accountability</span>
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        </label>

        {!enabled ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Keep this off if you want habits to stay private. Turn it on when you want a buddy or a small group to support consistency.
          </div>
        ) : (
          <>
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '10px' }}>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Create a circle name"
                style={inputStyle}
              />
              <input
                type="text"
                value={form.members}
                onChange={(event) => setForm((prev) => ({ ...prev, members: event.target.value }))}
                placeholder="Members, comma separated"
                style={inputStyle}
              />
              <input
                type="number"
                min="1"
                max="50"
                value={form.weeklyGoal}
                onChange={(event) => setForm((prev) => ({ ...prev, weeklyGoal: event.target.value }))}
                placeholder="Weekly goal"
                style={inputStyle}
              />
              <Button type="submit">Create Circle</Button>
            </form>

            {groups.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No circles yet. Start with one accountability group of 2-6 people.
              </div>
            ) : (
              groups.map((group) => {
                const weeklyProgress = getWeeklyProgress(group);
                return (
                  <div key={group.id} className="glass-card" style={{ padding: '14px', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} color="var(--accent-primary)" /> {group.name}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {group.members.length ? group.members.join(', ') : 'Add members to start support'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800' }}>{weeklyProgress}/{group.weeklyGoal}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>weekly reps</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['cheer', 'nudge', 'done_with_you'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => sendSupport(group.id, type)}
                          style={secondaryButtonStyle}
                        >
                          <HeartHandshake size={14} /> {type.replaceAll('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Linked habits</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {habits.map((habit) => {
                          const linked = group.habitIds.includes(habit.id);
                          return (
                            <button
                              key={habit.id}
                              type="button"
                              onClick={() => linkHabitToGroup(group.id, habit.id)}
                              style={{
                                ...secondaryButtonStyle,
                                background: linked ? 'rgba(124, 58, 237, 0.18)' : 'rgba(255,255,255,0.04)',
                                color: linked ? 'var(--text-primary)' : 'var(--text-secondary)'
                              }}
                            >
                              {habit.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Recent activity</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {(group.activity || []).slice(0, 3).map((activity) => (
                          <div key={activity.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <Send size={12} color="var(--accent-info)" /> {activity.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </Card>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid var(--border-glass)',
  background: 'var(--bg-glass)',
  color: 'var(--text-primary)',
  outline: 'none'
};

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 10px',
  borderRadius: '999px',
  border: '1px solid var(--border-glass)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-secondary)',
  cursor: 'pointer'
};

export default SupportCirclePanel;
