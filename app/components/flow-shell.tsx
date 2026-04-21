'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Menu,
  Wallet,
  Moon,
  Sun,
  Globe,
  X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export default function FlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const { setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Scroll tracking: hide header on scroll up, show on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (mobileMenuOpen) return
      if (currentY <= 0) {
        setHeaderVisible(true)
      } else if (currentY > lastScrollY.current + 5) {
        setHeaderVisible(false)
      } else if (currentY < lastScrollY.current - 5) {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileMenuOpen])

  const navigation = [
    {
      title: t('nav.ideas'),
      href: '/ideas',
      icon: Lightbulb,
    },
    {
      title: t('nav.journal'),
      href: '/journal',
      icon: BookOpen,
    },
    {
      title: t('nav.finance'),
      href: '/finance',
      icon: Wallet,
    },
  ]

  // Narrow sidebar width
  const navWidthClass = collapsed ? 'lg:pl-[70px]' : 'lg:pl-[200px]'
  const sidebarWidth = collapsed ? 'w-[70px]' : 'w-[200px]'

  // Toggle theme
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            'hidden lg:flex fixed left-0 top-0 h-full flex-col border-r border-border',
            'bg-gradient-to-b from-background/90 to-background/70',
            'backdrop-blur-xl backdrop-saturate-150',
            'shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)]',
            'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
            sidebarWidth
          )}
        >
          <div className="flex h-full flex-col gap-4 px-3 py-5">
            <div
              className={cn(
                'flex items-center justify-between gap-2',
                collapsed && 'justify-center'
              )}
            >
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                className={cn('space-y-1 overflow-hidden', collapsed && 'hidden')}
              >
                <div className="text-xl font-semibold tracking-tight">
                  FlowNote
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '笔记一体化' : 'Notes in one place.'}
                </p>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground shrink-0 h-8 w-8"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            <nav className="mt-6 space-y-1">
              {navigation.map((item, idx) => {
                const Icon = item.icon
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                        'transition-all duration-200 ease-out',
                        'active:scale-[0.98]',
                        collapsed && 'justify-center px-2',
                        active
                          ? 'bg-primary/10 text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-colors',
                            active ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        />
                      </motion.div>
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="mt-auto space-y-2">
              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full gap-2 transition-all duration-200 h-9',
                  collapsed && 'justify-center px-2'
                )}
                onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              >
                <Globe className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span>{locale === 'zh' ? 'English' : '中文'}</span>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full gap-2 transition-all duration-200 h-9',
                  collapsed && 'justify-center px-2'
                )}
                onClick={toggleTheme}
              >
                {!mounted ? (
                  <>
                    <Sun className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{locale === 'zh' ? '深色' : 'Dark'}</span>}
                  </>
                ) : resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{locale === 'zh' ? '浅色' : 'Light'}</span>}
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{locale === 'zh' ? '深色' : 'Dark'}</span>}
                  </>
                )}
              </Button>

              {/* Footer */}
              <motion.div
                initial={false}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className={cn(
                  'rounded-xl border border-border',
                  'bg-muted/50',
                  'text-muted-foreground shadow-sm',
                  collapsed
                    ? 'flex h-10 items-center justify-center'
                    : 'p-3 text-xs'
                )}
              >
                {collapsed ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    FN
                  </span>
                ) : (
                  <>
                    <div className="font-semibold text-foreground">
                      FlowNote
                    </div>
                    <div className="mt-0.5 text-[10px]">
                      {t('common.version')} 0.1.1
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground/70">
                      made by haixing🌟
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </aside>

        <div className={cn(navWidthClass, 'transition-all duration-300')}>
          {/* Mobile Header */}
          <header
            className={cn(
              'fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3 lg:hidden',
              'transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
              headerVisible ? 'translate-y-0' : '-translate-y-full'
            )}
          >
            <div className="text-lg font-semibold">FlowNote</div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={toggleTheme}
              >
                {!mounted ? (
                  <Moon className="h-5 w-5" />
                ) : resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Spacer for fixed mobile header */}
          <div className="h-[56px] lg:hidden" />

          {/* Mobile Menu Overlay - Back on the RIGHT side */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menu Panel - RIGHT side */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 z-50 h-full w-[260px] bg-background shadow-2xl lg:hidden"
                >
                  <div className="flex h-full flex-col p-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-semibold">Menu</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <nav className="space-y-1">
                      {navigation.map((item, idx) => {
                        const Icon = item.icon
                        const active =
                          pathname === item.href ||
                          pathname.startsWith(`${item.href}/`)

                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium',
                                'transition-all duration-200',
                                'active:scale-[0.98]',
                                active
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        FlowNote v0.1.0
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/70">
                        made by haixing🌟
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
