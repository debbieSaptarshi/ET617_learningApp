'use client'

import { useState, useEffect } from 'react'
import { trackQuizEvent, trackQuestionAnswered } from '@/lib/event-tracking'
import { QuizQuestion, QuizOption } from '@/lib/types'

interface QuizProps {
  quizId: string
  questions: (QuizQuestion & { quiz_options: QuizOption[] })[]
  onComplete: (result: any) => void
}

export default function Quiz({ quizId, questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Track quiz start when component mounts
  useEffect(() => {
    trackQuizEvent('quiz_start', quizId, {
      total_questions: questions.length
    })
  }, [quizId, questions.length])

  const handleAnswerChange = (questionId: string, value: any, questionType: string) => {
    let newAnswer: any

    switch (questionType) {
      case 'single_choice':
        newAnswer = { selected_option_ids: [value] }
        break
      case 'multiple_choice':
        const currentAnswers = answers[questionId]?.selected_option_ids || []
        if (currentAnswers.includes(value)) {
          newAnswer = { selected_option_ids: currentAnswers.filter((id: string) => id !== value) }
        } else {
          newAnswer = { selected_option_ids: [...currentAnswers, value] }
        }
        break
      case 'short_answer':
        newAnswer = { answer_text: value }
        break
      default:
        newAnswer = value
    }

    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }))

    // Track question answered
    const isCorrect = questionType === 'short_answer' ? 
      value.trim().length > 0 : 
      questionType === 'single_choice' ? 
        currentQuestion.quiz_options.find(opt => opt.id === value)?.is_correct :
        false

    trackQuestionAnswered(questionId, isCorrect, 
      questionType === 'short_answer' ? value : 
      questionType === 'single_choice' ? 
        currentQuestion.quiz_options.find(opt => opt.id === value)?.option_text || '' :
        'Multiple choice selection',
      quizId
    )
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const submissionData = {
        quiz_id: quizId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: questionId,
          ...answer
        }))
      }

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const result = await response.json()
      
      // Track quiz submission
      trackQuizEvent('quiz_submit', quizId, {
        score_percent: result.result.score_percent,
        passed: result.result.passed
      })

      onComplete(result.result)
    } catch (error: any) {
      setError(error.message || 'Failed to submit quiz')
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = () => {
    const question = currentQuestion
    const userAnswer = answers[question.id]

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {question.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.prompt}
          </h3>

          {question.type === 'single_choice' && (
            <div className="space-y-3">
              {question.quiz_options.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={userAnswer?.selected_option_ids?.[0] === option.id}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, 'single_choice')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option.option_text}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.quiz_options.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={userAnswer?.selected_option_ids?.includes(option.id) || false}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, 'multiple_choice')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option.option_text}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'short_answer' && (
            <textarea
              value={userAnswer?.answer_text || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value, 'short_answer')}
              placeholder="Type your answer here..."
              className="input min-h-[100px] resize-none"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {renderQuestion()}

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || Object.keys(answers).length < questions.length}
              className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
