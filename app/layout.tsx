import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Learning LMS',
  description: 'Interactive learning management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
