'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Delete, Plus, Sparkles, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { ScaleOnTap, HoverCard, FadeIn } from '@/components/page-transition'

interface Idea {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
}

const STORAGE_KEY = 'flownote-ideas'
const badgeVariants = ['default', 'secondary', 'outline', 'destructive'] as const

type BadgeVariant = (typeof badgeVariants)[number]

function tagVariant(tag: string): BadgeVariant {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return badgeVariants[hash % badgeVariants.length]
}

function formatDate(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function previewText(content: string) {
  return content.length > 240 ? `${content.slice(0, 240)}...` : content
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filterTag, setFilterTag] = useState<string>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')

  const { t, locale } = useI18n()

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Idea[]
        setIdeas(parsed)
      } catch {
        setIdeas([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
  }, [ideas])

  const tags = useMemo(() => {
    const set = new Set<string>()
    ideas.forEach((idea) => idea.tags.forEach((tag) => set.add(tag)))
    return [t('ideas.allTags'), ...Array.from(set).sort()]
  }, [ideas, t])

  const filteredIdeas = useMemo(() => {
    if (filterTag === t('ideas.allTags')) {
      return ideas
    }
    return ideas.filter((idea) => idea.tags.includes(filterTag))
  }, [filterTag, ideas, t])

  const openNewIdea = () => {
    setEditingIdea(null)
    setTitle('')
    setContent('')
    setTagInput('')
    setDialogOpen(true)
  }

  const openEditIdea = (idea: Idea) => {
    setEditingIdea(idea)
    setTitle(idea.title)
    setContent(idea.content)
    setTagInput(idea.tags.join(', '))
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  const saveIdea = () => {
    const normalizedTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    if (!title.trim()) {
      return
    }

    if (editingIdea) {
      setIdeas((state) =>
        state.map((idea) =>
          idea.id === editingIdea.id
            ? { ...idea, title: title.trim(), content: content.trim(), tags: normalizedTags }
            : idea
        )
      )
      toast.success(t('ideas.updated'))
    } else {
      const newIdea: Idea = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        tags: normalizedTags,
        createdAt: Date.now(),
      }
      setIdeas((state) => [newIdea, ...state])
      toast.success(t('ideas.created'))
    }

    closeDialog()
  }

  const deleteIdea = () => {
    if (!editingIdea) {
      return
    }
    const confirmed = window.confirm(t('ideas.deleteConfirm'))
    if (!confirmed) {
      return
    }
    setIdeas((state) => state.filter((idea) => idea.id !== editingIdea.id))
    closeDialog()
    toast.success(t('ideas.deleted'))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {t('ideas.title')}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              {t('ideas.subtitle')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              {t('ideas.description')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <ScaleOnTap>
                  <Button size="lg" className="shadow-lg" variant="secondary">
                    <Plus className="h-5 w-5" />
                    {t('ideas.newIdea')}
                  </Button>
                </ScaleOnTap>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg p-0 sm:p-6 gap-0">
                {/* 移动端头部带图标 */}
                <div className="px-6 pt-8 pb-4 sm:pt-6 border-b border-border/50 sm:border-none">
                  <DialogHeader className="space-y-3">
                    <div className="mx-auto sm:mx-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl sm:text-xl">
                      {editingIdea ? t('ideas.editIdea') : t('ideas.newIdea')}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {editingIdea
                        ? (locale === 'zh' ? '更新你的灵感内容' : 'Update your idea content')
                        : (locale === 'zh' ? '记录你的创意和想法' : 'Capture your creative ideas')
                      }
                    </p>
                  </DialogHeader>
                </div>

                <div className="px-6 py-4 space-y-5 overflow-y-auto">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('common.title')}
                    </label>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder={t('ideas.titlePlaceholder')}
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('common.content')}
                    </label>
                    <Textarea
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder={t('ideas.contentPlaceholder')}
                      rows={5}
                      className="rounded-xl border-muted-foreground/20 focus:border-primary resize-none"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('common.tags')}
                    </label>
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      placeholder={t('ideas.tagsPlaceholder')}
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                    />
                    {tagInput && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tagInput.split(',').map((tag, i) => tag.trim() && (
                          <Badge key={i} variant="secondary" className="rounded-full px-3 py-1">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="px-6 pb-6 pt-2 border-t border-border/50 sm:border-none">
                  {editingIdea ? (
                    <Button
                      variant="destructive"
                      onClick={deleteIdea}
                      type="button"
                      className="w-full sm:w-auto h-12 rounded-xl"
                    >
                      <Delete className="h-4 w-4 mr-2" />
                      {t('common.delete')}
                    </Button>
                  ) : (
                    <DialogClose asChild>
                      <Button variant="outline" type="button" className="w-full sm:w-auto h-12 rounded-xl">
                        {t('common.cancel')}
                      </Button>
                    </DialogClose>
                  )}
                  <ScaleOnTap className="flex-1 sm:flex-none">
                    <Button
                      onClick={saveIdea}
                      className="w-full sm:w-auto h-12 rounded-xl px-8"
                      size="lg"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      {t('common.save')}
                    </Button>
                  </ScaleOnTap>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </FadeIn>

      {/* Tags Filter */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-all duration-200',
                  filterTag === tag
                    ? 'border-foreground bg-foreground text-background shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground'
                )}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Ideas Grid */}
      <AnimatePresence mode="wait">
        {filteredIdeas.length === 0 ? (
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
            <h2 className="mt-6 text-2xl font-semibold">{t('ideas.noIdeas')}</h2>
            <p className="mt-2 max-w-xl mx-auto text-sm leading-7 text-muted-foreground">
              {t('ideas.noIdeasDesc')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
            {filteredIdeas.map((idea) => (
              <motion.div
                key={idea.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <HoverCard>
                  <button
                    type="button"
                    onClick={() => openEditIdea(idea)}
                    className="group flex h-full w-full flex-col items-stretch overflow-hidden rounded-[32px] border border-border bg-card/95 p-5 text-left transition-colors duration-200 hover:bg-card"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-foreground line-clamp-1">
                        {idea.title}
                      </h3>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground shrink-0">
                        {formatDate(idea.createdAt, locale)}
                      </span>
                    </div>
                    <p
                      className="min-h-[4.5rem] text-sm leading-6 text-muted-foreground line-clamp-3"
                    >
                      {previewText(idea.content)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {idea.tags.length > 0 ? (
                        idea.tags.map((tag) => (
                          <Badge key={tag} variant={tagVariant(tag)}>
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">no tags</Badge>
                      )}
                    </div>
                  </button>
                </HoverCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.div
        className="fixed bottom-6 right-6 z-20 lg:right-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <ScaleOnTap scale={0.9}>
          <button
            onClick={openNewIdea}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-shadow hover:shadow-2xl"
            aria-label={t('ideas.newIdea')}
          >
            <Plus className="h-6 w-6" />
          </button>
        </ScaleOnTap>
      </motion.div>
    </div>
  )
}
