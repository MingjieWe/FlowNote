'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Utensils,
  Bus,
  ShoppingBag,
  Zap,
  Home,
  Heart,
  BookOpen,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trash2,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { ScaleOnTap, FadeIn } from '@/components/page-transition'

type TransactionType = 'income' | 'expense'
type ExpenseCategory = '餐饮' | '交通' | '购物' | '娱乐' | '居住' | '医疗' | '教育' | '其他'
type IncomeCategory = '工资' | '投资' | '兼职' | '奖金' | '其他'
type Category = ExpenseCategory | IncomeCategory

interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: Category
  date: string // YYYY-MM-DD
  note?: string
  createdAt: number
}

const STORAGE_KEY = 'flownote-finance'

const EXPENSE_CATEGORIES: ExpenseCategory[] = ['餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '其他']
const INCOME_CATEGORIES: IncomeCategory[] = ['工资', '投资', '兼职', '奖金', '其他']

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  餐饮: <Utensils className="h-5 w-5" />,
  交通: <Bus className="h-5 w-5" />,
  购物: <ShoppingBag className="h-5 w-5" />,
  娱乐: <Zap className="h-5 w-5" />,
  居住: <Home className="h-5 w-5" />,
  医疗: <Heart className="h-5 w-5" />,
  教育: <BookOpen className="h-5 w-5" />,
  其他: <MoreHorizontal className="h-5 w-5" />,
  工资: <DollarSign className="h-5 w-5" />,
  投资: <TrendingUp className="h-5 w-5" />,
  兼职: <ShoppingBag className="h-5 w-5" />,
  奖金: <TrendingUp className="h-5 w-5" />,
}

const CATEGORY_COLORS: Record<Category, string> = {
  餐饮: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  交通: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  购物: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  娱乐: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  居住: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  医疗: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  教育: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  其他: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  工资: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  投资: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  兼职: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  奖金: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
}

function formatCurrency(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: locale === 'zh' ? 'CNY' : 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string, locale: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (isNaN(date.getTime())) return dateStr
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getYearMonth(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All')
  const [editingType, setEditingType] = useState<TransactionType>('expense')
  const [editingAmount, setEditingAmount] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category>('餐饮')
  const [editingDate, setEditingDate] = useState(new Date().toISOString().split('T')[0])
  const [editingNote, setEditingNote] = useState('')
  const { t, locale } = useI18n()

  // Load from localStorage - sync once on mount
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Transaction[]
        setTransactions(parsed)
      } catch {
        setTransactions([])
      }
    }
  }, [])

  // Save to localStorage with debounce to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [transactions])

  const yearMonth = useMemo(() => getYearMonth(currentMonth), [currentMonth])

  // Get transactions for current month
  const monthTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.date.startsWith(yearMonth))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  }, [transactions, yearMonth])

  // Get filtered transactions
  const filteredTransactions = useMemo(() => {
    if (filterCategory === 'All') {
      return monthTransactions
    }
    return monthTransactions.filter((t) => t.category === filterCategory)
  }, [monthTransactions, filterCategory])

  // Calculate statistics
  const stats = useMemo(() => {
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [monthTransactions])

  // Get available categories based on transaction type
  const currentCategories = editingType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const openNewTransaction = () => {
    setEditingType('expense')
    setEditingAmount('')
    setEditingCategory('餐饮')
    setEditingDate(new Date().toISOString().split('T')[0])
    setEditingNote('')
    setDialogOpen(true)
  }

  const saveTransaction = () => {
    if (!editingAmount.trim() || isNaN(parseFloat(editingAmount))) {
      return
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(editingAmount),
      type: editingType,
      category: editingCategory,
      date: editingDate,
      note: editingNote.trim() || undefined,
      createdAt: Date.now(),
    }

    setTransactions([...transactions, newTransaction])
    setDialogOpen(false)
    toast.success(t('finance.saved'))
  }

  const deleteTransaction = (id: string) => {
    if (!confirm(t('finance.deleteConfirm') as string)) {
      return
    }
    setTransactions((state) => state.filter((t) => t.id !== id))
    toast.success(t('finance.deleted'))
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Get unique categories that have transactions
  const usedCategories = useMemo(() => {
    const categories = new Set<Category>()
    monthTransactions.forEach((t) => categories.add(t.category))
    return ['All' as const, ...Array.from(categories).sort()] as const
  }, [monthTransactions])

  return (
    <div className="space-y-8">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 sm:p-6 gap-0">
                {/* 移动端头部 */}
                <div className="px-6 pt-8 pb-4 sm:pt-6 border-b border-border/50 sm:border-none">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                        editingType === 'expense' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      )}>
                        {editingType === 'expense' ? '💸' : '💰'}
                      </div>
                      <div className="text-left">
                        <DialogTitle className="text-xl sm:text-xl">
                          {t('finance.newTransaction')}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {editingType === 'expense'
                            ? (locale === 'zh' ? '记录一笔支出' : 'Record an expense')
                            : (locale === 'zh' ? '记录一笔收入' : 'Record an income')
                          }
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-6 py-5 space-y-5 overflow-y-auto">
                  {/* 类型选择 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('finance.type')}
                    </label>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => {
                          setEditingType('expense')
                          setEditingCategory('餐饮')
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'flex-1 rounded-xl border-2 py-4 px-4 transition-all duration-200 flex items-center justify-center gap-2',
                          editingType === 'expense'
                            ? 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300 font-semibold'
                            : 'border-border bg-muted text-muted-foreground'
                        )}
                      >
                        <span className="text-xl">💸</span>
                        <span>{t('finance.expense')}</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setEditingType('income')
                          setEditingCategory('工资')
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'flex-1 rounded-xl border-2 py-4 px-4 transition-all duration-200 flex items-center justify-center gap-2',
                          editingType === 'income'
                            ? 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300 font-semibold'
                            : 'border-border bg-muted text-muted-foreground'
                        )}
                      >
                        <span className="text-xl">💰</span>
                        <span>{t('finance.income')}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* 金额 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('finance.amount')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                        {locale === 'zh' ? '¥' : '$'}
                      </span>
                      <Input
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-10 h-14 text-lg rounded-xl border-muted-foreground/20 focus:border-primary"
                        step="0.01"
                        min="0"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* 分类 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('finance.category')}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {currentCategories.map((cat) => (
                        <motion.button
                          key={cat}
                          onClick={() => setEditingCategory(cat)}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200',
                            editingCategory === cat
                              ? 'ring-2 ring-primary scale-105 ' + CATEGORY_COLORS[cat]
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          )}
                        >
                          <span className={editingCategory === cat ? '' : 'text-muted-foreground'}>
                            {CATEGORY_ICONS[cat]}
                          </span>
                          <span className="text-[10px] sm:text-xs text-center font-medium leading-tight">{cat}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* 日期 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('finance.date')}
                    </label>
                    <Input
                      type="date"
                      value={editingDate}
                      onChange={(e) => setEditingDate(e.target.value)}
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                    />
                  </div>

                  {/* 备注 */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {t('finance.note')}
                    </label>
                    <Textarea
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      placeholder={t('finance.notePlaceholder')}
                      rows={2}
                      className="rounded-xl border-muted-foreground/20 focus:border-primary resize-none"
                    />
                  </div>
                </div>

                <DialogFooter className="px-6 pb-6 pt-2 border-t border-border/50 sm:border-none gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" type="button" className="w-full sm:w-auto h-12 rounded-xl">
                      {t('common.cancel')}
                    </Button>
                  </DialogClose>
                  <ScaleOnTap className="flex-1 sm:flex-none">
                    <Button
                      onClick={saveTransaction}
                      disabled={!editingAmount.trim()}
                      className="w-full sm:w-auto h-12 rounded-xl px-8"
                      size="lg"
                    >
                      {t('common.save')}
                    </Button>
                  </ScaleOnTap>
                </DialogFooter>
              </DialogContent>
            </Dialog>

      {/* Month Navigation */}
      <FadeIn delay={0.1}>
        <div className="flex items-center justify-between gap-4 rounded-[24px] border border-border bg-card/95 p-4 shadow-sm">
          <motion.button
            onClick={previousMonth}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <motion.button
            onClick={nextMonth}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </FadeIn>

      {/* Statistics Cards */}
      <FadeIn delay={0.15}>
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-[24px] border border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">{t('finance.income')}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(stats.income, locale)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-green-200 dark:text-green-800" />
            </div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-[24px] border border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">{t('finance.expense')}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-300">
                  {formatCurrency(stats.expense, locale)}
                </p>
              </div>
              <TrendingDown className="h-10 w-10 sm:h-12 sm:w-12 text-red-200 dark:text-red-800" />
            </div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            className={cn(
              'rounded-[24px] border p-6 shadow-sm',
              stats.balance >= 0
                ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
                : 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-sm', stats.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400')}>
                  {t('finance.balance')}
                </p>
                <p className={cn('mt-2 text-2xl sm:text-3xl font-bold', stats.balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300')}>
                  {formatCurrency(stats.balance, locale)}
                </p>
              </div>
              <DollarSign className={cn('h-10 w-10 sm:h-12 sm:w-12', stats.balance >= 0 ? 'text-blue-200 dark:text-blue-800' : 'text-orange-200 dark:text-orange-800')} />
            </div>
          </motion.div>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {usedCategories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-all duration-200',
                  filterCategory === cat
                    ? 'border-foreground bg-foreground text-background shadow-md'
                    : 'border-border hover:border-foreground'
                )}
              >
                {cat === 'All' ? t('common.all') : cat}
              </motion.button>
            ))}
          </div>

          {/* Transactions List */}
          <AnimatePresence mode="wait">
            {filteredTransactions.length === 0 ? (
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
                <h2 className="mt-6 text-2xl font-semibold">{t('finance.noTransactions')}</h2>
                <p className="mt-2 max-w-xl mx-auto text-sm leading-7 text-muted-foreground">
                  {t('finance.noTransactionsDesc')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.03,
                    },
                  },
                }}
              >
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center justify-between rounded-[20px] border border-border bg-card/95 p-4 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0', CATEGORY_COLORS[transaction.category])}>
                        {CATEGORY_ICONS[transaction.category]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date, locale)}</p>
                        {transaction.note && (
                          <p className="text-xs text-muted-foreground truncate">{transaction.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className={cn(
                        'text-lg font-semibold',
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, locale)}
                      </p>
                      <motion.button
                        onClick={() => deleteTransaction(transaction.id)}
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* FAB */}
      <motion.div
        className="fixed bottom-6 right-6 z-20 lg:right-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <ScaleOnTap scale={0.9}>
          <button
            onClick={openNewTransaction}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-shadow hover:shadow-2xl"
            aria-label={t('finance.newTransaction')}
          >
            <Plus className="h-6 w-6" />
          </button>
        </ScaleOnTap>
      </motion.div>
    </div>
  )
}
