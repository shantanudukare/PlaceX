import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // backend uses httpOnly cookie auth
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize backend errors: { success:false, message }
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed'

    return Promise.reject(
      new Error(msg)
    )
  }
)

