import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Water Intake Tracker',
  description: 'Create and track your daily water intake easily.',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
