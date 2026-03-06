'use client'

import { useEffect, useRef } from 'react'
import { trackVideoEvent } from '@/lib/event-tracking'

interface VideoPlayerProps {
  videoRef: string
  lessonId: string
}

export default function VideoPlayer({ videoRef, lessonId }: VideoPlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null)
  const playerInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          height: '360',
          width: '100%',
          videoId: videoRef,
          playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1,
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
          }
        })
      }
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
      }
    }
  }, [videoRef])

  const onPlayerReady = (event: any) => {
    // Player is ready
    console.log('YouTube player ready')
  }

  const onPlayerStateChange = (event: any) => {
    const playerState = event.data
    const currentTime = event.target.getCurrentTime()
    
    switch (playerState) {
      case window.YT.PlayerState.PLAYING:
        trackVideoEvent('play', videoRef, lessonId, currentTime)
        break

      case window.YT.PlayerState.PAUSED:
        trackVideoEvent('pause', videoRef, lessonId, currentTime)
        break

      case window.YT.PlayerState.ENDED:
        trackVideoEvent('complete', videoRef, lessonId)
        break
    }
  }

  const onPlayerError = (event: any) => {
    console.error('YouTube player error:', event.data)
  }

  const handleSeek = (event: any) => {
    if (playerInstanceRef.current) {
      const currentTime = playerInstanceRef.current.getCurrentTime()
      const seekTo = event.target.value
      
      trackVideoEvent('seek', videoRef, lessonId, currentTime)
      
      playerInstanceRef.current.seekTo(seekTo, true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <iframe
          ref={playerRef}
          className="w-full aspect-video rounded-lg"
          title="Video Player"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <label htmlFor="seek-slider" className="text-sm font-medium text-gray-700">
          Seek to:
        </label>
        <input
          id="seek-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          onChange={handleSeek}
        />
        <span className="text-sm text-gray-500 w-16 text-right">
          {playerInstanceRef.current?.getCurrentTime?.() || 0}s
        </span>
      </div>
    </div>
  )
}

// Add YouTube IFrame API types to window
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
