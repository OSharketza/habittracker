/**
 * Insight Agent
 * Responsible for data analysis and surfacing trends.
 */
export const InsightAgent = {
    analyzeTrends: (habits = []) => {
        if (!habits || habits.length === 0) return "Start tracking to see your patterns!";
        
        const today = new Date().toISOString().split('T')[0];
        const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
        const totalHabits = habits.length;
        
        // Find habit with most completions
        const mostConsistent = [...habits].sort((a, b) => b.completedDates.length - a.completedDates.length)[0];
        
        if (completedToday === totalHabits && totalHabits > 0) {
            return "Perfect day! You've mastered all your routines.";
        }
        
        if (mostConsistent && mostConsistent.completedDates.length > 5) {
            return `You're most consistent with "${mostConsistent.name}". Use that discipline for your other habits!`;
        }
        
        return `You've completed ${completedToday} out of ${totalHabits} routines today. What's next?`;
    },

    reflectOnManifestation: (text = "") => {
        if (!text) return "Your vision is your compass. Write it down to give it power.";
        
        const keywords = {
            peace: ["calm", "zen", "peace", "still", "relax"],
            growth: ["better", "grow", "learn", "improve", "evolve"],
            strength: ["strong", "power", "capable", "resilient", "force"],
            abundance: ["success", "more", "rich", "abundant", "wealth"]
        };

        const lowerText = text.toLowerCase();
        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lowerText.includes(w))) {
                const reflections = {
                    peace: "Your focus on tranquility is the foundation of clarity. Keep breathing.",
                    growth: "The hunger for evolution is your greatest asset. You are already becoming.",
                    strength: "Power comes from consistency. You are building an unbreakable core.",
                    abundance: "Abundance is a state of mind. You are attracting your wildest dreams."
                };
                return reflections[key];
            }
        }

        return "Your intention is set. Every word you write brings your future self closer to reality.";
    }
};
