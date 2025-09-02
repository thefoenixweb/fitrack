"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, Loader2Icon } from "lucide-react"
import { useAppContext } from "../context/AppContext"

export function History() {
  const { workoutHistory, setWorkoutHistory, loading, error } = useAppContext()

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const toggleExpand = (id: string) => {
    setWorkoutHistory(
      workoutHistory.map((workout) => (workout.id === id ? { ...workout, expanded: !workout.expanded } : workout)),
    )
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const prevMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
  }

  const nextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
  }

  // Calculate monthly stats
  const monthlyWorkouts = workoutHistory.filter((workout) => {
    const workoutDate = new Date(workout.date)
    return (
      workoutDate.getMonth() === currentMonth.getMonth() && workoutDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  const totalWorkouts = monthlyWorkouts.length
  const totalExercises = monthlyWorkouts.reduce((sum, workout) => sum + (workout.exercises?.length || 0), 0)
  const totalMinutes = monthlyWorkouts.reduce((sum, workout) => sum + workout.duration, 0)

  const avgIntensity =
    totalWorkouts > 0
      ? Math.round(
          monthlyWorkouts.reduce((sum, workout) => {
            const intensityMap: { [key: string]: number } = {
              Low: 25,
              Medium: 50,
              High: 75,
              "Very High": 100,
            }
            return sum + (intensityMap[workout.intensity] || 0)
          }, 0) / totalWorkouts,
        )
      : 0

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  // Find most used routine
  const routineCounts: { [key: string]: number } = {}
  monthlyWorkouts.forEach((workout) => {
    routineCounts[workout.routineName] = (routineCounts[workout.routineName] || 0) + 1
  })

  let mostUsedRoutine = { name: "None", count: 0 }
  Object.entries(routineCounts).forEach(([name, count]) => {
    if (count > mostUsedRoutine.count) {
      mostUsedRoutine = { name, count }
    }
  })

  // Generate calendar days
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay()
  const calendarDays = []

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Workout dates in current month
  const workoutDates = monthlyWorkouts.map((workout) => new Date(workout.date).getDate())

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2Icon className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workout History</h1>
          <p className="text-gray-600">View and analyze your past workouts</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-gray-100">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {monthName} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-gray-100">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Recent Workouts</h2>
              <p className="text-sm text-gray-600">Your workout history for the past 30 days</p>
            </div>
            <div className="divide-y divide-gray-200">
              {workoutHistory.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No workout history found. Start working out to see your progress here!</p>
                </div>
              ) : (
                workoutHistory.map((workout) => (
                  <div key={workout.id} className="px-6 py-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(workout.id)}
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          {new Date(workout.date).getDate()}
                        </div>
                        <div>
                          <h3 className="font-medium">{workout.routineName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(workout.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`mr-4 ${
                            workout.intensity === "High" || workout.intensity === "Very High"
                              ? "text-red-600"
                              : workout.intensity === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {workout.intensity}
                        </span>
                        <span className="text-sm text-gray-500 mr-6">{workout.duration} min</span>
                        {workout.expanded ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {workout.expanded && workout.exercises && (
                      <div className="mt-4 ml-14">
                        <h4 className="font-medium text-sm mb-2">Exercises</h4>
                        <div className="space-y-2">
                          {workout.exercises.map((exercise) => (
                            <div key={exercise.id} className="flex justify-between text-sm">
                              <span>{exercise.name}</span>
                              <span className="text-gray-600">
                                {exercise.sets} × {exercise.reps} @ {exercise.weight} lbs
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-1">Monthly Stats</h2>
            <p className="text-sm text-gray-600 mb-6">
              Your workout statistics for {monthName} {year}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm text-gray-600 mb-1">Workouts</h3>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm text-gray-600 mb-1">Avg. Intensity</h3>
                <p className="text-2xl font-bold">{avgIntensity}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm text-gray-600 mb-1">Total Time</h3>
                <p className="text-2xl font-bold">
                  {hours}h {minutes}m
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm text-gray-600 mb-1">Exercises</h3>
                <p className="text-2xl font-bold">{totalExercises}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm text-gray-600 mb-2">Most Used Routine</h3>
              <div className="flex justify-between items-center">
                <p className="font-medium">{mostUsedRoutine.name}</p>
                <span className="text-sm text-gray-600">{mostUsedRoutine.count} times</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-1">Calendar</h2>
            <p className="text-sm text-gray-600 mb-6">Your workout days this month</p>
            <div className="grid grid-cols-7 gap-1 text-center">
              <div className="text-xs text-gray-500">S</div>
              <div className="text-xs text-gray-500">M</div>
              <div className="text-xs text-gray-500">T</div>
              <div className="text-xs text-gray-500">W</div>
              <div className="text-xs text-gray-500">T</div>
              <div className="text-xs text-gray-500">F</div>
              <div className="text-xs text-gray-500">S</div>
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 flex items-center justify-center text-sm rounded-full mx-auto ${
                    day === null ? "" : workoutDates.includes(day) ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
