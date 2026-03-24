/**
 * Motivator Agent
 * Responsible for streaks, calibrations, and daily motivation.
 */
export const MotivatorAgent = {
    generateDailySpark: (habits = []) => {
        const today = new Date().toISOString().split('T')[0];
        const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
        
        if (completedToday > 0) {
            return `You've already crushed ${completedToday} habits today! Keep the momentum high.`;
        }
        
        const sparks = [
            "Every small step counts. Start with your easiest habit!",
            "Remember why you started. Your future self will thank you.",
            "Consistency is the key to mastery. Let's get one win today!",
            "You are stronger than your excuses. Which habit is next?"
        ];
        return sparks[Math.floor(Math.random() * sparks.length)];
    },

    calculateLongestStreak: (habits = []) => {
        if (habits.length === 0) return 0;
        // Simple mock for now, but could be real date logic
        const streaks = habits.map(h => h.completedDates.length);
        return Math.max(...streaks, 0);
    },

    getMilestoneMessage: (habits = []) => {
        const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
        if (totalCompletions >= 100) return "Centurion! 100 completions reached.";
        if (totalCompletions >= 50) return "Half-Century! 50 wins in the bag.";
        if (totalCompletions >= 10) return "Getting Started! 10 completions done.";
        return null;
    }
};
