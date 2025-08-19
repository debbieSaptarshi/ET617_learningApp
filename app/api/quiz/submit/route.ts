import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { QuizSubmission, QuizResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { quiz_id, answers }: QuizSubmission = await request.json()

    if (!quiz_id || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quiz submission data' },
        { status: 400 }
      )
    }

    // Get quiz details and questions
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*, lesson_id, passing_score')
      .eq('id', quiz_id)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Get all questions for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*, quiz_options(*)')
      .eq('quiz_id', quiz_id)
      .order('order_index')

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: 'Failed to fetch quiz questions' },
        { status: 500 }
      )
    }

    // Create quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id,
        user_id: user.id,
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: 'Failed to create quiz attempt' },
        { status: 500 }
      )
    }

    // Process answers and calculate score
    let correctAnswers = 0
    const totalQuestions = questions.length
    const quizAnswers = []

    for (const question of questions) {
      const userAnswer = answers.find(a => a.question_id === question.id)
      
      if (!userAnswer) continue

      let isCorrect = false
      let answerText = null
      let selectedOptionIds = null

      switch (question.type) {
        case 'single_choice':
          if (userAnswer.selected_option_ids && userAnswer.selected_option_ids.length === 1) {
            const selectedOption = question.quiz_options.find(
              opt => opt.id === userAnswer.selected_option_ids![0]
            )
            isCorrect = selectedOption?.is_correct || false
            selectedOptionIds = userAnswer.selected_option_ids
          }
          break

        case 'multiple_choice':
          if (userAnswer.selected_option_ids && userAnswer.selected_option_ids.length > 0) {
            const correctOptions = question.quiz_options.filter(opt => opt.is_correct)
            const userSelectedCorrect = userAnswer.selected_option_ids.every(
              id => question.quiz_options.find(opt => opt.id === id)?.is_correct
            )
            const userSelectedAllCorrect = userAnswer.selected_option_ids.length === correctOptions.length
            isCorrect = userSelectedCorrect && userSelectedAllCorrect
            selectedOptionIds = userAnswer.selected_option_ids
          }
          break

        case 'short_answer':
          answerText = userAnswer.answer_text || ''
          // For short answer, we'll mark as correct if any text was provided
          // In a real application, you might want more sophisticated text matching
          isCorrect = answerText.trim().length > 0
          break
      }

      if (isCorrect) {
        correctAnswers++
      }

      // Store the answer
      const { error: answerError } = await supabase
        .from('quiz_answers')
        .insert({
          attempt_id: attempt.id,
          question_id: question.id,
          answer_text: answerText,
          selected_option_ids: selectedOptionIds,
          is_correct: isCorrect
        })

      if (answerError) {
        console.error('Error inserting quiz answer:', answerError)
      }

      quizAnswers.push({
        question_id: question.id,
        is_correct: isCorrect,
        answer_text: answerText,
        selected_option_ids: selectedOptionIds
      })
    }

    // Calculate score percentage
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = scorePercent >= quiz.passing_score

    // Update quiz attempt with results
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        score_percent: scorePercent,
        passed
      })
      .eq('id', attempt.id)

    if (updateError) {
      console.error('Error updating quiz attempt:', updateError)
    }

    const result: QuizResult = {
      attempt_id: attempt.id,
      score_percent: scorePercent,
      passed,
      answers: quizAnswers
    }

    return NextResponse.json({
      success: true,
      result
    })

  } catch (error) {
    console.error('Error in quiz submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
