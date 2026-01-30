import { useRef, useState, useEffect } from 'react'
import CanvasDraw from 'react-canvas-draw'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Draw() {
  const canvasRef = useRef<any>(null)
  const [color, setColor] = useState('#000000')
  const [brushRadius, setBrushRadius] = useState(5)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      autoSave()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const autoSave = () => {
    if (canvasRef.current) {
      const drawingData = canvasRef.current.getSaveData()
      localStorage.setItem('drawingAutoSave', drawingData)
      // Could also send to backend
      console.log('Drawing auto-saved')
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear()
      localStorage.removeItem('drawingAutoSave')
    }
  }

  const undoLast = () => {
    if (canvasRef.current) {
      canvasRef.current.undo()
    }
  }

  const saveDrawing = async () => {
    if (!canvasRef.current) return

    setIsSaving(true)
    try {
      // Get canvas data
      const drawingData = canvasRef.current.getSaveData()
      const canvas = canvasRef.current.canvasContainer.children[1]
      const imageData = canvas.toDataURL()

      // Save drawing
      const response = await axios.post('/drawings/save', {
        drawing_data: drawingData,
        image_data: imageData
      })

      // Create post with drawing
      await axios.post('/posts/', {
        post_type: 'drawing',
        media_url: response.data.image_url,
        drawing_data: drawingData
      })

      // Clear auto-save and navigate to feed
      localStorage.removeItem('drawingAutoSave')
      navigate('/')
    } catch (error) {
      console.error('Failed to save drawing:', error)
      alert('Failed to save drawing. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Load auto-saved drawing on mount
  useEffect(() => {
    const savedDrawing = localStorage.getItem('drawingAutoSave')
    if (savedDrawing && canvasRef.current) {
      canvasRef.current.loadSaveData(savedDrawing)
    }
  }, [])

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#8B4513', '#808080'
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Draw Something!</h1>

      {/* Tools */}
      <div className="card flex flex-wrap gap-4 items-center">
        {/* Color picker */}
        <div className="flex gap-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-lg border-2 ${
                color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushRadius}
            onChange={(e) => setBrushRadius(Number(e.target.value))}
            className="w-32"
          />
          <span className="w-8 text-center">{brushRadius}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={undoLast}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ↶ Undo
          </button>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="card">
        <div className="border-4 border-gray-200 rounded-lg overflow-hidden">
          <CanvasDraw
            ref={canvasRef}
            brushColor={color}
            brushRadius={brushRadius}
            canvasWidth={800}
            canvasHeight={500}
            lazyRadius={0}
            hideGrid={true}
            backgroundColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          ✨ Your drawing auto-saves every 30 seconds
        </p>
        <button
          onClick={saveDrawing}
          disabled={isSaving}
          className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : '📤 Share Drawing'}
        </button>
      </div>
    </div>
  )
}