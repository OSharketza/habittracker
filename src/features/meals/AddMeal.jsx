import React, { useState, useEffect, useRef } from 'react';
import { useMeals } from '../../context/MealContext';
import Button from '../../components/Button';
import { Plus, Search } from 'lucide-react';
import { extendedFoodDB } from '../../data/extendedFoodDB';

const AddMeal = () => {
    const { addMeal } = useMeals();
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

    // Handle clicking outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

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
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--accent-primary)" />
                Log a Meal
            </h3>

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
