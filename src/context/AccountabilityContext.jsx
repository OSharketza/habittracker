/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const AccountabilityContext = createContext();

export const useAccountability = () => useContext(AccountabilityContext);

const SCHEMA_HINT = 'Run supabase/habit_support_schema.sql in your Supabase SQL editor to enable habit invites.';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getErrorMessage = (error) => {
  if (!error) return '';
  return error.message || 'Something went wrong.';
};

export const AccountabilityProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [schemaReady, setSchemaReady] = useState(true);
  const [invites, setInvites] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [habitsById, setHabitsById] = useState({});
  const [lastError, setLastError] = useState('');

  const fetchProfiles = useCallback(async (userIds) => {
    if (!userIds.length) return {};

    const uniqueIds = [...new Set(userIds.filter(Boolean))];
    if (!uniqueIds.length) return {};

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, username')
      .in('id', uniqueIds);

    if (error) {
      console.error('Error fetching support profiles:', error);
      return {};
    }

    return Object.fromEntries(
      (data || []).map((profile) => [
        profile.id,
        {
          displayName: profile.display_name || profile.username || 'Habit partner',
          username: profile.username || '',
          id: profile.id
        }
      ])
    );
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setInvites([]);
      setMembers([]);
      setEvents([]);
      setProfiles({});
      setHabitsById({});
      setLastError('');
      setSchemaReady(true);
      return;
    }

    setLoading(true);
    setLastError('');

    const email = normalizeEmail(user.email);

    const [invitesResult, membersResult, eventsResult] = await Promise.all([
      supabase
        .from('habit_support_invites')
        .select('*')
        .or(`inviter_user_id.eq.${user.id},invitee_email.eq.${email}`)
        .order('created_at', { ascending: false }),
      supabase
        .from('habit_support_members')
        .select('*')
        .or(`user_id.eq.${user.id},invited_by_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false }),
      supabase
        .from('habit_support_events')
        .select('*')
        .or(`actor_user_id.eq.${user.id},target_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(100)
    ]);

    const firstError = invitesResult.error || membersResult.error || eventsResult.error;

    if (firstError) {
      console.error('Error loading accountability data:', firstError);
      setSchemaReady(false);
      setLastError(`${getErrorMessage(firstError)} ${SCHEMA_HINT}`);
      setInvites([]);
      setMembers([]);
      setEvents([]);
      setProfiles({});
      setHabitsById({});
      setLoading(false);
      return;
    }

    setSchemaReady(true);
    setInvites(invitesResult.data || []);
    setMembers(membersResult.data || []);
    setEvents(eventsResult.data || []);

    const profileMap = await fetchProfiles([
      ...(invitesResult.data || []).map((invite) => invite.inviter_user_id),
      ...(membersResult.data || []).map((member) => member.user_id),
      ...(membersResult.data || []).map((member) => member.invited_by_user_id),
      ...(eventsResult.data || []).map((event) => event.actor_user_id),
      ...(eventsResult.data || []).map((event) => event.target_user_id)
    ]);
    setProfiles(profileMap);

    const habitIds = [
      ...(invitesResult.data || []).map((invite) => invite.habit_id),
      ...(membersResult.data || []).map((member) => member.habit_id),
      ...(eventsResult.data || []).map((event) => event.habit_id)
    ].filter(Boolean);

    if (habitIds.length) {
      const { data: habitRows, error: habitError } = await supabase
        .from('habits')
        .select('id, name, user_id, category')
        .in('id', [...new Set(habitIds)]);

      if (habitError) {
        console.error('Error fetching support habits:', habitError);
      } else {
        setHabitsById(
          Object.fromEntries(
            (habitRows || []).map((habit) => [
              habit.id,
              {
                id: habit.id,
                name: habit.name,
                ownerUserId: habit.user_id,
                category: habit.category || 'general'
              }
            ])
          )
        );
      }
    } else {
      setHabitsById({});
    }
    setLoading(false);
  }, [fetchProfiles, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const logEvent = useCallback(
    async ({ habitId, targetUserId = null, eventType, message, metadata = {} }) => {
      if (!user) return { error: new Error('User not authenticated') };

      const { error } = await supabase.from('habit_support_events').insert([
        {
          habit_id: habitId,
          actor_user_id: user.id,
          target_user_id: targetUserId,
          event_type: eventType,
          message,
          metadata
        }
      ]);

      if (error) {
        console.error('Error logging support event:', error);
        setLastError(getErrorMessage(error));
        return { error };
      }

      return { error: null };
    },
    [user]
  );

  const sendInvite = useCallback(
    async ({ habitId, inviteeEmail, role }) => {
      if (!user) return false;

      const email = normalizeEmail(inviteeEmail);
      if (!email) return false;

      const { error } = await supabase.from('habit_support_invites').insert([
        {
          habit_id: habitId,
          inviter_user_id: user.id,
          invitee_email: email,
          role
        }
      ]);

      if (error) {
        console.error('Error sending invite:', error);
        setLastError(`${getErrorMessage(error)} ${schemaReady ? '' : SCHEMA_HINT}`.trim());
        return false;
      }

      await logEvent({
        habitId,
        eventType: 'invite_sent',
        message: `Invitation sent to ${email}.`,
        metadata: { inviteeEmail: email, role }
      });
      await refresh();
      return true;
    },
    [logEvent, refresh, schemaReady, user]
  );

  const respondToInvite = useCallback(
    async (inviteId, status) => {
      if (!user) return false;

      const invite = invites.find((item) => item.id === inviteId);
      if (!invite) return false;

      const { error } = await supabase
        .from('habit_support_invites')
        .update({
          status,
          responded_at: new Date().toISOString()
        })
        .eq('id', inviteId);

      if (error) {
        console.error(`Error updating invite status to ${status}:`, error);
        setLastError(getErrorMessage(error));
        return false;
      }

      if (status === 'accepted') {
        const { error: memberError } = await supabase.from('habit_support_members').insert([
          {
            habit_id: invite.habit_id,
            user_id: user.id,
            invited_by_user_id: invite.inviter_user_id,
            role: invite.role
          }
        ]);

        if (memberError) {
          console.error('Error adding support member:', memberError);
          setLastError(getErrorMessage(memberError));
          return false;
        }
      }

      await logEvent({
        habitId: invite.habit_id,
        targetUserId: invite.inviter_user_id,
        eventType: status === 'accepted' ? 'invite_accepted' : 'invite_declined',
        message: status === 'accepted' ? 'Accepted the habit support invite.' : 'Declined the habit support invite.',
        metadata: { inviteId }
      });
      await refresh();
      return true;
    },
    [invites, logEvent, refresh, user]
  );

  const acceptInvite = useCallback((inviteId) => respondToInvite(inviteId, 'accepted'), [respondToInvite]);
  const declineInvite = useCallback((inviteId) => respondToInvite(inviteId, 'declined'), [respondToInvite]);

  const sendReaction = useCallback(
    async ({ habitId, targetUserId, type, message }) => {
      const result = await logEvent({
        habitId,
        targetUserId,
        eventType: type,
        message,
        metadata: {}
      });

      if (!result.error) {
        await refresh();
        return true;
      }

      return false;
    },
    [logEvent, refresh]
  );

  const getHabitSupport = useCallback(
    (habitId) => {
      const habitInvites = invites.filter((invite) => invite.habit_id === habitId);
      const habitMembers = members.filter((member) => member.habit_id === habitId);
      const habitEvents = events.filter((event) => event.habit_id === habitId).slice(0, 8);
      return {
        invites: habitInvites,
        members: habitMembers,
        events: habitEvents
      };
    },
    [events, invites, members]
  );

  const incomingInvites = useMemo(
    () =>
      invites.filter(
        (invite) =>
          invite.status === 'pending' &&
          normalizeEmail(invite.invitee_email) === normalizeEmail(user?.email)
      ),
    [invites, user?.email]
  );

  const value = {
    schemaReady,
    loading,
    invites,
    incomingInvites,
    members,
    events,
    profiles,
    lastError,
    refresh,
    sendInvite,
    acceptInvite,
    declineInvite,
    sendReaction,
    getHabitSupport,
    habitsById,
    clearError: () => setLastError('')
  };

  return <AccountabilityContext.Provider value={value}>{children}</AccountabilityContext.Provider>;
};
