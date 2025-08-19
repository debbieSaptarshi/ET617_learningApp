import { v4 as uuidv4 } from 'uuid'
import { TrackEvent } from './types'
import { config } from './config'

class EventTracker {
  private sessionId: string
  private eventQueue: TrackEvent[] = []
  private batchSize = 10
  private flushInterval = 5000 // 5 seconds
  private flushTimer: NodeJS.Timeout | null = null

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startPeriodicFlush()
    this.trackPageView()
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushEvents()
      })
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return uuidv4()
    
    let sessionId = localStorage.getItem('lms_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('lms_session_id', sessionId)
    }
    return sessionId
  }

  private trackPageView() {
    if (typeof window !== 'undefined') {
      this.track('page_view', {
        page: window.location.pathname,
        url: window.location.href,
        title: document.title
      })
    }
  }

  private startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flushEvents()
    }, this.flushInterval)
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return

    const eventsToSend = [...this.eventQueue]
    this.eventQueue = []

    // In demo mode, just log events to console
    if (config.isDemoMode()) {
      console.log('Demo Mode - Events logged:', eventsToSend)
      return
    }

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          events: eventsToSend
        })
      })

      if (!response.ok) {
        console.warn('Failed to send events:', response.status)
        // Re-add events to queue for retry
        this.eventQueue.unshift(...eventsToSend)
      }
    } catch (error) {
      console.warn('Error sending events:', error)
      // Re-add events to queue for retry
      this.eventQueue.unshift(...eventsToSend)
    }
  }

  track(eventType: string, properties: Record<string, any> = {}) {
    const event: TrackEvent = {
      event_type: eventType,
      session_id: this.sessionId,
      occurred_at: new Date().toISOString(),
      properties
    }

    this.eventQueue.push(event)

    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents()
    }
  }

  trackClick(element: string, elementType: string = 'button') {
    this.track('click', {
      element,
      element_type: elementType,
      page: typeof window !== 'undefined' ? window.location.pathname : null
    })
  }

  trackVideoEvent(eventType: string, videoRef: string, lessonId: string, currentTime?: number) {
    this.track(`video_${eventType}`, {
      video_ref: videoRef,
      lesson_id: lessonId,
      current_time: currentTime,
      page: typeof window !== 'undefined' ? window.location.pathname : null
    })
  }

  trackQuizEvent(eventType: string, quizId: string, properties: Record<string, any> = {}) {
    this.track(`quiz_${eventType}`, {
      quiz_id: quizId,
      ...properties,
      page: typeof window !== 'undefined' ? window.location.pathname : null
    })
  }

  trackQuestionAnswered(questionId: string, quizId: string, isCorrect: boolean) {
    this.track('question_answered', {
      question_id: questionId,
      quiz_id: quizId,
      is_correct: isCorrect,
      page: typeof window !== 'undefined' ? window.location.pathname : null
    })
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flushEvents()
  }
}

// Singleton instance
let eventTracker: EventTracker | null = null

export const getEventTracker = (): EventTracker => {
  if (!eventTracker) {
    eventTracker = new EventTracker()
  }
  return eventTracker
}

// Convenience functions
export const trackEvent = (eventType: string, properties: Record<string, any> = {}) => {
  getEventTracker().track(eventType, properties)
}

export const trackClick = (element: string, elementType: string = 'button') => {
  getEventTracker().trackClick(element, elementType)
}

export const trackVideoEvent = (eventType: string, videoRef: string, lessonId: string, currentTime?: number) => {
  getEventTracker().trackVideoEvent(eventType, videoRef, lessonId, currentTime)
}

export const trackQuizEvent = (eventType: string, quizId: string, properties: Record<string, any> = {}) => {
  getEventTracker().trackQuizEvent(eventType, quizId, properties)
}

export const trackQuestionAnswered = (questionId: string, quizId: string, isCorrect: boolean) => {
  getEventTracker().trackQuestionAnswered(questionId, quizId, isCorrect)
}
