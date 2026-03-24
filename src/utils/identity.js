import { calculateStreak } from './StreakUtils';

export const IDENTITY_SUGGESTIONS = [
  'I am active',
  'I am a reader',
  'I am someone who shows up for myself',
  'I am consistent',
  'I am calm under pressure'
];

export const suggestIdentityFromHabit = (habitName = '') => {
  const value = habitName.toLowerCase();

  if (/(read|book|study|learn)/.test(value)) return 'I am a reader';
  if (/(run|walk|gym|workout|train|exercise|yoga)/.test(value)) return 'I am active';
  if (/(water|sleep|meal|protein|meditat|journal)/.test(value)) return 'I take care of myself';
  if (/(wake|morning|routine|plan)/.test(value)) return 'I am consistent';

  return 'I am someone who keeps promises to myself';
};

export const buildIdentityReflection = (habit) => {
  const identity = habit.identityLabel || suggestIdentityFromHabit(habit.name);
  const streak = calculateStreak(habit.completedDates || []);
  const today = new Date().toISOString().split('T')[0];
  const doneToday = (habit.completedDates || []).includes(today);

  if (doneToday && streak >= 7) return `${identity}. ${streak} straight days is proof.`;
  if (doneToday && streak > 1) return `You showed up again today. ${identity}.`;
  if (doneToday) return `One action counts. ${identity}.`;
  if (streak >= 3) return `Protect the ${streak}-day run. ${identity}.`;

  return `Every rep is a vote for this identity: ${identity}.`;
};

export const getWeeklyIdentitySummary = (habits = []) => {
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return date.toISOString().split('T')[0];
  });

  return habits
    .map((habit) => {
      const completionsThisWeek = (habit.completedDates || []).filter((date) => weekDates.includes(date)).length;
      return {
        habitId: habit.id,
        habitName: habit.name,
        identityLabel: habit.identityLabel || suggestIdentityFromHabit(habit.name),
        completionsThisWeek,
        streak: calculateStreak(habit.completedDates || [])
      };
    })
    .filter((item) => item.completionsThisWeek > 0)
    .sort((a, b) => b.completionsThisWeek - a.completionsThisWeek || b.streak - a.streak);
};
