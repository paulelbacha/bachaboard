import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            BachaBoard
          </h1>
          <p className="text-gray-600 mt-2">Family Sharing Made Fun!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            🎨 Choose your theme after logging in!
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-2xl">🎀</span>
            <span className="text-2xl">⚡</span>
            <span className="text-2xl">🌟</span>
          </div>
        </div>
      </div>
    </div>
  )
}