/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';
import { buildIdentityReflection, getWeeklyIdentitySummary, suggestIdentityFromHabit } from '../utils/identity';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

const readMetadata = (userId) => {
  if (!userId) return {};

  try {
    return JSON.parse(localStorage.getItem(`habitMetadata:${userId}`) || '{}');
  } catch (error) {
    console.error('Error reading habit metadata:', error);
    return {};
  }
};

const writeMetadata = (userId, metadata) => {
  if (!userId) return;
  localStorage.setItem(`habitMetadata:${userId}`, JSON.stringify(metadata));
};

const mergeHabitsWithMetadata = (habitsData, completionsData, metadata) =>
  habitsData.map((habit) => {
    const completedDates = (completionsData || [])
      .filter((completion) => completion.habit_id === habit.id)
      .map((completion) => completion.date);
    const localMeta = metadata[habit.id] || {};

    return {
      ...habit,
      completedDates,
      identityLabel: localMeta.identityLabel || suggestIdentityFromHabit(habit.name),
      motivationNote: localMeta.motivationNote || '',
      visibility: localMeta.visibility || 'private'
    };
  });

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setMetadata({});
      return;
    }

    const localMetadata = readMetadata(user.id);
    setMetadata(localMetadata);

    const fetchHabits = async () => {
      setLoading(true);
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (habitsError) {
        console.error('Error fetching habits:', habitsError);
        setLoading(false);
        return;
      }

      const habitIds = habitsData.map((habit) => habit.id);
      if (habitIds.length === 0) {
        setHabits([]);
        setLoading(false);
        return;
      }

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .in('habit_id', habitIds);

      if (completionsError) {
        console.error('Error fetching completions:', completionsError);
      }

      setHabits(mergeHabitsWithMetadata(habitsData, completionsData || [], localMetadata));
      setLoading(false);
    };

    fetchHabits();
  }, [user]);

  const persistMetadata = (nextMetadata) => {
    setMetadata(nextMetadata);
    writeMetadata(user?.id, nextMetadata);
    setHabits((prev) =>
      prev.map((habit) => ({
        ...habit,
        identityLabel: nextMetadata[habit.id]?.identityLabel || habit.identityLabel || suggestIdentityFromHabit(habit.name),
        motivationNote: nextMetadata[habit.id]?.motivationNote || '',
        visibility: nextMetadata[habit.id]?.visibility || habit.visibility || 'private'
      }))
    );
  };

  const addHabit = async (name, category = 'general', options = {}) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert([{ user_id: user.id, name, category }])
      .select()
      .single();

    if (error) {
      console.error('Error adding habit:', error);
      return;
    }

    const nextMetadata = {
      ...metadata,
      [data.id]: {
        identityLabel: options.identityLabel || suggestIdentityFromHabit(name),
        motivationNote: options.motivationNote || '',
        visibility: options.visibility || 'private'
      }
    };

    persistMetadata(nextMetadata);

    setHabits((prev) => [
      ...prev,
      {
        ...data,
        completedDates: [],
        identityLabel: nextMetadata[data.id].identityLabel,
        motivationNote: nextMetadata[data.id].motivationNote,
        visibility: nextMetadata[data.id].visibility
      }
    ]);
  };

  const removeHabit = async (id) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing habit:', error);
      return;
    }

    const nextMetadata = { ...metadata };
    delete nextMetadata[id];
    persistMetadata(nextMetadata);
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const updateHabitIdentity = (id, updates) => {
    const nextMetadata = {
      ...metadata,
      [id]: {
        ...(metadata[id] || {}),
        ...updates
      }
    };

    persistMetadata(nextMetadata);
  };

  const toggleHabit = async (id, date = new Date().toISOString().split('T')[0]) => {
    const habitIndex = habits.findIndex((habit) => habit.id === id);
    if (habitIndex === -1) return;

    const habit = habits[habitIndex];
    const isCompleted = habit.completedDates.includes(date);

    setHabits((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          completedDates: isCompleted
            ? item.completedDates.filter((completedDate) => completedDate !== date)
            : [...item.completedDates, date]
        };
      })
    );

    if (isCompleted) {
      const { error } = await supabase.from('habit_completions').delete().match({ habit_id: id, date });
      if (error) console.error('Error uncompleting habit:', error);
    } else {
      const { error } = await supabase
        .from('habit_completions')
        .insert([{ habit_id: id, date, user_id: user.id }]);
      if (error) console.error('Error completing habit:', error);
    }
  };

  const getTodayProgress = () => {
    if (habits.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const completedCount = habits.filter((habit) => habit.completedDates.includes(today)).length;
    return (completedCount / habits.length) * 100;
  };

  const getTodayCompletedCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter((habit) => habit.completedDates.includes(today)).length;
  };

  const weeklyIdentitySummary = useMemo(() => getWeeklyIdentitySummary(habits), [habits]);
  const identityMomentum = useMemo(
    () =>
      habits.map((habit) => ({
        habitId: habit.id,
        habitName: habit.name,
        identityLabel: habit.identityLabel,
        reflection: buildIdentityReflection(habit)
      })),
    [habits]
  );

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        removeHabit,
        updateHabitIdentity,
        toggleHabit,
        getTodayProgress,
        getTodayCompletedCount,
        weeklyIdentitySummary,
        identityMomentum,
        loading
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
