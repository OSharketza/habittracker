import { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { MotivatorAgent } from './MotivatorAgent';
import { InsightAgent } from './InsightAgent';
import { HabitArchitect } from './HabitArchitect';

/**
 * useAgents Hook
 * Bridges the static agent logic with real-time app state.
 */
export const useAgents = () => {
    const { habits, addHabit } = useHabits();

    const results = useMemo(() => ({
        motivation: {
            spark: MotivatorAgent.generateDailySpark(habits),
            milestone: MotivatorAgent.getMilestoneMessage(habits),
            streak: MotivatorAgent.calculateLongestStreak(habits)
        },
        insights: {
            trend: InsightAgent.analyzeTrends(habits),
            reflectOnManifestation: (text) => InsightAgent.reflectOnManifestation(text)
        },
        architect: {
            getSuggestions: (cat) => HabitArchitect.suggestHabits(cat),
            applySuggestion: async (name) => {
                await addHabit(name, 'general', {
                    identityLabel: `Proving I am becoming a better version of myself`,
                    motivationNote: "Suggested by AI Habit Architect"
                });
            }
        }
    }), [habits, addHabit]);

    return results;
};
