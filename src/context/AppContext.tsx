"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { routinesApi, workoutHistoryApi, usersApi, healthCheck, ApiError } from "../services/api"
import type { User, Routine, WorkoutHistory } from "../types"
import { mockUser, mockRoutines, mockWorkoutHistory } from "../utils/mockData"

interface AppContextType {
  // User data
  user: User | null
  userName: string
  userEmail: string
  userWeight: number
  userHeight: string

  // Routines
  routines: Routine[]
  setRoutines: (routines: Routine[]) => void
  createRoutine: (routineData: any) => Promise<void>
  updateRoutine: (id: string, routineData: any) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>

  // Workout History
  workoutHistory: WorkoutHistory[]
  setWorkoutHistory: (history: WorkoutHistory[]) => void
  createWorkoutHistory: (workoutData: any) => Promise<void>

  // Loading and error states
  loading: boolean
  error: string | null
  apiConnected: boolean
  useMockData: boolean
  setUseMockData: (use: boolean) => void
  refreshData: () => Promise<void>
  clearError: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiConnected, setApiConnected] = useState(false)
  const [useMockData, setUseMockData] = useState(true) // Default to mock data for preview

  const clearError = () => setError(null)

  const checkApiConnection = async () => {
    try {
      const isConnected = await healthCheck()
      setApiConnected(isConnected)
      return isConnected
    } catch {
      setApiConnected(false)
      return false
    }
  }

  const loadApiUser = async () => {
    try {
      // Try to get the seeded user (John Doe)
      const users = await usersApi.getUsers()
      if (users && users.length > 0) {
        const apiUser = users[0] // Get the first (seeded) user
        const formattedUser: User = {
          id: apiUser.id,
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email,
          weight: Number(apiUser.weight),
          height: apiUser.height,
          createdAt: apiUser.createdAt,
        }
        setUser(formattedUser)
        return formattedUser
      }
    } catch (err) {
      console.warn("Failed to load user from API:", err)
    }
    return null
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (useMockData) {
        // Use mock data
        console.log("Using mock data for preview")
        setUser(mockUser)
        setRoutines(mockRoutines)
        setWorkoutHistory(mockWorkoutHistory)
        setApiConnected(false)
      } else {
        // Try to use real API
        console.log("Attempting to connect to API...")
        const connected = await checkApiConnection()

        if (!connected) {
          throw new Error(
            "Cannot connect to API. Please make sure the API server is running on the configured URL.\n\n" +
              "For preview, switch to Mock Data mode.",
          )
        }

        // Load user from API
        const apiUser = await loadApiUser()
        if (!apiUser) {
          console.warn("No user found in API, using mock user")
          setUser(mockUser)
          return // Exit to prevent API calls with a null user
        }

        // Load routines with the user ID
        try {
          const routinesData = await routinesApi.getRoutines(apiUser.id)
          setRoutines(Array.isArray(routinesData) ? routinesData : [])
        } catch (err) {
          console.warn("Failed to load routines:", err)
          setRoutines([])
        }

        // Load workout history with the user ID
        try {
          const historyData = await workoutHistoryApi.getWorkoutHistory(apiUser.id)
          setWorkoutHistory(Array.isArray(historyData) ? historyData : [])
        } catch (err) {
          console.warn("Failed to load workout history:", err)
          setWorkoutHistory([])
        }
      }
    } catch (err) {
      console.error("Error loading data:", err)
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError(
            "Cannot connect to the API server. Please check:\n1. API server is running\n2. API URL is correct\n3. CORS is configured properly\n\nFor preview, switch to Mock Data mode.",
          )
        } else {
          setError(`API Error (${err.status}): ${err.message}`)
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to load data")
      }
    } finally {
      setLoading(false)
    }
  }

  const createRoutine = async (routineData: any) => {
    try {
      setError(null)
      if (useMockData) {
        // Mock create routine
        const newRoutine: Routine = {
          id: `routine-${Date.now()}`,
          userId: mockUser.id,
          createdAt: new Date().toISOString(),
          ...routineData,
        }
        setRoutines((prev) => [...prev, newRoutine])
        return
      }

      // Check if user exists before creating a routine
      if (!user) {
        throw new Error("Cannot create routine: No user is currently loaded.");
      }

      // Pass the userId to the API call
      const newRoutine = await routinesApi.createRoutine(routineData, user.id);
      setRoutines((prev) => [...prev, newRoutine])
    } catch (err) {
      console.error("Error creating routine:", err)
      const errorMessage =
        err instanceof ApiError ? `Failed to create routine: ${err.message}` : "Failed to create routine"
      setError(errorMessage)
      throw err
    }
  }

  const updateRoutine = async (id: string, routineData: any) => {
    try {
      setError(null)

      if (useMockData) {
        // Mock update routine
        setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, ...routineData } : r)))
        return
      }

      if (!user) {
        throw new Error("Cannot update routine: No user is currently loaded.");
      }
      
      const updatedRoutine = await routinesApi.updateRoutine(id, routineData, user.id)
      setRoutines((prev) => prev.map((r) => (r.id === id ? updatedRoutine : r)))
    } catch (err) {
      console.error("Error updating routine:", err)
      const errorMessage =
        err instanceof ApiError ? `Failed to update routine: ${err.message}` : "Failed to update routine"
      setError(errorMessage)
      throw err
    }
  }

  const deleteRoutine = async (id: string) => {
    try {
      setError(null)

      if (useMockData) {
        // Mock delete routine
        setRoutines((prev) => prev.filter((r) => r.id !== id))
        return
      }
      
      if (!user) {
        throw new Error("Cannot delete routine: No user is currently loaded.");
      }

      await routinesApi.deleteRoutine(id, user.id)
      setRoutines((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error("Error deleting routine:", err)
      const errorMessage =
        err instanceof ApiError ? `Failed to delete routine: ${err.message}` : "Failed to delete routine"
      setError(errorMessage)
      throw err
    }
  }

  const createWorkoutHistory = async (workoutData: any) => {
    try {
      setError(null)

      if (useMockData) {
        // Mock create workout history
        const newWorkout: WorkoutHistory = {
          id: `workout-${Date.now()}`,
          userId: mockUser.id,
          ...workoutData,
        }
        setWorkoutHistory((prev) => [newWorkout, ...prev])
        return
      }

      if (!user) {
        throw new Error("Cannot save workout: No user is currently loaded.");
      }

      const newWorkout = await workoutHistoryApi.createWorkoutHistory(workoutData, user.id)
      setWorkoutHistory((prev) => [newWorkout, ...prev])
    } catch (err) {
      console.error("Error creating workout history:", err)
      const errorMessage = err instanceof ApiError ? `Failed to save workout: ${err.message}` : "Failed to save workout"
      setError(errorMessage)
      throw err
    }
  }

  const refreshData = async () => {
    await loadData()
  }

  useEffect(() => {
    loadData()
  }, [useMockData])

  const value: AppContextType = {
    user,
    userName: user?.name || "John Doe",
    userEmail: user?.email || "john.doe@example.com",
    userWeight: user?.weight || 180,
    userHeight: user?.height || "5'10\"",

    routines,
    setRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,

    workoutHistory,
    setWorkoutHistory,
    createWorkoutHistory,

    loading,
    error,
    apiConnected,
    useMockData,
    setUseMockData,
    refreshData,
    clearError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}