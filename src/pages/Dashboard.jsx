import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { CheckSquare, Droplets, Moon, Utensils, Flame, User, Edit2, X, Check } from 'lucide-react';

// Contexts
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { useMeals } from '../context/MealContext';
import { useWater } from '../context/WaterContext';
import { useSleep } from '../context/SleepContext';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
    const { user } = useAuth();

    // Consuming Contexts
    const { habits, getHabitProgress, getTodayProgress } = useHabits();
    const { meals, getTodayStats, calorieGoal, setCalorieGoal } = useMeals();
    const { waterIntake, waterGoal, setWaterGoal } = useWater();
    const { getTodaySleep, getAverageSleep, sleepGoal, setSleepGoal } = useSleep();

    // Derived State
    const todaySleep = getTodaySleep();
    const sleepHours = todaySleep ? Number(todaySleep.hours) : 0;
    const caloriesConsumed = getTodayStats().calories;

    const habitProgress = getTodayProgress().toFixed(0);

    // Calculate Wellness Score
    // Formula: Average of % completion of all 4 pillars
    const activeScore = () => {
        let scores = [];

        // Habits %
        scores.push(habitProgress);

        // Water % (cap at 100)
        const waterPct = Math.min((waterIntake / waterGoal) * 100, 100);
        scores.push(waterPct);

        // Sleep % (cap at 100)
        const sleepPct = Math.min((sleepHours / sleepGoal) * 100, 100);
        scores.push(sleepPct);

        // Calories % (cap at 100, maybe penalize overeating later? for now just progress)
        const calPct = Math.min((caloriesConsumed / calorieGoal) * 100, 100);
        scores.push(calPct);

        const total = scores.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
        return Math.round(total / scores.length) || 0;
    };

    const wellnessScore = activeScore();

    // Goal Editing State
    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [tempGoals, setTempGoals] = useState({
        calories: calorieGoal,
        water: waterGoal,
        sleep: sleepGoal
    });

    useEffect(() => {
        if (isEditingGoals) {
            setTempGoals({
                calories: calorieGoal,
                water: waterGoal,
                sleep: sleepGoal
            });
        }
    }, [isEditingGoals, calorieGoal, waterGoal, sleepGoal]);

    const handleGoalChange = (e) => {
        setTempGoals({ ...tempGoals, [e.target.name]: e.target.value });
    };

    const saveGoals = async () => {
        try {
            // Update Contexts
            setCalorieGoal(Number(tempGoals.calories));
            setWaterGoal(Number(tempGoals.water));
            setSleepGoal(Number(tempGoals.sleep));

            // Update Supabase Profiles
            const { error } = await supabase
                .from('profiles')
                .update({
                    daily_calorie_target: tempGoals.calories,
                    daily_water_target: tempGoals.water,
                    daily_sleep_target: tempGoals.sleep
                })
                .eq('id', user.id);

            if (error) throw error;
            setIsEditingGoals(false);

        } catch (error) {
            console.error('Error saving goals:', error);
            alert('Failed to save goals.');
        }
    };

    // Calculate Habit Counts for display
    const habitsList = habits || []; // Ensure logic matches context
    const completedHabitsCount = habitsList.filter(h => {
        // Need to check if completed today. 
        // Context might store completion differently. 
        // Let's rely on calculateDailyProgress() for the % mainly.
        // But for "X/Y" text we need counts.
        // Assuming context exposes logic or we re-implement brief check if context is complex.
        // Checking HabitContext... it uses `habitLogs` map.
        // `getHabitProgress` returns { completed, total } ? No, checking context...
        // Context exposes `habits` (list) and `habitLogs` (map).
        // Let's use `calculateDailyProgress` for the bar.
        // For text, let's just show percentage for now to be safe or derived.
        return false;
    }).length;

    // Better: Helper from context? Context has `calculateDailyProgress`.
    // Let's modify Card text to be "Daily Completion: X%" instead of counts if distinct counts are hard.

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Hello, {user?.email?.split('@')[0] || 'User'}</h1>
                <Button variant="outline" onClick={() => setIsEditingGoals(true)} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                    <Edit2 size={16} style={{ marginRight: '8px' }} /> Edit Goals
                </Button>
            </div>

            {/* Goal Editor Modal Overlay */}
            {isEditingGoals && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-card fade-in" style={{ width: '90%', maxWidth: '400px', padding: '24px', border: '1px solid var(--accent-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3>Edit Daily Goals</h3>
                            <button onClick={() => setIsEditingGoals(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--accent-danger)' }}>Calories (kcal)</label>
                                <input type="number" name="calories" value={tempGoals.calories} onChange={handleGoalChange}
                                    style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--accent-info)' }}>Water (ml)</label>
                                <input type="number" name="water" value={tempGoals.water} onChange={handleGoalChange}
                                    style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>Sleep (hours)</label>
                                <input type="number" name="sleep" value={tempGoals.sleep} onChange={handleGoalChange}
                                    style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'white' }} />
                            </div>

                            <Button onClick={saveGoals} style={{ marginTop: '12px', background: 'var(--accent-success)' }}>
                                Save Changes <Check size={16} style={{ marginLeft: '8px' }} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Stats Row */}
            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)', marginTop: '20px' }}>
                <Card title="Daily Habits">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="text-muted">Completion</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{habitProgress}%</span>
                    </div>
                    <ProgressBar value={habitProgress} max={100} color="var(--accent-success)" />
                </Card>

                <Card title="Wellness Score">
                    <div className="flex-center" style={{ height: '100%', minHeight: '60px', flexDirection: 'column' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {wellnessScore}%
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Balance</span>
                    </div>
                </Card>
            </div>

            {/* Quick Actions Grid */}
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>At a Glance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>

                {/* Water Widget */}
                <Link to="/water" className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-info)' }}>
                            <Droplets size={24} />
                        </div>
                        <span className="text-muted">Water</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{waterIntake}ml</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {waterGoal}ml goal</div>
                    </div>
                    <ProgressBar value={waterIntake} max={waterGoal} color="var(--accent-info)" height="6px" />
                </Link>

                {/* Sleep Widget */}
                <Link to="/sleep" className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                            <Moon size={24} />
                        </div>
                        <span className="text-muted">Sleep</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sleepHours}h</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {sleepGoal}h goal</div>
                    </div>
                    <ProgressBar value={sleepHours} max={sleepGoal} color="var(--accent-primary)" height="6px" />
                </Link>

                {/* Calories Widget */}
                <Link to="/meals" className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-danger)' }}>
                            <Flame size={24} />
                        </div>
                        <span className="text-muted">Calories</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{caloriesConsumed}</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {calorieGoal} kcal</div>
                    </div>
                    <ProgressBar value={caloriesConsumed} max={calorieGoal} color="var(--accent-danger)" height="6px" />
                </Link>

                {/* Profile Widget */}
                <Link to="/onboarding" className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px', borderRadius: '12px' }}>
                            <User size={24} />
                        </div>
                        <span className="text-muted">Profile</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>My Plan</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>Goals & Bio</div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Dashboard;
