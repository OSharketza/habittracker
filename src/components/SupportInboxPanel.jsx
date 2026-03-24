import React, { useMemo } from 'react';
import Card from './Card';
import Button from './Button';
import { useAccountability } from '../context/AccountabilityContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, HeartHandshake, MailX, Users } from 'lucide-react';

const SupportInboxPanel = () => {
  const { user } = useAuth();
  const {
    schemaReady,
    lastError,
    incomingInvites,
    members,
    habitsById,
    profiles,
    acceptInvite,
    declineInvite,
    sendReaction
  } = useAccountability();

  const mySupportMemberships = useMemo(
    () => members.filter((member) => member.user_id === user?.id),
    [members, user?.id]
  );

  if (!schemaReady) {
    return (
      <Card title="Support Inbox">
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{lastError}</div>
      </Card>
    );
  }

  return (
    <Card title="Support Inbox">
      <div style={{ display: 'grid', gap: '16px' }}>
        {incomingInvites.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No pending support invites.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {incomingInvites.map((invite) => {
              const habit = habitsById[invite.habit_id];
              const inviter = profiles[invite.inviter_user_id];
              return (
                <div key={invite.id} className="glass-card" style={{ padding: '12px', display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '700' }}>
                    <Bell size={15} color="var(--accent-primary)" />
                    {inviter?.displayName || 'A friend'} invited you to {invite.role === 'participant' ? 'join' : 'support'} "{habit?.name || 'a habit'}"
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Only this habit is shared with you. The rest of their habits remain private.
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button type="button" onClick={() => acceptInvite(invite.id)}>
                      <Check size={16} /> Accept
                    </Button>
                    <button type="button" onClick={() => declineInvite(invite.id)} style={secondaryButtonStyle}>
                      <MailX size={14} /> Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mySupportMemberships.length > 0 && (
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Habits you support</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {mySupportMemberships.map((member) => {
                const habit = habitsById[member.habit_id];
                const owner = profiles[member.invited_by_user_id];
                return (
                  <div key={member.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{habit?.name || 'Habit'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {member.role} for {owner?.displayName || 'your friend'}
                        </div>
                      </div>
                      <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} /> active
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() =>
                          sendReaction({
                            habitId: member.habit_id,
                            targetUserId: member.invited_by_user_id,
                            type: 'cheer',
                            message: 'Sent a cheer from your support circle.'
                          })
                        }
                        style={secondaryButtonStyle}
                      >
                        <HeartHandshake size={14} /> Cheer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          sendReaction({
                            habitId: member.habit_id,
                            targetUserId: member.invited_by_user_id,
                            type: 'done_with_you',
                            message: 'Said: I am in this with you.'
                          })
                        }
                        style={secondaryButtonStyle}
                      >
                        <HeartHandshake size={14} /> Doing it with you
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
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

export default SupportInboxPanel;
