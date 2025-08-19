export interface Profile {
  id: string
  full_name: string | null
  role: 'learner' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content_richtext: string | null
  video_provider: string | null
  video_ref: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  passing_score: number
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  type: 'multiple_choice' | 'single_choice' | 'short_answer'
  prompt: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface QuizOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  started_at: string
  submitted_at: string | null
  score_percent: number | null
  passed: boolean | null
  created_at: string
  updated_at: string
}

export interface QuizAnswer {
  id: string
  attempt_id: string
  question_id: string
  answer_text: string | null
  selected_option_ids: string[] | null
  is_correct: boolean | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  user_id: string | null
  session_id: string
  event_type: string
  page: string | null
  element: string | null
  video_ref: string | null
  quiz_id: string | null
  lesson_id: string | null
  occurred_at: string
  properties: Record<string, any>
}

// Event tracking types
export interface TrackEvent {
  event_type: string
  page?: string
  element?: string
  video_ref?: string
  quiz_id?: string
  lesson_id?: string
  properties?: Record<string, any>
}

export interface QuizSubmission {
  quiz_id: string
  answers: {
    question_id: string
    answer_text?: string
    selected_option_ids?: string[]
  }[]
}

export interface QuizResult {
  attempt_id: string
  score_percent: number
  passed: boolean
  answers: QuizAnswer[]
}
