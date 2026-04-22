'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { I18nProvider } from '@/lib/i18n'
import { ThemeInit } from '@/components/theme-init'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <ThemeInit />
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
