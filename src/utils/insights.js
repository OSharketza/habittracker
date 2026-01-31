
export const generateMealInsights = (meals, calorieGoal) => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(m => m.date === today);

    if (todayMeals.length === 0) {
        return {
            type: 'meal',
            insight: "Your engine needs fuel.",
            suggestion: "Start with a protein-rich breakfast to stabilize energy."
        };
    }

    const totalCals = todayMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);
    const totalSugar = todayMeals.reduce((acc, m) => acc + (m.sugar || 0), 0); // Assuming sugar might be added later

    // 1. Check Calorie Intake vs Goal
    if (totalCals < calorieGoal * 0.4 && new Date().getHours() > 14) {
        return {
            type: 'meal',
            insight: "Energy levels indicate a mid-day deficit.",
            suggestion: "Add a 300kcal snack now to prevent a dinner binge."
        };
    }

    // 2. Check Protein (Rule of thumb: 20-30g per meal is good)
    if (totalProtein < todayMeals.length * 15) {
        return {
            type: 'meal',
            insight: "Protein intake is lower than recent trends.",
            suggestion: "Swap your next side dish for lentils or greek yogurt."
        };
    }

    // 3. Late Night Eating (if meal time was tracked, but defaulting to simple pattern)
    // Placeholder for time-based analysis if timestamp is added to meals.

    // Default Fallback
    return {
        type: 'meal',
        insight: "Your fueling pattern is consistent today.",
        suggestion: "Hydrate before your next meal to aid digestion."
    };
};

export const generateHabitInsights = (habits) => {
    if (habits.length === 0) return null;

    const today = new Date().toISOString().split('T')[0];

    // Find a habit that was NOT completed today but has a previous streak
    const missedHabits = habits.filter(h => !h.completedDates.includes(today));

    if (missedHabits.length > 0) {
        const randomMiss = missedHabits[Math.floor(Math.random() * missedHabits.length)];
        return {
            type: 'habit',
            insight: `Consistency break detected for '${randomMiss.name}'.`,
            suggestion: "Do a 2-minute version of this habit right now."
        };
    }

    // If all done
    return {
        type: 'habit',
        insight: "Momentum is high across all targets.",
        suggestion: "Pick your hardest habit and increase the intensity tomorrow."
    };
};

export const getSmartInsight = (meals, calorieGoal, habits) => {
    // Randomly choose between meal or habit insight to keep it fresh, 
    // or prioritize "negative" trends (alerts) over positive ones.

    const mealInsight = generateMealInsights(meals, calorieGoal);
    const habitInsight = generateHabitInsights(habits);

    // Heuristic: If meal insight detects a deficit/problem, show it.
    if (mealInsight.insight.includes("deficit") || mealInsight.insight.includes("Protein")) {
        return mealInsight;
    }

    // Otherwise random
    return Math.random() > 0.5 && habitInsight ? habitInsight : mealInsight;
};
