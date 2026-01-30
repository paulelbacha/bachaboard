import { useAuthStore } from '../stores/authStore'

export default function ThemeSelector() {
  const { user, updateTheme } = useAuthStore()

  if (!user) return null

  const themes = [
    { value: 'hello_kitty', label: '🎀 Hello Kitty', color: 'bg-kitty-pink' },
    { value: 'pokemon', label: '⚡ Pokemon', color: 'bg-poke-yellow' },
    { value: 'neutral', label: '🌟 Neutral', color: 'bg-neutral-primary' }
  ]

  return (
    <div className="flex gap-2">
      {themes.map(theme => (
        <button
          key={theme.value}
          onClick={() => updateTheme(theme.value as any)}
          className={`
            px-3 py-1 rounded-lg text-sm font-medium transition-all
            ${user.theme === theme.value
              ? `${theme.color} text-white scale-110`
              : 'bg-gray-200 hover:bg-gray-300'
            }
          `}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}