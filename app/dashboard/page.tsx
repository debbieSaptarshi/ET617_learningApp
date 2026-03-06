import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { config } from '@/lib/config'
import { QuizAttempt } from '@/lib/types'
import Link from 'next/link'

export default async function DashboardPage() {
  // In demo mode, redirect to home since we can't authenticate
  if (config.isDemoMode()) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo Mode Active
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            This dashboard requires user authentication and a Supabase database connection. 
            Currently running in demo mode with sample data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              🎯 <strong>To enable full functionality:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 text-left max-w-md mx-auto">
              <li>• Set up a Supabase project</li>
              <li>• Configure environment variables</li>
              <li>• Run the database schema</li>
              <li>• Create a user account</li>
            </ul>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="btn btn-primary">
              Browse Courses
            </Link>
            <Link href="/courses" className="btn btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Real Supabase mode - authenticate user
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/signin')
  }

  // Fetch user's quiz attempts
  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes (
        title,
        lessons (
          title,
          courses (
            title
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name || user.email}!
        </h1>
        <p className="text-gray-600">
          Track your learning progress and continue your educational journey.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/courses"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Courses</h3>
          <p className="text-gray-600">Discover new learning opportunities</p>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Progress</h3>
          <p className="text-gray-600">Track your learning achievements</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Results</h3>
          <p className="text-gray-600">Review your quiz performance</p>
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Quiz Attempts</h2>
        
        {quizAttempts && quizAttempts.length > 0 ? (
          <div className="space-y-4">
            {quizAttempts.map((attempt: any) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {attempt.quizzes?.title || 'Unknown Quiz'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {attempt.quizzes?.lessons?.courses?.title || 'Unknown Course'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    attempt.passed ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {attempt.score_percent}%
                  </div>
                  <div className={`text-sm ${
                    attempt.passed ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {attempt.passed ? 'Passed' : 'Failed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quiz attempts yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start learning to see your quiz results here.
            </p>
            <Link href="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {quizAttempts?.length || 0}
          </div>
          <div className="text-gray-600">Quizzes Taken</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {quizAttempts?.filter((a: any) => a.passed).length || 0}
          </div>
          <div className="text-gray-600">Quizzes Passed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {(quizAttempts?.length ?? 0) > 0
              ? Math.round(quizAttempts!.filter((a: any) => a.passed).length / quizAttempts!.length * 100)
              : 0
            }%
          </div>
          <div className="text-gray-600">Success Rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {(quizAttempts?.length ?? 0) > 0
              ? Math.round(quizAttempts!.reduce((sum: number, a: any) => sum + (a.score_percent || 0), 0) / quizAttempts!.length)
              : 0
            }%
          </div>
          <div className="text-gray-600">Average Score</div>
        </div>
      </div>
    </div>
  )
}
