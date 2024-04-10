import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'
// import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'

import '@/styles/globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '绘画爱好者社区',
  description: '绘园|绘画爱好者社区|分享你的绘画.',
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn(
        'bg-white text-slate-900 antialiased light',
        // inter.className
      )}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-6'>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
