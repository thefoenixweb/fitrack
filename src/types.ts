export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  sets: number
  reps: number
  weight: number
  intensity: number
}

export interface Routine {
  id: string
  name: string
  category: string
  difficulty: string
  exercises: Exercise[]
  estimatedDuration: number
  overallIntensity: number
  schedule: string[]
  createdAt: string
  isFavorite?: boolean
  userId: string
}

export interface WorkoutHistory {
  id: string
  routineId: string
  routineName: string
  date: string
  duration: number
  intensity: string
  exercises: Exercise[]
  expanded?: boolean
  userId: string
}

export interface User {
  id: string
  name: string
  email: string
  weight: number
  height: string
  createdAt: string
}

export type IntensityLevel = "Low" | "Medium" | "High" | "Very High"

export interface AppState {
  user: User | null
  routines: Routine[]
  workoutHistory: WorkoutHistory[]
  loading: boolean
  error: string | null
}
