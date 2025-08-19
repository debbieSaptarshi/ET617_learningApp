import { Course, Lesson, Quiz, QuizQuestion, QuizOption } from './types'

// Demo data for when Supabase is not configured
export const demoCourses: Course[] = [
  {
    id: 'demo-course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
    is_published: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-course-2',
    title: 'React Fundamentals',
    description: 'Master React.js with hands-on projects and real-world examples.',
    is_published: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'demo-course-3',
    title: 'Database Design Principles',
    description: 'Learn database design, SQL, and data modeling best practices.',
    is_published: true,
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z'
  }
]

export const demoLessons: Lesson[] = [
  {
    id: 'demo-lesson-1',
    course_id: 'demo-course-1',
    title: 'HTML Basics',
    content_richtext: '# HTML Basics\n\nHTML is the foundation of web development. In this lesson, you will learn:\n\n- HTML document structure\n- Basic HTML tags\n- Semantic HTML elements\n- Forms and inputs\n\n## Key Concepts\n\nHTML stands for HyperText Markup Language and is used to structure content on the web.',
    video_provider: 'youtube',
    video_ref: 'dQw4w9WgXcQ',
    order_index: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-lesson-2',
    course_id: 'demo-course-1',
    title: 'CSS Styling',
    content_richtext: '# CSS Styling\n\nCSS makes your HTML beautiful! Learn:\n\n- CSS selectors and properties\n- Box model and layout\n- Flexbox and Grid\n- Responsive design\n\n## CSS Box Model\n\nThe box model consists of content, padding, border, and margin.',
    video_provider: 'youtube',
    video_ref: 'dQw4w9WgXcQ',
    order_index: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-lesson-3',
    course_id: 'demo-course-2',
    title: 'React Components',
    content_richtext: '# React Components\n\nReact is built on components. Learn:\n\n- Functional components\n- Props and state\n- Component lifecycle\n- Hooks basics\n\n## Component Structure\n\nComponents are reusable UI pieces that make React powerful.',
    video_provider: 'youtube',
    video_ref: 'dQw4w9WgXcQ',
    order_index: 1,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  }
]

export const demoQuizzes: Quiz[] = [
  {
    id: 'demo-quiz-1',
    lesson_id: 'demo-lesson-1',
    title: 'HTML Basics Quiz',
    description: 'Test your knowledge of HTML fundamentals',
    passing_score: 70,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-quiz-2',
    lesson_id: 'demo-lesson-2',
    title: 'CSS Fundamentals Quiz',
    description: 'Test your CSS knowledge',
    passing_score: 70,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
]

export const demoQuizQuestions: QuizQuestion[] = [
  {
    id: 'demo-question-1',
    quiz_id: 'demo-quiz-1',
    question_text: 'What does HTML stand for?',
    type: 'single_choice',
    order_index: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-question-2',
    quiz_id: 'demo-quiz-1',
    question_text: 'Which tag is used for the main heading?',
    type: 'single_choice',
    order_index: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-question-3',
    quiz_id: 'demo-quiz-1',
    question_text: 'What are the main sections of an HTML document?',
    type: 'multiple_choice',
    order_index: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-question-4',
    quiz_id: 'demo-quiz-1',
    question_text: 'Explain the purpose of semantic HTML elements.',
    type: 'short_answer',
    order_index: 4,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
]

export const demoQuizOptions: QuizOption[] = [
  {
    id: 'demo-option-1',
    question_id: 'demo-question-1',
    option_text: 'HyperText Markup Language',
    is_correct: true,
    order_index: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-2',
    question_id: 'demo-question-1',
    option_text: 'High Tech Modern Language',
    is_correct: false,
    order_index: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-3',
    question_id: 'demo-question-1',
    option_text: 'Home Tool Markup Language',
    is_correct: false,
    order_index: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-4',
    question_id: 'demo-question-2',
    option_text: '<h1>',
    is_correct: true,
    order_index: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-5',
    question_id: 'demo-question-2',
    option_text: '<heading>',
    is_correct: false,
    order_index: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-6',
    question_id: 'demo-question-2',
    option_text: '<title>',
    is_correct: false,
    order_index: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-7',
    question_id: 'demo-question-3',
    option_text: 'head',
    is_correct: true,
    order_index: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-8',
    question_id: 'demo-question-3',
    option_text: 'body',
    is_correct: true,
    order_index: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-option-9',
    question_id: 'demo-question-3',
    option_text: 'footer',
    is_correct: false,
    order_index: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
]

// Helper function to get demo data
export const getDemoData = {
  courses: () => demoCourses,
  lessons: (courseId: string) => demoLessons.filter(l => l.course_id === courseId),
  quiz: (lessonId: string) => {
    const quiz = demoQuizzes.find(q => q.lesson_id === lessonId)
    if (!quiz) return null
    
    const questions = demoQuizQuestions.filter(q => q.quiz_id === quiz.id)
    const questionsWithOptions = questions.map(q => ({
      ...q,
      quiz_options: demoQuizOptions.filter(o => o.question_id === q.id)
    }))
    
    return {
      ...quiz,
      questions: questionsWithOptions
    }
  }
}
