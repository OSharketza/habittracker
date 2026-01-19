# AI Habit Planner

A premium, glassmorphism-inspired Habit Planner & Lifestyle Tracker powered by React, Vite, and Supabase.

## Features

- **📊 Dashboard**: centralized view of your daily progress.
- **✅ Habits**: Create and track daily habits.
- **🥘 Meals & Nutrition**: 
  - Search 250+ Indian dishes.
  - Track Calories, Protein, Carbs, and Fat.
  - **New**: Calorie Reference Chart for quick lookups.
- **💪 Workouts**: Log exercises and intensity.
- **😴 Sleep**: Track duration and quality.
- **💧 Water**: Daily hydration tracker.
- **🌓 Theme Support**: Day/Night mode (Auto-saving preference).
- **🔒 Authentication**: Secure login/signup via Supabase.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS (Variables, Glassmorphism)
- **Icons**: Lucide React
- **Backend & Auth**: Supabase

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/OSharketza/habittracker.git
    cd habit-planner
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    *(Note: Currently hardcoded in `src/supabaseClient.js` for demo purposes, but recommended to move to .env for production).*

### Running the App

To start the development server:

```bash
npm run dev
```

Then open your browser to `http://localhost:5173` (or the port shown in the terminal, commonly `5174`).

## Building for Production

To build the app for deployment (e.g., Netlify, Vercel):

```bash
npm run build
```

The output will be in the `dist/` directory.

## Project Structure

- `src/components`: Reusable UI elements (Buttons, Cards).
- `src/context`: State management (Habits, Meals, Auth, Theme).
- `src/features`: Feature-specific logic (AddMeal, CalorieChart).
- `src/pages`: Main view routes.
- `src/data`: Static datasets (Indian Food DB).
