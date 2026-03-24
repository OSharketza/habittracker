/**
 * Calculates the current streak for a habit.
 * A streak is the number of consecutive days up to today (or yesterday if today isn't done yet).
 * @param {Array<string>} completedDates - List of ISO date strings (YYYY-MM-DD)
 * @returns {number} The current streak count
 */
export const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;

    const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = 0;
    let checkDate = today;

    // If today is not completed, start checking from yesterday
    if (!sortedDates.includes(today)) {
        checkDate = yesterday;
    }

    // Iterate backwards through days
    while (sortedDates.includes(checkDate)) {
        streak++;
        const current = new Date(checkDate);
        current.setDate(current.getDate() - 1);
        checkDate = current.toISOString().split('T')[0];
    }

    return streak;
};

/**
 * Checks if the last 7 days were completed.
 * Returns an array of booleans for the last 7 days.
 */
export const getLast7DaysStatus = (completedDates) => {
    const status = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
        status.unshift(completedDates.includes(date));
    }
    return status;
};
