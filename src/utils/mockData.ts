import type { User, Routine, WorkoutHistory, Exercise } from "../types"

// Mock user data
export const mockUser: User = {
  id: "mock-user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  weight: 185,
  height: "6'1\"",
  createdAt: new Date().toISOString(),
}

// Mock exercises
export const mockExercises: Exercise[] = [
  {
    id: "ex-1",
    name: "Bench Press",
    muscleGroup: "Chest",
    sets: 3,
    reps: 10,
    weight: 135,
    intensity: 3,
  },
  {
    id: "ex-2",
    name: "Squats",
    muscleGroup: "Legs",
    sets: 4,
    reps: 8,
    weight: 185,
    intensity: 4,
  },
  {
    id: "ex-3",
    name: "Deadlift",
    muscleGroup: "Back",
    sets: 3,
    reps: 5,
    weight: 225,
    intensity: 5,
  },
  {
    id: "ex-4",
    name: "Pull-ups",
    muscleGroup: "Back",
    sets: 3,
    reps: 12,
    weight: 0,
    intensity: 3,
  },
  {
    id: "ex-5",
    name: "Shoulder Press",
    muscleGroup: "Shoulders",
    sets: 3,
    reps: 10,
    weight: 95,
    intensity: 3,
  },
]

// Mock routines
export const mockRoutines: Routine[] = [
  {
    id: "routine-1",
    name: "Upper Body Strength",
    category: "Strength",
    difficulty: "Intermediate",
    exercises: [mockExercises[0], mockExercises[4]],
    estimatedDuration: 45,
    overallIntensity: 3,
    schedule: ["Monday", "Thursday"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    userId: mockUser.id,
  },
  {
    id: "routine-2",
    name: "Lower Body Power",
    category: "Strength",
    difficulty: "Advanced",
    exercises: [mockExercises[1], mockExercises[2]],
    estimatedDuration: 60,
    overallIntensity: 4,
    schedule: ["Tuesday", "Friday"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    userId: mockUser.id,
  },
  {
    id: "routine-3",
    name: "Back and Biceps",
    category: "Pull",
    difficulty: "Beginner",
    exercises: [mockExercises[2], mockExercises[3]],
    estimatedDuration: 50,
    overallIntensity: 3,
    schedule: ["Wednesday", "Saturday"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    userId: mockUser.id,
  },
]

// Mock workout history
export const mockWorkoutHistory: WorkoutHistory[] = [
  {
    id: "workout-1",
    routineId: "routine-1",
    routineName: "Upper Body Strength",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    intensity: "High",
    exercises: [
      { ...mockExercises[0], weight: 140 },
      { ...mockExercises[4], weight: 95 },
    ],
    userId: mockUser.id,
  },
  {
    id: "workout-2",
    routineId: "routine-2",
    routineName: "Lower Body Power",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    intensity: "Very High",
    exercises: [
      { ...mockExercises[1], weight: 195 },
      { ...mockExercises[2], weight: 225 },
    ],
    userId: mockUser.id,
  },
  {
    id: "workout-3",
    routineId: "routine-3",
    routineName: "Back and Biceps",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 50,
    intensity: "Medium",
    exercises: [
      { ...mockExercises[2], weight: 225 },
      { ...mockExercises[3], weight: 0 },
    ],
    userId: mockUser.id,
  },
  {
    id: "workout-4",
    routineId: "routine-1",
    routineName: "Upper Body Strength",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 40,
    intensity: "Medium",
    exercises: [
      { ...mockExercises[0], weight: 135 },
      { ...mockExercises[4], weight: 90 },
    ],
    userId: mockUser.id,
  },
]
