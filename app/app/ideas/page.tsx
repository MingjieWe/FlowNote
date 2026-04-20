'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Delete, Plus, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
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

// 兼容移动端的 UUID 生成
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // 降级方案
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
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

function formatDateTime(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

function previewText(content: string) {
  return content.length > 240 ? `${content.slice(0, 240)}...` : content
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filterTag, setFilterTag] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')

  const { t, locale } = useI18n()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const [mounted, setMounted] = useState(false)

  // 客户端挂载后加载数据（避免 hydration 不匹配）
  useEffect(() => {
    setMounted(true)
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

  // 将 auto save 逻辑内联到 useEffect 中，避免依赖问题
  const doAutoSave = useCallback(() => {
    const normalizedTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (editingIdea) {
      setIdeas((state) =>
        state.map((idea) =>
          idea.id === editingIdea.id
            ? { ...idea, title: title.trim(), content: content.trim(), tags: normalizedTags }
            : idea
        )
      )
    } else {
      const newIdea: Idea = {
        id: generateUUID(),
        title: title.trim() || (locale === 'zh' ? '未命名' : 'Untitled'),
        content: content.trim(),
        tags: normalizedTags.length > 0 ? normalizedTags : [locale === 'zh' ? '默认' : 'default'],
        createdAt: Date.now(),
      }
      setIdeas((state) => [newIdea, ...state])
      setEditingIdea(newIdea)
    }
  }, [content, title, tagInput, editingIdea, locale])

  // 保存到 localStorage
  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
    }
  }, [ideas, mounted])

  // 内容变化时，3秒后自动保存
  useEffect(() => {
    if (!dialogOpen) return

    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current)
    }

    autoSaveRef.current = setTimeout(() => {
      if (content.trim() || title.trim()) {
        doAutoSave()
      }
    }, 3000)

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [title, content, tagInput, dialogOpen, doAutoSave])

  // 页面隐藏/关闭前自动保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (dialogOpen && (content.trim() || title.trim())) {
        doAutoSave()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [dialogOpen, content, title, tagInput, editingIdea, doAutoSave])

  const tags = useMemo(() => {
    const set = new Set<string>()
    ideas.forEach((idea) => idea.tags.forEach((tag) => set.add(tag)))
    return [t('ideas.allTags'), ...Array.from(set).sort()]
  }, [ideas, t])

  const filteredIdeas = useMemo(() => {
    if (!filterTag || filterTag === t('ideas.allTags')) {
      return ideas
    }
    return ideas.filter((idea) => idea.tags.includes(filterTag))
  }, [filterTag, ideas, t])

  const openNewIdea = () => {
    setEditingIdea(null)
    setTitle('')
    setContent('')
    setTagInput(locale === 'zh' ? '默认' : 'default')
    setDialogOpen(true)
    // 自动聚焦内容区
    setTimeout(() => {
      contentRef.current?.focus()
    }, 100)
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

  // 处理 Dialog 关闭（包括点击遮罩、按 ESC）
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && dialogOpen) {
      // Dialog 正在关闭，自动保存
      const normalizedTags = tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (content.trim() || title.trim()) {
        if (editingIdea) {
          setIdeas((state) =>
            state.map((idea) =>
              idea.id === editingIdea.id
                ? { ...idea, title: title.trim() || idea.title, content: content.trim(), tags: normalizedTags }
                : idea
            )
          )
        } else {
          const newIdea: Idea = {
            id: generateUUID(),
            title: title.trim() || (locale === 'zh' ? '未命名' : 'Untitled'),
            content: content.trim(),
            tags: normalizedTags.length > 0 ? normalizedTags : [locale === 'zh' ? '默认' : 'default'],
            createdAt: Date.now(),
          }
          setIdeas((state) => [newIdea, ...state])
        }
      }
    }
    setDialogOpen(open)
  }

  const saveAndClose = () => {
    const normalizedTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (editingIdea) {
      setIdeas((state) =>
        state.map((idea) =>
          idea.id === editingIdea.id
            ? { ...idea, title: title.trim() || idea.title, content: content.trim(), tags: normalizedTags }
            : idea
        )
      )
      toast.success(t('ideas.updated'))
    } else {
      const newIdea: Idea = {
        id: generateUUID(),
        title: title.trim() || (locale === 'zh' ? '未命名' : 'Untitled'),
        content: content.trim(),
        tags: normalizedTags.length > 0 ? normalizedTags : [locale === 'zh' ? '默认' : 'default'],
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
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogContent hideClose className="p-0 gap-0 w-full h-full max-w-none sm:rounded-none rounded-none border-0 sm:border-0 overflow-hidden">
                {/* 隐藏的 DialogTitle 用于无障碍访问 */}
                <DialogTitle className="sr-only">
                  {editingIdea ? (locale === 'zh' ? '编辑灵感' : 'Edit Idea') : (locale === 'zh' ? '新灵感' : 'New Idea')}
                </DialogTitle>

                {/* 顶部融合栏 - 包含所有元信息 */}
                <div className="flex flex-col px-4 sm:px-6 pt-3 sm:pt-4 pb-2 gap-2">
                  {/* 第一行：返回、日期/字数、删除（编辑时）、保存 */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={saveAndClose}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-xs">{locale === 'zh' ? '返回' : 'Back'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(Date.now(), locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {content.length} {locale === 'zh' ? '字' : 'chars'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingIdea && (
                        <button
                          onClick={deleteIdea}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors py-1"
                        >
                          <Delete className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{locale === 'zh' ? '删除' : 'Delete'}</span>
                        </button>
                      )}
                      <button
                        onClick={saveAndClose}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors py-1"
                      >
                        <span className="text-xs font-medium">{locale === 'zh' ? '保存' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                  {/* 第二行：标题输入 */}
                  <div>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder={locale === 'zh' ? '标题（可选）' : 'Title (optional)'}
                      className="border-0 bg-transparent text-lg sm:text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-9"
                    />
                  </div>
                  {/* 第三行：Tag栏 */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded px-2 py-0.5 text-[10px]">
                      {locale === 'zh' ? 'Tag' : 'Tag'}
                    </Badge>
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      placeholder={locale === 'zh' ? '输入标签，用逗号分隔' : 'Enter tags, comma separated'}
                      className="flex-1 border-0 bg-transparent text-xs placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-7"
                    />
                  </div>
                  {/* 第四行：内容输入 */}
                  <div className="mt-1">
                    <Textarea
                      ref={contentRef}
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder={locale === 'zh' ? '记录你的灵感...' : 'Write your idea...'}
                      rows={10}
                      className="w-full resize-none border-0 bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base sm:text-lg leading-relaxed"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

      {/* Tags Filter */}
      {mounted && (
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
                  (filterTag === tag || (!filterTag && tag === t('ideas.allTags')))
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
      )}

      {/* Ideas Grid */}
      {mounted && (
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
      )}

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
