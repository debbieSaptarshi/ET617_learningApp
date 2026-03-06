import { NextRequest } from 'next/server'
import https from 'https'
import { HttpsProxyAgent } from 'https-proxy-agent'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-opus-4-6'

function getAgent(): https.Agent | undefined {
  const proxyUrl = process.env.ANTHROPIC_PROXY_URL
  if (proxyUrl) return new HttpsProxyAgent(proxyUrl)
  return undefined
}

function callAnthropicStream(
  body: string,
  token: string,
  agent?: https.Agent
): Promise<import('http').IncomingMessage> {
  return new Promise((resolve, reject) => {
    const url = new URL(ANTHROPIC_API)
    const req = https.request(
      {
        host: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body),
        },
        agent,
      },
      resolve
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  const token = process.env.ANTHROPIC_API_KEY
  if (!token) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { messages, lessonTitle, lessonContent } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const contentSnippet = lessonContent ? (lessonContent as string).slice(0, 4000) : ''
    const systemPrompt = [
      'You are an AI tutor helping students learn on an interactive LMS platform.',
      lessonTitle ? `The student is currently on the lesson: "${lessonTitle}".` : '',
      contentSnippet ? `Lesson content for context:\n\n${contentSnippet}` : '',
      'Answer questions clearly and concisely. Encourage curiosity and deeper thinking.',
    ]
      .filter(Boolean)
      .join('\n')

    const requestBody = JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      stream: true,
      system: systemPrompt,
      messages,
    })

    const agent = getAgent()
    const upstream = await callAnthropicStream(requestBody, token, agent)

    if (upstream.statusCode !== 200) {
      const errBody: Buffer[] = []
      upstream.on('data', (c: Buffer) => errBody.push(c))
      await new Promise((r) => upstream.on('end', r))
      const errText = Buffer.concat(errBody).toString()
      console.error('Anthropic error:', upstream.statusCode, errText)
      return new Response(
        JSON.stringify({ error: `Anthropic returned ${upstream.statusCode}` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Transform Anthropic SSE stream → our simplified SSE stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      start(controller) {
        let buffer = ''

        upstream.on('data', (chunk: Buffer) => {
          buffer += chunk.toString()
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const event = JSON.parse(data)
              if (
                event.type === 'content_block_delta' &&
                event.delta?.type === 'text_delta' &&
                event.delta?.text
              ) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                  )
                )
              }
            } catch {
              // skip malformed events
            }
          }
        })

        upstream.on('end', () => {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        })

        upstream.on('error', (err: Error) => {
          console.error('Upstream stream error:', err)
          controller.close()
        })
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'AI service unavailable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
