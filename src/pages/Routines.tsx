"use client"

import { useState } from "react"
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, Loader2Icon } from "lucide-react"
import { useAppContext } from "../context/AppContext"

interface RoutinesProps {
  navigateTo: (page: string) => void
  setEditRoutineId: (id: string | null) => void
}

export function Routines({ navigateTo, setEditRoutineId }: RoutinesProps) {
  const { routines, deleteRoutine, loading, error } = useAppContext()

  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this routine?")) {
      setDeletingId(id)
      try {
        await deleteRoutine(id)
      } catch (err) {
        console.error("Failed to delete routine:", err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleEdit = (id: string) => {
    setEditRoutineId(id)
    navigateTo("create-routine")
  }

  const filteredRoutines = routines.filter((routine) => {
    const matchesSearch = routine.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === "all") return matchesSearch
    if (filter === "recent")
      return matchesSearch && new Date(routine.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (filter === "favorites") return matchesSearch && routine.isFavorite
    return matchesSearch
  })

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
          <h1 className="text-2xl font-bold">Workout Routines</h1>
          <p className="text-gray-600">Create and manage your workout routines</p>
        </div>
        <button
          onClick={() => navigateTo("create-routine")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Routine
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search routines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex bg-gray-100 rounded-md p-1">
          <button
            className={`px-4 py-1 rounded-md ${filter === "all" ? "bg-white shadow" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-1 rounded-md ${filter === "recent" ? "bg-white shadow" : ""}`}
            onClick={() => setFilter("recent")}
          >
            Recent
          </button>
          <button
            className={`px-4 py-1 rounded-md ${filter === "favorites" ? "bg-white shadow" : ""}`}
            onClick={() => setFilter("favorites")}
          >
            Favorites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold text-lg">{routine.name}</h3>
              <p className="text-sm text-gray-600">{routine.exercises.length} exercises</p>
              <div className="mt-4 space-y-2">
                {routine.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex justify-between items-center">
                    <span className="text-sm">{exercise.name}</span>
                    <span className="text-sm text-gray-600">
                      {exercise.sets} × {exercise.reps}
                    </span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <p className="text-sm text-gray-500">+{routine.exercises.length - 3} more exercises</p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-between">
              <button
                onClick={() => handleEdit(routine.id)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(routine.id)}
                disabled={deletingId === routine.id}
                className="flex items-center text-gray-700 hover:text-red-600 disabled:opacity-50"
              >
                {deletingId === routine.id ? (
                  <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4 mr-1" />
                )}
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="bg-gray-100 rounded-full p-3 mb-4">
            <PlusIcon className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="font-medium mb-2">Create New Routine</h3>
          <p className="text-sm text-gray-500 mb-4">Design your custom workout routine</p>
          <button
            onClick={() => navigateTo("create-routine")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
