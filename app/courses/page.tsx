import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { config } from '@/lib/config'
import { getDemoData } from '@/lib/demo-data'
import { Course } from '@/lib/types'

export default async function CoursesPage() {
  let courses: Course[] = []
  
  if (config.isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient()
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Available Courses
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from our collection of interactive learning courses designed to help you master new skills.
        </p>
        {config.isDemoMode() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              🎯 <strong>Demo Mode:</strong> Showing sample courses. Set up Supabase for real data.
            </p>
          </div>
        )}
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {course.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description || 'No description available'}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created {new Date(course.created_at).toLocaleDateString()}
                </span>
                
                <Link 
                  href={`/courses/${course.id}`}
                  className="btn btn-primary"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses available
          </h3>
          <p className="text-gray-600">
            Check back later for new learning content.
          </p>
        </div>
      )}
    </div>
  )
}
