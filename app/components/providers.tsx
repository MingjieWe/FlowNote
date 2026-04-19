'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { I18nProvider } from '@/lib/i18n'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={3000}
          visibleToasts={5}
          toastOptions={{
            style: {
              fontFamily: 'system-ui, -apple-system, sans-serif',
            },
          }}
        />
      </ThemeProvider>
    </I18nProvider>
  )
}
