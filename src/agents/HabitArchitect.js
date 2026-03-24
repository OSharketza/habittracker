/**
 * Habit Architect (Skill)
 * Helps users design achievable routines.
 */
export const HabitArchitect = {
    suggestHabits: (category = 'fitness') => {
        const library = {
            fitness: ["10-min morning stretch", "Drink 2L water", "Walk 5000 steps", "Post-work yoga session"],
            focus: ["20-min deep work", "No phone for 1 hour after waking", "Read 5 pages", "Inbox zero daily"],
            mindset: ["Write 3 gratitudes", "5-min meditation", "Daily manifestation check", "Evening reflection"],
            health: ["Eat 2 servings of fruit", "No sugar in coffee", "Take daily vitamins", "Sleep before 11 PM"]
        };
        return library[category] || library['fitness'];
    }
};
