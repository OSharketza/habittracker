import React, { useMemo, useState } from 'react';
import Button from './Button';
import { useAccountability } from '../context/AccountabilityContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Send, Users } from 'lucide-react';

const reactionTemplates = {
  cheer: 'Sent a cheer for your progress.',
  nudge: 'Sent a gentle nudge to show up today.',
  done_with_you: 'Said: I am doing this with you.'
};

const HabitSupportManager = ({ habit }) => {
  const { user } = useAuth();
  const { schemaReady, lastError, getHabitSupport, sendInvite, sendReaction, profiles } = useAccountability();
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'supporter' });
  const [status, setStatus] = useState('');
  const support = getHabitSupport(habit.id);

  const members = useMemo(
    () =>
      support.members.map((member) => ({
        ...member,
        profile: profiles[member.user_id] || null
      })),
    [profiles, support.members]
  );

  const handleInvite = async (event) => {
    event.preventDefault();
    setStatus('');
    const ok = await sendInvite({
      habitId: habit.id,
      inviteeEmail: inviteForm.email,
      role: inviteForm.role
    });
    if (ok) {
      setInviteForm({ email: '', role: 'supporter' });
      setStatus('Invite sent.');
    }
  };

  const handleReaction = async (member, type) => {
    setStatus('');
    const ok = await sendReaction({
      habitId: habit.id,
      targetUserId: member.user_id,
      type,
      message: reactionTemplates[type]
    });
    if (ok) {
      setStatus('Support sent.');
    }
  };

  const acceptedMembers = members.filter((member) => member.user_id !== user?.id);

  return (
    <div className="glass-card" style={{ padding: '14px', display: 'grid', gap: '12px' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Habit support</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Invite support only for this habit. Friends can accept, decline, and cheer you on without seeing your other habits.
        </div>
      </div>

      {!schemaReady && (
        <div style={{ color: 'var(--accent-warning)', fontSize: '0.85rem', lineHeight: '1.5' }}>{lastError}</div>
      )}

      <form onSubmit={handleInvite} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: '8px' }}>
        <input
          type="email"
          placeholder="friend@email.com"
          value={inviteForm.email}
          onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))}
          style={inputStyle}
          disabled={!schemaReady}
        />
        <select
          value={inviteForm.role}
          onChange={(event) => setInviteForm((prev) => ({ ...prev, role: event.target.value }))}
          style={inputStyle}
          disabled={!schemaReady}
        >
          <option value="supporter">Support only</option>
          <option value="participant">Join me</option>
        </select>
        <Button type="submit" style={{ whiteSpace: 'nowrap' }} disabled={!schemaReady}>
          <Mail size={16} /> Invite
        </Button>
      </form>

      {status && <div style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>{status}</div>}

      {support.invites.length > 0 && (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Pending invites</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {support.invites
              .filter((invite) => invite.status === 'pending')
              .map((invite) => (
                <div key={invite.id} style={rowStyle}>
                  <div>
                    <div style={{ color: 'var(--text-primary)' }}>{invite.invitee_email}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{invite.role}</div>
                  </div>
                  <span style={pillStyle}>{invite.status}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {acceptedMembers.length > 0 && (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Active support</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {acceptedMembers.map((member) => (
              <div key={member.id} style={rowStyle}>
                <div>
                  <div style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="var(--accent-primary)" />
                    {member.profile?.displayName || 'Habit partner'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{member.role}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {Object.keys(reactionTemplates).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleReaction(member, type)}
                      style={actionButtonStyle}
                    >
                      <Send size={12} /> {type.replaceAll('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border-glass)',
  background: 'var(--bg-glass)',
  color: 'var(--text-primary)',
  outline: 'none'
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.03)'
};

const pillStyle = {
  padding: '4px 10px',
  borderRadius: '999px',
  background: 'rgba(124, 58, 237, 0.14)',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem'
};

const actionButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 8px',
  borderRadius: '999px',
  border: '1px solid var(--border-glass)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: '0.78rem'
};

export default HabitSupportManager;
