import { MotivatorAgent } from './MotivatorAgent';
import { InsightAgent } from './InsightAgent';
import { HabitArchitect } from './HabitArchitect';

/**
 * Centralized Agents Export
 */
export const Agents = {
    motivator: MotivatorAgent,
    insight: InsightAgent,
    architect: HabitArchitect
};

/**
 * Custom hook to access agents (if context is needed later)
 */
export const useAgents = () => {
    return Agents;
};
