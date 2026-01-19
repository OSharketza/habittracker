import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { HabitProvider } from './context/HabitContext'
import { MealProvider } from './context/MealContext'
import { WorkoutProvider } from './context/WorkoutContext'
import { SleepProvider } from './context/SleepContext'
import { WaterProvider } from './context/WaterContext'
import { ThemeProvider } from './context/ThemeContext'

import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <MealProvider>
            <WorkoutProvider>
              <SleepProvider>
                <WaterProvider>
                  <App />
                </WaterProvider>
              </SleepProvider>
            </WorkoutProvider>
          </MealProvider>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
