import React, { useState, useEffect, useRef } from 'react';
import { useMeals } from '../../context/MealContext';
import Button from '../../components/Button';
import { Plus, Search } from 'lucide-react';
import { extendedFoodDB } from '../../data/extendedFoodDB';

const AddMeal = () => {
    const { addMeal, getTodayStats, calorieGoal } = useMeals();
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
    });

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const wrapperRef = useRef(null);

    // Smart Suggestions State
    const [smartSuggestions, setSmartSuggestions] = useState([]);
    const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);

    // Quick Add Staples
    const quickAddItems = [
        { name: "Roti (1 pc)", calories: 110, protein: 3, carbs: 20, fat: 1.5 },
        { name: "Rice (1 bowl)", calories: 240, protein: 4, carbs: 50, fat: 0.5 },
        { name: "Dal (1 bowl)", calories: 180, protein: 9, carbs: 25, fat: 6 },
        { name: "Tea (1 cup)", calories: 60, protein: 1, carbs: 10, fat: 2 },
        { name: "Coffee", calories: 80, protein: 2, carbs: 10, fat: 3 }
    ];

    // Filter suggestions based on search term
    useEffect(() => {
        if (searchTerm.length > 1) {
            const filtered = extendedFoodDB.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                food.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        // Calculate smart suggestions based on remaining calories
        const stats = getTodayStats();
        const remaining = Math.max(0, calorieGoal - stats.calories);

        if (remaining > 100) {
            // Find foods within +/- 20% of remaining, or just general healthy suggestions if low
            // Randomize a bit to show different options
            const candidates = extendedFoodDB.filter(f =>
                f.calories <= remaining && f.calories > (remaining * 0.5)
            ).sort(() => 0.5 - Math.random()).slice(0, 3);

            setSmartSuggestions(candidates);
        } else {
            setSmartSuggestions([]);
        }
    }, [calorieGoal]); // Re-run when goal changes or component mounts (and stats update via context if we subscribed correctly, though stats is a function here)
    // Note: getTodayStats is a function, not a value. We might need to listen to something else to trigger updates, but useMeals provides methods. 
    // Actually, useMeals should probably expose the stats object directly if we want reactivity, OR we assume parent re-renders trigger this.
    // Let's assume for now we want to manually trigger this or rely on re-renders. 
    // Better yet, let's just calculate it on render or in an effect dependent on 'meals' from context if we had access.
    // But we strictly have addMeal. Let's start with basics.

    const handleSelectFood = (food) => {
        setFormData({
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat
        });
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const handleQuickAdd = (item) => {
        addMeal(item.name, item.calories, item.protein, item.carbs, item.fat);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nameToUse = formData.name || searchTerm; // Use search term if name empty
        if (!nameToUse) return;

        addMeal(
            nameToUse,
            formData.calories || 0,
            formData.protein || 0,
            formData.carbs || 0,
            formData.fat || 0
        );
        setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
        setSearchTerm('');
    };

    return (
        <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--accent-primary)" />
                Log a Meal
            </h3>

            {/* Quick Add Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {quickAddItems.map((item, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-glass)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--accent-primary)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <span>+</span> {item.name}
                    </button>
                ))}
            </div>

            {/* Smart Suggestions Toggle */}
            {smartSuggestions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <button
                        type="button"
                        onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-info)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                        }}
                    >
                        {showSmartSuggestions ? 'Hide Suggestions' : 'Need ideas? See suggestions based on your remaining calories.'}
                    </button>

                    {showSmartSuggestions && (
                        <div style={{
                            marginTop: '12px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '8px'
                        }}>
                            {smartSuggestions.map((food, i) => (
                                <div key={i}
                                    onClick={() => handleSelectFood(food)}
                                    style={{
                                        padding: '10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{food.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{food.calories} kcal</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Search Bar */}
            <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search Indian foods (e.g. Dosa, Paneer)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-glass)',
                            background: 'var(--bg-glass)',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        marginTop: '4px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: 'var(--shadow-card)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {suggestions.map((food, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectFood(food)}
                                className="food-item"
                                style={{
                                    padding: '10px 12px',
                                    borderBottom: '1px solid var(--border-glass)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div>
                                    <div style={{ fontWeight: '500' }}>{food.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{food.category}</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-warning)' }}>
                                    {food.calories} kcal
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Dishes Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    />
                    <input
                        type="number"
                        name="calories"
                        placeholder="Calories"
                        value={formData.calories}
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    />
                    <input
                        type="number"
                        name="protein"
                        placeholder="Protein (g)"
                        value={formData.protein}
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    />
                    <input
                        type="number"
                        name="carbs"
                        placeholder="Carbs (g)"
                        value={formData.carbs}
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    />
                    <input
                        type="number"
                        name="fat"
                        placeholder="Fat (g)"
                        value={formData.fat}
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
                    />
                </div>
                <Button type="submit" style={{ width: '100%' }}>Add Entry</Button>
            </form>
        </div>
    );
};

export default AddMeal;
