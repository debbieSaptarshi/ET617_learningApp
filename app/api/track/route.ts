import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { config } from '@/lib/config'
import { TrackEvent } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // In demo mode, just return success without trying to insert events
    if (config.isDemoMode()) {
      return NextResponse.json({
        success: true,
        message: 'Demo mode - events logged but not persisted'
      })
    }

    const { session_id, events } = await request.json()

    if (!session_id || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Insert events in batches to avoid payload limits
    const batchSize = 50
    const results = []

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('events')
        .insert(batch.map((event: TrackEvent) => ({
          user_id: event.user_id || null,
          session_id: event.session_id,
          event_type: event.event_type,
          occurred_at: event.occurred_at,
          properties: event.properties || {}
        })))

      if (error) {
        console.error('Error inserting events batch:', error)
        results.push({ batch: i / batchSize + 1, error: error.message })
      } else {
        results.push({ batch: i / batchSize + 1, success: true })
      }
    }

    const hasErrors = results.some(r => r.error)
    
    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors ? 'Some events failed to insert' : 'All events inserted successfully',
      results
    })

  } catch (error) {
    console.error('Error in track API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
