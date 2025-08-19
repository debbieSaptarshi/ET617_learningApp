'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { trackClick } from '@/lib/event-tracking'

export default function Header() {
  const { user, signOut, isDemoMode } = useAuth()

  const handleSignOut = async () => {
    if (!isDemoMode) {
      await signOut()
    }
    trackClick('header-signout', 'button')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600" onClick={() => trackClick('header-logo', 'link')}>
            Learning LMS
          </Link>
          
          {isDemoMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
              <span className="text-blue-800 text-sm font-medium">Demo Mode</span>
            </div>
          )}
          
          <nav className="flex items-center space-x-6">
            <Link href="/courses" className="text-gray-600 hover:text-primary-600 transition-colors" onClick={() => trackClick('nav-courses', 'link')}>
              Courses
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors" onClick={() => trackClick('nav-dashboard', 'link')}>
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {isDemoMode ? (
                  <span className="text-sm text-gray-500">
                    Sign in not available in demo mode
                  </span>
                ) : (
                  <>
                    <Link href="/auth/signin" className="text-gray-600 hover:text-primary-600 transition-colors" onClick={() => trackClick('nav-signin', 'link')}>
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="btn btn-primary" onClick={() => trackClick('nav-signup', 'button')}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
