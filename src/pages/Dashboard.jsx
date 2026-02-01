import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import InsightCard from '../components/InsightCard';
import { CheckSquare, Droplets, Moon, Utensils, Flame, User, Edit2, X, Check, Quote, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { getSmartInsight } from '../utils/insights';
import { getDailyQuote } from '../utils/quotes';

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
    const dailyQuote = useMemo(() => getDailyQuote(), []);
    const [manifestationDone, setManifestationDone] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkManifestation = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await supabase
                .from('manifestations')
                .select('id, created_at')
                .eq('user_id', user.id)
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);

            if (data && data.length > 0) {
                setManifestationDone(true);
            }
        };
        checkManifestation();
    }, [user]);

    const habitProgress = getTodayProgress().toFixed(0);

    // Smart Insights
    const smartInsight = useMemo(() => {
        return getSmartInsight(meals, calorieGoal, habits);
    }, [meals, calorieGoal, habits]);

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

    return (
        <div className="container fade-in">
            {/* Daily Quote Section */}
            <div className="glass-card" style={{ marginBottom: '24px', padding: '20px', borderLeft: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'start', gap: '16px' }}>
                <Quote size={32} style={{ color: 'var(--accent-primary)', opacity: 0.8, marginTop: '-4px' }} />
                <div>
                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '8px', lineHeight: '1.4' }}>"{dailyQuote.text}"</p>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>— {dailyQuote.author}</span>
                </div>
            </div>

            {/* Manifestation Reminder */}
            {!manifestationDone && (
                <div style={{ marginBottom: '24px' }}>
                    <Link to="/manifestations" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }} className="hover-highlight">
                            <Sparkles size={24} style={{ color: '#F59E0B' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: '#F59E0B' }}>Daily Manifestation Missing</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Take a moment to set your intention for today.</div>
                            </div>
                            <Button size="sm" variant="ghost">Start Now &rarr;</Button>
                        </div>
                    </Link>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Hello, {user?.email?.split('@')[0] || 'User'}</h1>
                <Button variant="outline" onClick={() => setIsEditingGoals(true)} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                    <Edit2 size={16} style={{ marginRight: '8px' }} /> Edit Goals
                </Button>
            </div>

            {/* Smart Insight */}
            {smartInsight && (
                <InsightCard
                    insight={smartInsight.insight}
                    suggestion={smartInsight.suggestion}
                    type={smartInsight.type}
                />
            )}

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
            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
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

            {/* Goal Status Breakdown */}
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Goal Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckSquare size={18} /> Habits Status
                    </h3>
                    {habits.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {habits.map(habit => {
                                const isCompleted = Boolean(habit.logs && habit.logs[new Date().toISOString().split('T')[0]]);
                                return (
                                    <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                        <span>{habit.name}</span>
                                        {isCompleted ? (
                                            <span style={{ color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                <CheckCircle size={14} /> Completed
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-muted">No habits set for today.</div>
                    )}
                </div>

                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={18} /> Daily Targets
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Water Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Droplets size={16} className="text-info" />
                                <span>Water Intake</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>
                                {waterIntake >= waterGoal ?
                                    <span style={{ color: 'var(--accent-success)' }}>Goal Reached!</span> :
                                    `${Math.round((waterIntake / waterGoal) * 100)}%`
                                }
                            </span>
                        </div>
                        <ProgressBar value={waterIntake} max={waterGoal} color="var(--accent-info)" height="6px" />

                        {/* Sleep Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Moon size={16} className="text-primary" />
                                <span>Sleep</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>
                                {sleepHours >= sleepGoal ?
                                    <span style={{ color: 'var(--accent-success)' }}>Goal Reached!</span> :
                                    `${Math.round((sleepHours / sleepGoal) * 100)}%`
                                }
                            </span>
                        </div>
                        <ProgressBar value={sleepHours} max={sleepGoal} color="var(--accent-primary)" height="6px" />

                        {/* Calories Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Flame size={16} className="text-danger" />
                                <span>Calories</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>
                                {caloriesConsumed >= calorieGoal ?
                                    <span style={{ color: 'var(--accent-success)' }}>Goal Reached!</span> :
                                    `${Math.round((caloriesConsumed / calorieGoal) * 100)}%`
                                }
                            </span>
                        </div>
                        <ProgressBar value={caloriesConsumed} max={calorieGoal} color="var(--accent-danger)" height="6px" />
                    </div>
                </div>
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
