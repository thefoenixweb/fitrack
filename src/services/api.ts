// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || "fittrackapi-aec8d4a4fngnddev.canadacentral-01.azurewebsites.net/api"

console.log("API Base URL:", API_BASE_URL)

export class ApiError extends Error {
  public status: number;
  constructor(
    status: number,
    message: string,
  ) {
    super(message)
    this.status = status;
    this.name = "ApiError"
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const errorText = await response.text()
      if (errorText) {
        errorMessage = errorText
      }
    } catch {
      // If we can't read the error text, use the status
    }
    throw new ApiError(response.status, errorMessage)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }
  return response.text()
}

const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`Making request to: ${url}`)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error(`Request failed for ${url}:`, error)
    if (error instanceof ApiError) {
      throw error
    }
    // Network error or other fetch error
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// User API
export const usersApi = {
  getUsers: async () => {
    return makeRequest("/users")
  },

  getUser: async (id: string) => {
    return makeRequest(`/users/${id}`)
  },

  createUser: async (userData: any) => {
    return makeRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  updateUser: async (id: string, userData: any) => {
    return makeRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },
}

// Keep the old userApi for backward compatibility
export const userApi = usersApi

// Routines API
export const routinesApi = {
  // Added userId parameter to getRoutines and getRoutine
  getRoutines: async (userId: string) => {
    return makeRequest(`/routines?userId=${userId}`)
  },

  getRoutine: async (id: string, userId: string) => {
    return makeRequest(`/routines/${id}?userId=${userId}`)
  },

  // Added userId parameter to createRoutine
  createRoutine: async (routineData: any, userId: string) => {
    return makeRequest(`/routines?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify(routineData),
    })
  },

  // Added userId parameter to updateRoutine
  updateRoutine: async (id: string, routineData: any, userId: string) => {
    return makeRequest(`/routines/${id}?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(routineData),
    })
  },

  // Added userId parameter to deleteRoutine
  deleteRoutine: async (id: string, userId: string) => {
    return makeRequest(`/routines/${id}?userId=${userId}`, {
      method: "DELETE",
    })
  },
}

// Workout History API
export const workoutHistoryApi = {
  // Added userId parameter to getWorkoutHistory
  getWorkoutHistory: async (userId: string) => {
    return makeRequest(`/workouthistory?userId=${userId}`)
  },

  // Added userId parameter to createWorkoutHistory
  createWorkoutHistory: async (workoutData: any, userId: string) => {
    return makeRequest(`/workouthistory?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify(workoutData),
    })
  },

  // Added userId parameter to updateWorkoutHistory
  updateWorkoutHistory: async (id: string, workoutData: any, userId: string) => {
    return makeRequest(`/workouthistory/${id}?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(workoutData),
    })
  },

  // Added userId parameter to deleteWorkoutHistory
  deleteWorkoutHistory: async (id: string, userId: string) => {
    return makeRequest(`/workouthistory/${id}?userId=${userId}`, {
      method: "DELETE",
    })
  },
}

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
    })
    return response.ok
  } catch {
    return false
  }
}