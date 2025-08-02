
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Phantom Box - 당신의 가장 무서운 기억을 담는 곳',
  description: '폐병원의 분위기에서 마주하는 자신의 감정과 기억들을 통해, 더 나은 내일을 위한 회고의 시간을 가져보세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}
