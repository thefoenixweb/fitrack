"use client"
import { PlusIcon, ChevronRightIcon, DatabaseIcon, CloudIcon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { formatDate } from "../utils/helpers"

interface DashboardProps {
  navigateTo: (page: string) => void
}

export function Dashboard({ navigateTo }: DashboardProps) {
  const {
    userName,
    routines,
    workoutHistory,
    loading,
    error,
    apiConnected,
    useMockData,
    setUseMockData,
    refreshData,
    clearError,
  } = useAppContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your fitness data...</p>
        </div>
      </div>
    )
  }

  if (error && !useMockData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Connection Error</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 whitespace-pre-line">{error}</p>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  clearError()
                  refreshData()
                }}
                className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry Connection
              </button>
              <button
                onClick={() => {
                  clearError()
                  setUseMockData(true)
                }}
                className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Use Mock Data Instead
              </button>
              <div className="text-xs text-gray-400">
                API Status: {apiConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalWorkouts = workoutHistory.length
  const totalRoutines = routines.length
  const recentWorkouts = workoutHistory.slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userName.split(" ")[0]}!</h1>
          <p className="text-gray-600">Track your progress and manage your workout routines</p>
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              {useMockData ? (
                <>
                  <DatabaseIcon className="h-4 w-4 mr-1" />
                  <span>Mock Data Mode</span>
                </>
              ) : (
                <>
                  <CloudIcon className="h-4 w-4 mr-1" />
                  <span className={apiConnected ? "text-green-600" : "text-red-600"}>
                    {apiConnected ? "API Connected" : "API Disconnected"}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => setUseMockData(!useMockData)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {useMockData ? "Switch to API" : "Switch to Mock Data"}
            </button>
          </div>
        </div>
        <button
          onClick={() => navigateTo("create-routine")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Routine
        </button>
      </div>

      {/* Data Source Banner */}
      <div
        className={`rounded-lg p-4 ${useMockData ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"}`}
      >
        <div className="flex items-center">
          {useMockData ? (
            <DatabaseIcon className="h-5 w-5 text-blue-600 mr-2" />
          ) : (
            <CloudIcon className="h-5 w-5 text-green-600 mr-2" />
          )}
          <div>
            <h3 className={`text-sm font-medium ${useMockData ? "text-blue-800" : "text-green-800"}`}>
              {useMockData ? "Using Mock Data" : "Connected to API"}
            </h3>
            <p className={`text-xs ${useMockData ? "text-blue-600" : "text-green-600"}`}>
              {useMockData
                ? "Preview mode with sample data. Switch to API to use real database."
                : "Live data from your FitTrack API with seeded user profile."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Routines</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRoutines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Workouts</p>
              <p className="text-2xl font-semibold text-gray-900">{totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  workoutHistory.filter((w) => {
                    const workoutDate = new Date(w.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return workoutDate >= weekAgo
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-1">Workout Intensity</h2>
        <p className="text-sm text-gray-600 mb-4">Your workout intensity over the past 7 days</p>
        <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center">
          <p className="text-gray-400">Intensity chart will appear here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium mb-4">Recent Workouts</h2>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <p>No recent workouts found.</p>
                <p className="text-sm mt-1">Start a workout to see your progress here!</p>
              </div>
            ) : (
              recentWorkouts.map((workout) => (
                <div key={workout.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                        {new Date(workout.date).getDate()}
                      </div>
                      <div>
                        <h3 className="font-medium">{workout.routineName}</h3>
                        <p className="text-sm text-gray-600">{formatDate(workout.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-sm ${
                          workout.intensity === "High" || workout.intensity === "Very High"
                            ? "text-red-600"
                            : workout.intensity === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {workout.intensity}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{workout.duration} min</span>
                      <ChevronRightIcon className="h-5 w-5 ml-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <button
              onClick={() => navigateTo("create-routine")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Routine
            </button>

            <button
              onClick={() => navigateTo("routines")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center"
            >
              View All Routines
            </button>

            <button
              onClick={() => navigateTo("history")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center"
            >
              View Workout History
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={() => navigateTo("history")} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All History
        </button>
      </div>
    </div>
  )
}
