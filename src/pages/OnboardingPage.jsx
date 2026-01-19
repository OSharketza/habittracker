import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Upload, Check, ChevronRight, ChevronLeft, User, Activity, FileText, Target } from 'lucide-react';
import { useMeals } from '../context/MealContext'; // to update calorie goal if needed
import { useWater } from '../context/WaterContext'; // to update water goal
import { useSleep } from '../context/SleepContext';

const OnboardingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Bio
        age: '',
        gender: 'male',
        height: '', // cm
        weight: '', // kg
        activity_level: 'sedentary', // sedentary, light, moderate, active, extra
        dietary_preferences: 'vegetarian',

        // Goals (calculated later)
        daily_calorie_target: 2000,
        daily_water_target: 2500,
        daily_sleep_target: 8
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Step 1: Bio Inputs
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calculate goals when moving to Step 3
    const calculateGoals = () => {
        const { age, gender, height, weight, activity_level } = formData;
        if (!age || !height || !weight) return;

        // BMR Calculation (Mifflin-St Jeor)
        let bmr = 10 * weight + 6.25 * height - 5 * age;
        if (gender === 'male') bmr += 5;
        else bmr -= 161;

        // TDEE
        const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            extra: 1.9
        };
        const tdee = Math.round(bmr * (multipliers[activity_level] || 1.2));

        // Water: roughly 35ml per kg
        const water = Math.round(weight * 35);

        setFormData(prev => ({
            ...prev,
            daily_calorie_target: tdee,
            daily_water_target: water
        }));
    };

    // File Upload Handler
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('user_documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            setUploadedFiles(prev => [...prev, file.name]);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1) calculateGoals();
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        try {
            setLoading(true);

            // Update Profile
            const { error } = await supabase
                .from('profiles')
                .update({
                    age: formData.age,
                    gender: formData.gender,
                    height: formData.height,
                    weight: formData.weight,
                    activity_level: formData.activity_level,
                    dietary_preferences: formData.dietary_preferences,
                    daily_calorie_target: formData.daily_calorie_target,
                    daily_water_target: formData.daily_water_target,
                    daily_sleep_target: formData.daily_sleep_target
                })
                .eq('id', user.id);

            if (error) throw error;

            // Ideally update Contexts here too so UI reflects immediately, 
            // but app usually refetches or we can force reload. 
            // For now, let's navigate to dashboard.
            navigate('/');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }} className="glass-card fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Let's get to know you</h2>
            <p className="text-muted" style={{ textAlign: 'center', marginBottom: '32px' }}>
                Setup your profile to get personalized recommendations.
            </p>

            {/* Progress Stepper */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{
                        width: '40px', height: '4px', borderRadius: '2px',
                        background: s <= step ? 'var(--accent-primary)' : 'var(--bg-secondary)'
                    }} />
                ))}
            </div>

            {step === 1 && (
                <div className="fade-in">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><User size={20} /> Bio-Metrics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Activity Level</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                                <option value="sedentary">Sedentary (Little to no exercise)</option>
                                <option value="light">Lightly Active (1-3 days/week)</option>
                                <option value="moderate">Moderately Active (3-5 days/week)</option>
                                <option value="active">Active (6-7 days/week)</option>
                                <option value="extra">Extra Active (Physical job or 2x training)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Diet Preference</label>
                            <select name="dietary_preferences" value={formData.dietary_preferences} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non-vegetarian">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="keto">Keto</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="fade-in">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><FileText size={20} /> Documents</h3>
                    <p className="text-muted" style={{ marginBottom: '20px' }}>Upload any diet plans, medical reports, or previous health data for safe keeping.</p>

                    <div style={{ border: '2px dashed var(--border-glass)', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
                        <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                        <p style={{ marginBottom: '16px' }}>Click to upload files</p>
                        <input type="file" onChange={handleFileUpload} disabled={loading} style={{ display: 'block', margin: '0 auto' }} />
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div>
                            <h4>Uploaded:</h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--accent-success)' }}>
                                {uploadedFiles.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="fade-in">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><Target size={20} /> Your Goals</h3>
                    <p className="text-muted" style={{ marginBottom: '20px' }}>Based on your details, we recommend these daily targets. Feel free to adjust them!</p>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-glass)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-warning)', fontWeight: 'bold' }}>Daily Calories</label>
                            <input type="number" name="daily_calorie_target" value={formData.daily_calorie_target} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1.1rem' }} />
                        </div>
                        <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-glass)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-info)', fontWeight: 'bold' }}>Daily Water (ml)</label>
                            <input type="number" name="daily_water_target" value={formData.daily_water_target} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1.1rem' }} />
                        </div>
                        <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-glass)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Daily Sleep (hours)</label>
                            <input type="number" name="daily_sleep_target" value={formData.daily_sleep_target} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1.1rem' }} />
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <Button variant="ghost" onClick={handleBack} disabled={step === 1 || loading}>
                    <ChevronLeft size={16} style={{ marginRight: '8px' }} /> Back
                </Button>

                {step < 3 ? (
                    <Button onClick={handleNext}>
                        Next <ChevronRight size={16} style={{ marginLeft: '8px' }} />
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={loading} style={{ background: 'var(--accent-success)' }}>
                        {loading ? 'Saving...' : 'Finish Setup'} <Check size={16} style={{ marginLeft: '8px' }} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
