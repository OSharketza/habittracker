const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'indian_food.csv');
const outputPath = path.join(__dirname, 'src/data/extendedFoodDB.js');

try {
    const csv = fs.readFileSync(csvPath, 'utf8');
    const lines = csv.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim() !== '');

    // Heuristics
    const getMacros = (diet, course) => {
        let calories = 250, protein = 5, carbs = 30, fat = 10;

        const isVeg = diet.trim() === 'vegetarian';
        const isDessert = course.trim() === 'dessert';
        const isMain = course.trim() === 'main course';
        const isSnack = course.trim() === 'snack';

        if (isDessert) {
            calories = 350; protein = 4; carbs = 55; fat = 12;
        } else if (isMain) {
            if (isVeg) { calories = 280; protein = 8; carbs = 40; fat = 10; }
            else { calories = 320; protein = 20; carbs = 15; fat = 18; }
        } else if (isSnack) {
            if (isVeg) { calories = 180; protein = 4; carbs = 25; fat = 8; }
            else { calories = 220; protein = 15; carbs = 10; fat = 12; }
        }

        calories += Math.floor(Math.random() * 40) - 20;
        return { calories, protein, carbs, fat };
    };

    const data = lines.slice(1).map(line => {
        const parts = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') { inQuotes = !inQuotes; continue; }
            if (char === ',' && !inQuotes) { parts.push(current); current = ''; }
            else { current += char; }
        }
        parts.push(current);

        const name = parts[0];
        const diet = parts[2];
        const course = parts[6];
        const state = parts[7];

        if (!name || !diet || !course) return null;

        const macros = getMacros(diet, course);
        const stateStr = (state && state.trim() !== '-1') ? state.trim() : 'India';

        return {
            name: name.trim(),
            category: `${stateStr} - ${course.trim()}`,
            diet: diet.trim(),
            ...macros
        };
    }).filter(x => x);

    const fileContent = `export const extendedFoodDB = ${JSON.stringify(data, null, 2)};`;

    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log('Database generated with ' + data.length + ' items.');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
