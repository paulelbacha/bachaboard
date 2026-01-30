import { useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios'

interface PostProps {
  post: {
    id: number
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
  onReaction: (postId: number, emoji: string) => void
  currentUserTheme: string
}

export default function PostCard({ post, onReaction, currentUserTheme }: PostProps) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])

  const reactionEmojis = {
    hello_kitty: ['💖', '🎀', '🌸', '⭐', '🦄'],
    pokemon: ['⚡', '🔥', '💧', '🌟', '🎯'],
    neutral: ['👍', '❤️', '😊', '🎉', '✨']
  }

  const availableEmojis = reactionEmojis[currentUserTheme as keyof typeof reactionEmojis]

  const loadComments = async () => {
    if (!showComments) {
      try {
        const response = await axios.get(`/posts/${post.id}/comments`)
        setComments(response.data)
      } catch (error) {
        console.error('Failed to load comments:', error)
      }
    }
    setShowComments(!showComments)
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      await axios.post(`/posts/${post.id}/comment`, { content: comment })
      setComment('')
      // Reload comments
      const response = await axios.get(`/posts/${post.id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  return (
    <div className="card">
      {/* Author info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
          {post.author_avatar ? (
            <img src={post.author_avatar} alt={post.author_name} className="rounded-full" />
          ) : (
            post.author_name[0].toUpperCase()
          )}
        </div>
        <div>
          <h3 className="font-semibold">{post.author_name}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(post.created_at), 'MMM d, h:mm a')}
          </p>
        </div>
      </div>

      {/* Post content */}
      {post.content && (
        <p className="text-lg mb-4">{post.content}</p>
      )}

      {post.media_url && (
        <img
          src={post.media_url}
          alt="Post media"
          className="rounded-lg mb-4 max-w-full"
        />
      )}

      {/* Reactions */}
      <div className="flex items-center gap-2 mb-4">
        {availableEmojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => onReaction(post.id, emoji)}
            className={`
              px-3 py-2 rounded-lg transition-all text-xl
              ${post.user_reaction === emoji
                ? 'bg-blue-100 scale-110'
                : 'hover:bg-gray-100'
              }
            `}
          >
            {emoji}
            {post.reactions.find(r => r.emoji === emoji) && (
              <span className="ml-1 text-sm">
                {post.reactions.find(r => r.emoji === emoji)?.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Comments section */}
      <div className="border-t pt-4">
        <button
          onClick={loadComments}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          {showComments ? 'Hide' : 'Show'} Comments ({post.comments_count})
        </button>

        {showComments && (
          <div className="mt-4 space-y-3">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.author_name}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}

            <form onSubmit={submitComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}