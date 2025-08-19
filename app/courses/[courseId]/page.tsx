import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { config } from '@/lib/config'
import { getDemoData } from '@/lib/demo-data'
import { Course, Lesson } from '@/lib/types'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  let course: Course | null = null
  let lessons: Lesson[] = []
  
  if (config.isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient()
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.courseId)
        .eq('is_published', true)
        .single()

      if (courseError || !courseData) {
        notFound()
      }

      course = courseData

      // Fetch lessons for this course
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', params.courseId)
        .order('order_index')
      
      lessons = lessonsData || []
    } catch (error) {
      console.warn('Supabase connection failed, falling back to demo mode:', error)
      course = getDemoData.courses().find(c => c.id === params.courseId) || null
      if (course) {
        lessons = getDemoData.lessons(params.courseId)
      }
    }
  } else {
    // Demo mode - use demo data
    course = getDemoData.courses().find(c => c.id === params.courseId) || null
    if (course) {
      lessons = getDemoData.lessons(params.courseId)
    }
  }

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {course.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {course.description || 'No description available'}
        </p>
        
        {config.isDemoMode() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm">
              🎯 <strong>Demo Mode:</strong> Showing sample course data. Set up Supabase for real content.
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span>
            {lessons?.length || 0} lessons
          </span>
          <span>
            Created {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Course Content
        </h2>
        
        {lessons && lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson: Lesson, index: number) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        {lesson.video_provider && (
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Video</span>
                          </span>
                        )}
                        {lesson.content_richtext && (
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>Content</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/courses/${params.courseId}/lessons/${lesson.id}`}
                    className="btn btn-primary"
                  >
                    {index === 0 ? 'Start Lesson' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons available
            </h3>
            <p className="text-gray-600">
              This course doesn't have any lessons yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
