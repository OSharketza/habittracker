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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
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
    </ThemeProvider>
  </React.StrictMode>,
)
