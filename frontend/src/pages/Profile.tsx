import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

interface UserProfile {
  id: number
  username: string
  display_name: string
  theme: string
  avatar_url: string | null
  is_following: boolean
  followers_count: number
  following_count: number
}

export default function Profile() {
  const { user } = useAuthStore()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users/')
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFollow = async (userId: number) => {
    try {
      await axios.post(`/users/${userId}/follow`)
      fetchUsers() // Refresh list
    } catch (error) {
      console.error('Failed to follow/unfollow:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl animate-bounce">Loading...</div>
      </div>
    )
  }

  const currentUser = users.find(u => u.id === user?.id)
  const otherUsers = users.filter(u => u.id !== user?.id)

  return (
    <div className="space-y-6">
      {/* Current user profile */}
      {currentUser && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
              {currentUser.display_name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{currentUser.display_name}</h3>
              <p className="text-gray-600">@{currentUser.username}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm">
                  <strong>{currentUser.followers_count}</strong> followers
                </span>
                <span className="text-sm">
                  <strong>{currentUser.following_count}</strong> following
                </span>
              </div>
              <div className="mt-3">
                <span className="px-3 py-1 bg-white rounded-full text-sm">
                  Theme: {currentUser.theme.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other users */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Family Members</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {otherUsers.map(user => (
            <div key={user.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white text-xl font-bold">
                    {user.display_name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.display_name}</h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-xs text-gray-500">
                      Theme: {user.theme.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    user.is_following
                      ? 'bg-gray-200 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {user.is_following ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}