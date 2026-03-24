import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import Button from '../../components/Button';
import { Plus, Sparkles } from 'lucide-react';
import { IDENTITY_SUGGESTIONS, suggestIdentityFromHabit } from '../../utils/identity';

const AddHabit = () => {
  const [form, setForm] = useState({
    name: '',
    category: 'general',
    identityLabel: '',
    motivationNote: '',
    visibility: 'private'
  });
  const { addHabit } = useHabits();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    addHabit(form.name.trim(), form.category, {
      identityLabel: form.identityLabel.trim() || suggestIdentityFromHabit(form.name),
      motivationNote: form.motivationNote.trim(),
      visibility: form.visibility
    });

    setForm({
      name: '',
      category: 'general',
      identityLabel: '',
      motivationNote: '',
      visibility: 'private'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '20px', display: 'grid', gap: '12px' }}>
      <div>
        <h3 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} color="var(--accent-primary)" /> Build a Habit Identity
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Tie the habit to who you want to become so each check-in reinforces your self-image.
        </p>
      </div>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Habit name, e.g. Read 10 pages"
        style={inputStyle}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
          <option value="general">General</option>
          <option value="health">Health</option>
          <option value="fitness">Fitness</option>
          <option value="mindset">Mindset</option>
          <option value="learning">Learning</option>
          <option value="work">Work</option>
        </select>
        <select name="visibility" value={form.visibility} onChange={handleChange} style={inputStyle}>
          <option value="private">Private</option>
          <option value="buddy">Buddy only</option>
          <option value="group">Group visible</option>
        </select>
      </div>

      <div className="glass-card" style={{ padding: '14px', borderRadius: '12px' }}>
        <label style={labelStyle}>Identity Cue</label>
        <input
          type="text"
          name="identityLabel"
          value={form.identityLabel}
          onChange={handleChange}
          placeholder="I am a reader"
          style={{ ...inputStyle, marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {IDENTITY_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, identityLabel: suggestion }))}
              style={{
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid var(--border-glass)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Supportive Note</label>
        <textarea
          name="motivationNote"
          value={form.motivationNote}
          onChange={handleChange}
          rows={3}
          placeholder="Optional reminder for hard days"
          style={{ ...inputStyle, resize: 'vertical', borderRadius: '16px' }}
        />
      </div>

      <div className="glass-card" style={{ padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <Sparkles size={18} color="var(--accent-warning)" style={{ marginTop: '2px' }} />
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {form.identityLabel || 'Choose an identity cue'}
          <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Example reflection: You're becoming the kind of person who shows up even when motivation is low.
          </div>
        </div>
      </div>

      <Button type="submit" style={{ width: '100%' }}>
        Add Identity Habit
      </Button>
    </form>
  );
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 'var(--radius-full)',
  padding: '12px 16px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '0.95rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem'
};

export default AddHabit;
