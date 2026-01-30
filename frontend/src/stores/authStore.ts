import { create } from 'zustand'
import axios from 'axios'

interface User {
  id: number
  username: string
  display_name: string
  theme: 'hello_kitty' | 'pokemon' | 'neutral'
  avatar_url: string | null
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  updateTheme: (theme: 'hello_kitty' | 'pokemon' | 'neutral') => void
}

// Set up axios defaults
axios.defaults.baseURL = '/api'

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const response = await axios.post('/auth/login', formData)
      const { access_token, user } = response.data

      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      set({
        user,
        token: access_token,
        isLoading: false
      })
    } catch (error) {
      set({
        error: 'Invalid username or password',
        isLoading: false
      })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },

  checkAuth: () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Fetch user data
      axios.get('/auth/me')
        .then(response => {
          set({ user: response.data, token })
        })
        .catch(() => {
          get().logout()
        })
    }
  },

  updateTheme: async (theme) => {
    try {
      await axios.put('/users/me', { theme })
      set(state => ({
        user: state.user ? { ...state.user, theme } : null
      }))
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }
}))