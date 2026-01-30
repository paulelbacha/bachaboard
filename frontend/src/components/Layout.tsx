import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import ThemeSelector from './ThemeSelector'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  if (!user) return null

  const isKittyTheme = user.theme === 'hello_kitty'
  const isPokemonTheme = user.theme === 'pokemon'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`
        ${isKittyTheme ? 'bg-kitty-pink border-kitty-hot-pink' : ''}
        ${isPokemonTheme ? 'bg-poke-yellow border-poke-red' : ''}
        ${!isKittyTheme && !isPokemonTheme ? 'bg-white border-gray-200' : ''}
        border-b-4 shadow-lg
      `}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`
              text-3xl font-bold
              ${isKittyTheme ? 'font-kitty text-kitty-red' : ''}
              ${isPokemonTheme ? 'font-pokemon text-poke-red' : ''}
              ${!isKittyTheme && !isPokemonTheme ? 'font-neutral text-neutral-primary' : ''}
            `}>
              BachaBoard
            </h1>

            <div className="flex items-center gap-4">
              <ThemeSelector />
              <span className="text-lg font-medium">Hi, {user.display_name}!</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`
        ${isKittyTheme ? 'bg-white border-kitty-pink' : ''}
        ${isPokemonTheme ? 'bg-white border-poke-blue' : ''}
        ${!isKittyTheme && !isPokemonTheme ? 'bg-white border-gray-200' : ''}
        border-b-2 shadow-sm
      `}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 py-2">
            <NavButton to="/" active={location.pathname === '/'} theme={user.theme}>
              🏠 Home
            </NavButton>
            <NavButton to="/create" active={location.pathname === '/create'} theme={user.theme}>
              ✍️ Create Post
            </NavButton>
            <NavButton to="/draw" active={location.pathname === '/draw'} theme={user.theme}>
              🎨 Draw
            </NavButton>
            <NavButton to="/profile" active={location.pathname === '/profile'} theme={user.theme}>
              👤 Profile
            </NavButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Feedback Button */}
      <FeedbackButton theme={user.theme} />
    </div>
  )
}

function NavButton({ to, active, theme, children }: {
  to: string
  active: boolean
  theme: string
  children: ReactNode
}) {
  const baseClasses = "px-6 py-3 rounded-lg text-lg font-medium transition-all"
  const themeClasses = {
    hello_kitty: active
      ? "bg-kitty-pink text-white"
      : "hover:bg-kitty-pink hover:bg-opacity-20 text-kitty-red",
    pokemon: active
      ? "bg-poke-blue text-white"
      : "hover:bg-poke-blue hover:bg-opacity-20 text-poke-blue",
    neutral: active
      ? "bg-neutral-primary text-white"
      : "hover:bg-neutral-primary hover:bg-opacity-10 text-neutral-primary"
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${themeClasses[theme as keyof typeof themeClasses]}`}
    >
      {children}
    </Link>
  )
}

function FeedbackButton({ theme }: { theme: string }) {
  const themeClasses = {
    hello_kitty: "bg-kitty-hot-pink hover:bg-kitty-red",
    pokemon: "bg-poke-red hover:bg-poke-blue",
    neutral: "bg-neutral-secondary hover:bg-neutral-primary"
  }

  return (
    <button
      className={`
        fixed bottom-8 right-8 p-4 rounded-full text-white shadow-lg
        transition-all hover:scale-110 z-50
        ${themeClasses[theme as keyof typeof themeClasses]}
      `}
      onClick={() => {
        // Will implement feedback modal later
        alert('Feedback feature coming soon! Tell us what characters you want!')
      }}
    >
      💬 Feedback
    </button>
  )
}