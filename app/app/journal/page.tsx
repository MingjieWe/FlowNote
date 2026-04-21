'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { ScaleOnTap, FadeIn } from '@/components/page-transition'

type Mood = 'happy' | 'calm' | 'sad' | 'excited' | 'tired' | 'anxious'

interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD
  content: string
  mood: Mood
  createdAt: number
}

const STORAGE_KEY = 'flownote-journal'

const MOOD_EMOJIS: Record<Mood, string> = {
  happy: '😊',
  calm: '😌',
  sad: '😔',
  excited: '🤩',
  tired: '😴',
  anxious: '😰',
}

const MOOD_COLORS: Record<Mood, string> = {
  happy: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900',
  calm: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
  sad: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
  excited: 'bg-pink-100 hover:bg-pink-200 text-pink-900',
  tired: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  anxious: 'bg-red-100 hover:bg-red-200 text-red-900',
}

function formatDate(dateStr: string, locale: string) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T00:00:00`)
  if (isNaN(date.getTime())) return dateStr
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getYearMonth(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDate, setEditingDate] = useState<string>('')
  const [editingMood, setEditingMood] = useState<Mood>('calm')
  const [editingContent, setEditingContent] = useState('')
  const { t, locale } = useI18n()

  // Load from localStorage - sync once on mount
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as JournalEntry[]
        setEntries(parsed)
      } catch {
        setEntries([])
      }
    }
  }, [])

  // Save to localStorage with debounce to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [entries])

  const yearMonth = useMemo(() => getYearMonth(currentMonth), [currentMonth])

  // Get all entries for the current month
  const monthEntries = useMemo(() => {
    return entries
      .filter((e) => e.date.startsWith(yearMonth))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [entries, yearMonth])

  // Get dates that have entries (for calendar marking)
  const datesWithEntries = useMemo(() => {
    return new Set(monthEntries.map((e) => parseInt(e.date.split('-')[2])))
  }, [monthEntries])

  // Get or create entry for a specific date
  const getEntryForDate = (dateStr: string) => {
    return entries.find((e) => e.date === dateStr)
  }

  const openNewEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    const entry = getEntryForDate(today)
    if (entry) {
      setEditingDate(entry.date)
      setEditingMood(entry.mood)
      setEditingContent(entry.content)
    } else {
      setEditingDate(today)
      setEditingMood('calm')
      setEditingContent('')
    }
    setDialogOpen(true)
  }

  const openEditEntry = (date: string) => {
    const entry = getEntryForDate(date)
    setEditingDate(date)
    setEditingMood(entry ? entry.mood : 'calm')
    setEditingContent(entry ? entry.content : '')
    setDialogOpen(true)
  }

  const saveEntry = () => {
    if (!editingContent.trim()) {
      return
    }

    const existingIndex = entries.findIndex((e) => e.date === editingDate)

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...entries]
      updated[existingIndex] = {
        ...updated[existingIndex],
        mood: editingMood,
        content: editingContent.trim(),
      }
      setEntries(updated)
      toast.success(t('journal.updated'))
    } else {
      // Create new
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        date: editingDate,
        content: editingContent.trim(),
        mood: editingMood,
        createdAt: Date.now(),
      }
      setEntries([...entries, newEntry])
      toast.success(t('journal.saved'))
    }

    setDialogOpen(false)
  }

  const deleteEntry = () => {
    if (!confirm(t('journal.deleteConfirm') as string)) {
      return
    }
    setEntries((state) => state.filter((e) => e.date !== editingDate))
    setDialogOpen(false)
    toast.success(t('journal.deleted'))
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  // Generate calendar grid
  const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  // Get today's date string for highlighting
  const todayStr = new Date().toISOString().split('T')[0]

  const moods: Mood[] = ['happy', 'calm', 'sad', 'excited', 'tired', 'anxious']

  return (
    <div className="space-y-8">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-2xl p-0 sm:p-6 gap-0">
                {/* 移动端头部 */}
                <div className="px-6 pt-8 pb-4 sm:pt-6 border-b border-border/50 sm:border-none">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                        {MOOD_EMOJIS[editingMood]}
                      </div>
                      <div className="text-left">
                      <DialogTitle className="text-xl sm:text-xl">
                        {t('journal.title')}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(editingDate, locale)}
                      </p>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                  {/* 心情选择 */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('journal.howAreYou')}
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood}
                          onClick={() => setEditingMood(mood)}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-2xl p-3 sm:p-4 transition-all duration-200',
                            editingMood === mood
                              ? 'ring-2 ring-primary scale-105 ' + MOOD_COLORS[mood]
                              : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          <span className="text-2xl sm:text-3xl">{MOOD_EMOJIS[mood]}</span>
                          <span className="text-xs sm:text-sm font-medium">
                            {t(`journal.moods.${mood}`)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* 日记内容 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('journal.whatsOnMind')}
                    </label>
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      placeholder={t('journal.writeFreely')}
                      rows={6}
                      className="rounded-xl border-muted-foreground/20 focus:border-primary resize-none text-base leading-relaxed"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {editingContent.length} {locale === 'zh' ? '字' : 'chars'}
                    </p>
                  </div>
                </div>

                <DialogFooter className="px-6 pb-6 pt-2 border-t border-border/50 sm:border-none gap-3">
                  {getEntryForDate(editingDate) ? (
                    <Button
                      variant="destructive"
                      onClick={deleteEntry}
                      type="button"
                      className="w-full sm:w-auto h-12 rounded-xl"
                    >
                      {t('common.delete')}
                    </Button>
                  ) : (
                    <DialogClose asChild>
                      <Button variant="outline" type="button" className="w-full sm:w-auto h-12 rounded-xl">
                        {t('journal.close')}
                      </Button>
                    </DialogClose>
                  )}
                  <ScaleOnTap className="flex-1 sm:flex-none">
                    <Button
                      onClick={saveEntry}
                      disabled={!editingContent.trim()}
                      className="w-full sm:w-auto h-12 rounded-xl px-8"
                      size="lg"
                    >
                      {t('journal.saveEntry')}
                    </Button>
                  </ScaleOnTap>
                </DialogFooter>
              </DialogContent>
            </Dialog>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Calendar Sidebar */}
        <FadeIn delay={0.1} className="lg:col-span-1">
          <div className="rounded-[24px] border border-border bg-card/95 p-4 shadow-sm">
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between gap-2">
                <motion.button
                  onClick={previousMonth}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-muted"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <h2 className="text-base font-semibold">
                  {currentMonth.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <motion.button
                  onClick={nextMonth}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-muted"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground h-10 flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const dateStr = day ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null
                  const isToday = dateStr === todayStr
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        if (day && dateStr) {
                          openEditEntry(dateStr)
                        }
                      }}
                      disabled={!day}
                      whileTap={day ? { scale: 0.9 } : {}}
                      data-today={isToday ? 'true' : undefined}
                      className={cn(
                        'relative h-10 w-10 text-sm rounded-xl transition-all duration-200',
                        !day
                          ? 'cursor-default'
                          : 'hover:bg-muted cursor-pointer',
                        datesWithEntries.has(day) ? 'font-semibold bg-primary/5' : 'text-muted-foreground',
                        isToday && 'border border-foreground'
                      )}
                    >
                      {day}
                      {day && datesWithEntries.has(day) && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Journal Entries */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {monthEntries.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-[32px] border border-border bg-card/95 p-12 text-center shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                <h2 className="mt-6 text-2xl font-semibold">{t('journal.noEntries')}</h2>
                <p className="mt-2 max-w-xl mx-auto text-sm leading-7 text-muted-foreground">
                  {t('journal.noEntriesDesc')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {monthEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.button
                      onClick={() => openEditEntry(entry.date)}
                      whileTap={{ scale: 0.99 }}
                      className="group w-full text-left rounded-[24px] border border-border bg-card/95 p-5 transition-all duration-200 hover:shadow-lg hover:border-foreground/20"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                            <div>
                              <p className="font-semibold text-foreground">{formatDate(entry.date, locale)}</p>
                              <p className="text-xs text-muted-foreground">
                                {t(`journal.moods.${entry.mood}`)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-5 line-clamp-2">
                            {entry.content}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB for Today */}
      <motion.div
        className="fixed bottom-6 right-6 z-20 lg:right-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <ScaleOnTap scale={0.9}>
          <button
            onClick={openNewEntry}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-shadow hover:shadow-2xl"
            aria-label={t('journal.today')}
          >
            <Plus className="h-6 w-6" />
          </button>
        </ScaleOnTap>
      </motion.div>
    </div>
  )
}
