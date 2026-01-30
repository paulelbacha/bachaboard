import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

export default function CreatePost() {
  const [postType, setPostType] = useState<'text' | 'photo'>('text')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        setPostType('photo')
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content && !imageFile) {
      alert('Please add some content or an image!')
      return
    }

    setIsSubmitting(true)

    try {
      let mediaUrl = null

      // Upload image if present
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadResponse = await axios.post('/posts/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        mediaUrl = uploadResponse.data.url
      }

      // Create post
      await axios.post('/posts/', {
        post_type: postType,
        content: content || null,
        media_url: mediaUrl
      })

      navigate('/')
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (!content) setPostType('text')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post type selector */}
        <div className="card">
          <h3 className="font-semibold mb-3">What would you like to share?</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                postType === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              ✍️ Text
            </button>
            <button
              type="button"
              onClick={() => setPostType('photo')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                postType === 'photo'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              📷 Photo
            </button>
            <button
              type="button"
              onClick={() => navigate('/draw')}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
            >
              🎨 Draw
            </button>
          </div>
        </div>

        {/* Text content */}
        <div className="card">
          <label className="block font-semibold mb-3">
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            rows={4}
          />
        </div>

        {/* Image upload */}
        {postType === 'photo' && (
          <div className="card">
            <label className="block font-semibold mb-3">
              Add a Photo
            </label>

            {!imagePreview ? (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600">
                  Drag & drop a photo here, or click to select
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!content && !imageFile)}
            className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Share Post'}
          </button>
        </div>
      </form>
    </div>
  )
}