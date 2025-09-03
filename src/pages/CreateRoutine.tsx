"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { ArrowLeftIcon, PlusIcon, XCircleIcon, Loader2Icon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import type { Exercise } from "../types"

interface CreateRoutineProps {
  navigateTo: (page: string) => void
  editRoutineId: string | null
  setEditRoutineId: (id: string | null) => void
}

export function CreateRoutine({ navigateTo, editRoutineId, setEditRoutineId }: CreateRoutineProps) {
  const { routines, createRoutine, updateRoutine, error } = useAppContext()

  const emptyExercise: Exercise = {
    id: uuidv4(),
    name: "",
    muscleGroup: "",
    sets: 3,
    reps: 10,
    weight: 0,
    intensity: 0,
  }

  const [routineName, setRoutineName] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise])
  const [schedule, setSchedule] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editRoutineId) {
      const routineToEdit = routines.find((r) => r.id === editRoutineId)
      if (routineToEdit) {
        setRoutineName(routineToEdit.name)
        setCategory(routineToEdit.category)
        setDifficulty(routineToEdit.difficulty)
        setExercises(routineToEdit.exercises)
        setSchedule(routineToEdit.schedule)
      }
    }
  }, [editRoutineId, routines])

  const calculateExerciseIntensity = (exercise: Exercise): number => {
    const intensity = Math.round((exercise.sets * exercise.reps * (exercise.weight > 0 ? exercise.weight : 1)) / 100)
    return Math.min(Math.max(intensity, 0), 100)
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    }

    if (field === "sets" || field === "reps" || field === "weight") {
      updatedExercises[index].intensity = calculateExerciseIntensity(updatedExercises[index])
    }
    setExercises(updatedExercises)
  }

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        ...emptyExercise,
        id: uuidv4(),
      },
    ])
  }

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      const updatedExercises = [...exercises]
      updatedExercises.splice(index, 1)
      setExercises(updatedExercises)
    }
  }

  const toggleScheduleDay = (day: string) => {
    if (schedule.includes(day)) {
      setSchedule(schedule.filter((d) => d !== day))
    } else {
      setSchedule([...schedule, day])
    }
  }

  const calculateOverallIntensity = (): number => {
    if (exercises.length === 0) return 0
    const sum = exercises.reduce((acc, exercise) => acc + exercise.intensity, 0)
    return Math.round(sum / exercises.length)
  }

  const getIntensityLabel = (intensity: number): string => {
    if (intensity < 30) return "Low"
    if (intensity < 60) return "Medium"
    if (intensity < 85) return "High"
    return "Very High"
  }

  const estimateDuration = (): number => {
    return 10 + exercises.length * 5
  }

  const saveRoutine = async () => {
    setSaving(true)
    try {
      const routineData = {
        name: routineName || "Untitled Routine",
        category,
        difficulty,
        exercises,
        estimatedDuration: estimateDuration(),
        overallIntensity: calculateOverallIntensity(),
        schedule,
        createdAt: new Date().toISOString(),
      }

      if (editRoutineId) {
        await updateRoutine(editRoutineId, routineData)
        setEditRoutineId(null)
      } else {
        await createRoutine(routineData)
      }
      navigateTo("routines")
    } catch (err) {
      // Error is handled by context
    } finally {
      setSaving(false)
    }
  }

  const overallIntensity = calculateOverallIntensity()
  const intensityLabel = getIntensityLabel(overallIntensity)

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => {
            setEditRoutineId(null)
            navigateTo("routines")
          }}
          className="mr-4 p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{editRoutineId ? "Edit Routine" : "Create New Routine"}</h1>
          <p className="text-gray-600">Design your custom workout routine</p>
        </div>
        <button
          onClick={saveRoutine}
          disabled={saving}
          className="ml-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          {saving && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
          Save Routine
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-1">Routine Details</h2>
              <p className="text-sm text-gray-600 mb-4">Name and categorize your workout routine</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Routine Name</label>
                <input
                  type="text"
                  placeholder="e.g., Upper Body Strength"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Strength">Strength</option>
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Exercises</h2>
                  <p className="text-sm text-gray-600">Add exercises to your routine</p>
                </div>
                <button
                  onClick={addExercise}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Exercise
                </button>
              </div>

              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Exercise {index + 1}</h3>
                    {exercises.length > 1 && (
                      <button onClick={() => removeExercise(index)} className="text-red-500 hover:text-red-700">
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Bench Press"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, "name", e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                      <select
                        value={exercise.muscleGroup}
                        onChange={(e) => updateExercise(index, "muscleGroup", e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select muscle group</option>
                        <option value="Chest">Chest</option>
                        <option value="Back">Back</option>
                        <option value="Legs">Legs</option>
                        <option value="Shoulders">Shoulders</option>
                        <option value="Arms">Arms</option>
                        <option value="Core">Core</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                      <select
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                      <select
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", Number.parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          step="5"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, "weight", Number.parseInt(e.target.value))}
                          className="flex-grow mr-2"
                        />
                        <span className="w-8 text-right">{exercise.weight}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Intensity</label>
                      <span
                        className={`text-sm ${
                          exercise.intensity >= 85
                            ? "text-red-600"
                            : exercise.intensity >= 60
                              ? "text-orange-600"
                              : exercise.intensity >= 30
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      >
                        {getIntensityLabel(exercise.intensity)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          exercise.intensity >= 85
                            ? "bg-red-600"
                            : exercise.intensity >= 60
                              ? "bg-orange-500"
                              : exercise.intensity >= 30
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                        style={{ width: `${exercise.intensity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addExercise}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Another Exercise
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-1">Routine Summary</h2>
            <p className="text-sm text-gray-600 mb-6">Overview of your workout routine</p>
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 mb-1">Total Exercises</h3>
              <p className="text-2xl font-bold">{exercises.length}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 mb-1">Estimated Duration</h3>
              <p className="text-2xl font-bold">{estimateDuration()} min</p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm text-gray-600">Overall Intensity</h3>
                <span
                  className={`text-sm ${
                    overallIntensity >= 85
                      ? "text-red-600"
                      : overallIntensity >= 60
                        ? "text-orange-600"
                        : overallIntensity >= 30
                          ? "text-yellow-600"
                          : "text-green-600"
                  }`}
                >
                  {intensityLabel}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    overallIntensity >= 85
                      ? "bg-red-600"
                      : overallIntensity >= 60
                        ? "bg-orange-500"
                        : overallIntensity >= 30
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${overallIntensity}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-1">Schedule</h2>
            <p className="text-sm text-gray-600 mb-6">When to perform this routine</p>
            <div className="grid grid-cols-7 gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleScheduleDay(day)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    schedule.includes(day) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
