'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import { trackEvent } from '@/lib/event-tracking'
import { config } from '@/lib/config'
import { getDemoData } from '@/lib/demo-data'
import VideoPlayer from '@/components/VideoPlayer'
import Quiz from '@/components/Quiz'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

interface LessonData {
  id: string
  title: string
  content_richtext?: string
  video_provider?: string
  video_ref?: string
}

interface QuizData {
  id: string
  title: string
  description: string
  passing_score: number
  questions: any[]
}

export default function LessonPage({ params }: LessonPageProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  useEffect(() => {
    fetchLessonData()
  }, [params.lessonId])

  const fetchLessonData = async () => {
    try {
      if (config.isSupabaseConfigured()) {
        // Try to fetch from Supabase
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', params.lessonId)
          .single()

        if (lessonError) {
          throw lessonError
        }

        setLesson(lessonData)

        // Fetch associated quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select(`
            *,
            quiz_questions (
              *,
              quiz_options (*)
            )
          `)
          .eq('lesson_id', params.lessonId)
          .single()

        if (!quizError && quizData) {
          setQuiz(quizData)
        }

        // Track lesson view if user is authenticated
        if (user) {
          trackEvent('lesson_view', {
            lesson_id: params.lessonId,
            course_id: params.courseId
          })
        }
      } else {
        // Demo mode - use demo data
        const demoLesson = getDemoData.lessons(params.courseId).find(l => l.id === params.lessonId)
        if (!demoLesson) {
          throw new Error('Lesson not found')
        }
        setLesson(demoLesson)

        const demoQuiz = getDemoData.quiz(params.lessonId)
        if (demoQuiz) {
          setQuiz(demoQuiz)
        }
      }
    } catch (err: any) {
      console.error('Error fetching lesson data:', err)
      setError(err.message || 'Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (result: any) => {
    setQuizResult(result)
    setShowQuiz(false)
    
    if (user) {
      trackEvent('quiz_completed', {
        quiz_id: quiz?.id,
        lesson_id: params.lessonId,
        course_id: params.courseId,
        score: result.score_percent,
        passed: result.passed
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading lesson
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href={`/courses/${params.courseId}`} className="btn btn-primary">
          Back to Course
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {lesson.title}
        </h1>
        
        {config.isDemoMode() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm">
              🎯 <strong>Demo Mode:</strong> This is sample lesson content. Set up Supabase for real lessons.
            </p>
          </div>
        )}
      </div>

      {/* Rich Text Content */}
      {lesson.content_richtext && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Content</h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content_richtext}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Video Player */}
      {lesson.video_provider === 'youtube' && lesson.video_ref && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Lesson</h2>
          <VideoPlayer 
            videoRef={lesson.video_ref} 
            lessonId={lesson.id} 
          />
        </div>
      )}

      {/* Quiz */}
      {quiz && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {quiz.description}
          </p>
          
          {!showQuiz && !quizResult && (
            <button
              onClick={() => setShowQuiz(true)}
              className="btn btn-primary"
            >
              Start Quiz
            </button>
          )}
          
          {showQuiz && (
            <Quiz
              quizId={quiz.id}
              questions={quiz.questions}
              onComplete={handleQuizComplete}
            />
          )}
        </div>
      )}

      {/* Quiz Results */}
      {quizResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Results</h2>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${
              quizResult.passed ? 'text-success-600' : 'text-error-600'
            }`}>
              {quizResult.score_percent}%
            </div>
            <div className={`text-xl font-semibold mb-4 ${
              quizResult.passed ? 'text-success-600' : 'text-error-600'
            }`}>
              {quizResult.passed ? 'Passed!' : 'Failed'}
            </div>
            <p className="text-gray-600">
              You answered {quizResult.answers.filter((a: any) => a.is_correct).length} out of {quizResult.answers.length} questions correctly.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Link 
          href={`/courses/${params.courseId}`}
          className="btn btn-secondary"
        >
          ← Back to Course
        </Link>
        
        {quiz && !showQuiz && !quizResult && (
          <button
            onClick={() => setShowQuiz(true)}
            className="btn btn-primary"
          >
            Take Quiz
          </button>
        )}
      </div>
    </div>
  )
}
