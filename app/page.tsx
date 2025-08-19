import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { config } from '@/lib/config'
import { getDemoData } from '@/lib/demo-data'
import { Course } from '@/lib/types'

export default async function HomePage() {
  let courses: Course[] = []
  
  if (config.isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient()
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6)
      courses = data || []
    } catch (error) {
      console.warn('Supabase connection failed, falling back to demo mode:', error)
      courses = getDemoData.courses()
    }
  } else {
    // Demo mode - use demo data
    courses = getDemoData.courses()
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Learning LMS
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master new skills with our interactive learning platform. 
          Track your progress, take quizzes, and learn at your own pace.
        </p>
        {config.isDemoMode() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              🎯 <strong>Demo Mode:</strong> This application is running with sample data. 
              Set up Supabase to enable full functionality including user authentication and data persistence.
            </p>
          </div>
        )}
        <div className="flex justify-center space-x-4">
          <Link 
            href="/courses" 
            className="btn btn-primary text-lg px-8 py-3"
          >
            Browse Courses
          </Link>
          <Link 
            href="/auth/signup" 
            className="btn btn-secondary text-lg px-8 py-3"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Courses
        </h2>
        
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course) => (
              <div key={course.id} className="card hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {course.description || 'No description available'}
                </p>
                <Link 
                  href={`/courses/${course.id}`}
                  className="btn btn-primary w-full"
                >
                  Start Learning
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No courses available at the moment.</p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Content
          </h3>
          <p className="text-gray-600">
            Learn with rich text, videos, and interactive quizzes
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Progress Tracking
          </h3>
          <p className="text-gray-600">
            Monitor your learning progress and quiz results
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fast & Responsive
          </h3>
          <p className="text-gray-600">
            Built with modern technologies for the best experience
          </p>
        </div>
      </section>
    </div>
  )
}
