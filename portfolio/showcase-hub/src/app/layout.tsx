import type { ReactNode } from 'react'

import './globals.css'

export const metadata = {
  title: 'Showcase Hub',
  description: 'Searchable portfolio of all apps in /apps'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
