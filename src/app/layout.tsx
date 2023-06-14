import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Algo Graph',
  description: 'Created by abhishek',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div className='text-center'>
          Crafted By <span className="font-extrabold animate-text text-transparent text-lg bg-clip-text bg-gradient-to-r from-blue-600 via-pink-400 to-purple-400">Abhishek </span>🧩
        </div>

        <div className=' h-1  backdrop-blur-sm bg-gradient-to-r animate-text from-purple-500 via-red-200 to-pink-500 bg-opacity-20 w-full drop-shadow-lg '> </div>

      </body>
    </html>
  )
}
