import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import { useAuthStore } from '../stores/authStore'

interface Post {
  id: number
  author_id: number
  author_name: string
  author_avatar: string | null
  post_type: 'text' | 'photo' | 'drawing'
  content: string | null
  media_url: string | null
  created_at: string
  comments_count: number
  reactions: { emoji: string; count: number }[]
  user_reaction: string | null
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts/feed')
      setPosts(response.data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReaction = async (postId: number, emoji: string) => {
    try {
      await axios.post(`/posts/${postId}/react`, { emoji })
      fetchPosts() // Refresh feed
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl animate-bounce">Loading posts...</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">No posts yet!</h2>
        <p className="text-gray-500">Be the first to share something!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onReaction={handleReaction}
          currentUserTheme={user?.theme || 'neutral'}
        />
      ))}
    </div>
  )
}