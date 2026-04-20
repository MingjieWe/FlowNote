'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'zh' | 'en'

interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Locale, Translations> = {
  zh: {
    // Navigation
    nav: {
      ideas: '灵感',
      journal: '日记',
      finance: '财务',
    },
    // Ideas page
    ideas: {
      title: '灵感笔记',
      description: '随时捕捉、筛选和编辑您的想法卡片。您的笔记安全地保存在本地。',
      newIdea: '新灵感',
      editIdea: '编辑灵感',
      noIdeas: '创造新的灵感',
      noIdeasDesc: '使用下方按钮创建您的一个新灵感，或清除当前筛选查看所有笔记。',
      allTags: '全部',
      titlePlaceholder: '灵感标题',
      contentPlaceholder: '描述您的想法...',
      tagsPlaceholder: '用逗号分隔标签',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      deleteConfirm: '确定要永久删除这个灵感吗？',
      created: '灵感已创建',
      updated: '灵感已更新',
      deleted: '灵感已删除',
    },
    // Journal page
    journal: {
      title: '每日反思',
      description: '记录您的想法、感受和时刻。每一个条目都是珍贵的回忆。',
      today: '今天',
      noEntries: '本月无记录',
      noEntriesDesc: '开始您的日记之旅，写下您的第一篇日记。点击日历上的日期开始记录。',
      howAreYou: '您感觉如何？',
      whatsOnMind: '在想什么？',
      writeFreely: '自由书写... 您的想法、感受、经历...',
      saveEntry: '保存日记',
      close: '关闭',
      deleteConfirm: '确定要删除这篇日记吗？',
      saved: '日记已保存',
      updated: '日记已更新',
      deleted: '日记已删除',
      moods: {
        happy: '开心',
        calm: '平静',
        sad: '难过',
        excited: '兴奋',
        tired: '疲惫',
        anxious: '焦虑',
      },
    },
    // Finance page
    finance: {
      title: '财务管理',
      description: '追踪收入和支出，分析消费习惯，明智地管理您的财务。',
      newTransaction: '新交易',
      income: '收入',
      expense: '支出',
      amount: '金额',
      category: '分类',
      date: '日期',
      note: '备注（可选）',
      notePlaceholder: '添加备注...',
      noTransactions: '开始记账',
      noTransactionsDesc: '记录您的第一笔交易，开始管理您的财务。',
      balance: '结余',
      type: '类型',
      deleteConfirm: '确定要删除这笔交易吗？',
      saved: '交易已记录',
      deleted: '交易已删除',
      categories: {
        // Expense
        餐饮: '餐饮',
        交通: '交通',
        购物: '购物',
        娱乐: '娱乐',
        居住: '居住',
        医疗: '医疗',
        教育: '教育',
        其他支出: '其他',
        // Income
        工资: '工资',
        投资: '投资',
        兼职: '兼职',
        奖金: '奖金',
        其他收入: '其他',
      },
    },
    // Common
    common: {
      loading: '加载中...',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      create: '创建',
      search: '搜索',
      filter: '筛选',
      all: '全部',
      version: '版本',
      title: '标题',
      content: '内容',
      tags: '标签',
    },
  },
  en: {
    // Navigation
    nav: {
      ideas: 'Ideas',
      journal: 'Journal',
      finance: 'Finance',
    },
    // Ideas page
    ideas: {
      title: 'Ideas',
      description: 'Capture, filter, and edit your idea cards instantly. Your notes are saved locally.',
      newIdea: 'New Idea',
      editIdea: 'Edit Idea',
      noIdeas: 'Create New Inspiration',
      noIdeasDesc: 'Use the button below to create a new inspiration, or clear the current filter to see all notes.',
      allTags: 'All',
      titlePlaceholder: 'Brainstorm title',
      contentPlaceholder: 'Describe the idea...',
      tagsPlaceholder: 'Separate tags with commas',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: 'Delete this idea permanently?',
      created: 'Idea created',
      updated: 'Idea updated',
      deleted: 'Idea deleted',
    },
    // Journal page
    journal: {
      title: 'Journal',
      description: 'Capture your thoughts, feelings, and moments. Every entry is precious.',
      today: 'Today',
      noEntries: 'No entries this month',
      noEntriesDesc: 'Start your journaling journey by writing your first entry. Click on a date in the calendar to begin.',
      howAreYou: 'How are you feeling?',
      whatsOnMind: "What's on your mind?",
      writeFreely: 'Write freely... Your thoughts, feelings, experiences...',
      saveEntry: 'Save Entry',
      close: 'Close',
      deleteConfirm: 'Delete this journal entry?',
      saved: 'Entry saved',
      updated: 'Entry updated',
      deleted: 'Entry deleted',
      moods: {
        happy: 'Happy',
        calm: 'Calm',
        sad: 'Sad',
        excited: 'Excited',
        tired: 'Tired',
        anxious: 'Anxious',
      },
    },
    // Finance page
    finance: {
      title: 'Finance',
      description: 'Monitor income and expenses, analyze spending patterns, and manage your finances wisely.',
      newTransaction: 'New Transaction',
      income: 'Income',
      expense: 'Expense',
      amount: 'Amount',
      category: 'Category',
      date: 'Date',
      note: 'Note (optional)',
      notePlaceholder: 'Add a note...',
      noTransactions: 'Start tracking',
      noTransactionsDesc: 'Record your first transaction to begin managing your finances.',
      balance: 'Balance',
      type: 'Type',
      deleteConfirm: 'Delete this transaction?',
      saved: 'Transaction recorded',
      deleted: 'Transaction deleted',
      categories: {
        // Expense
        餐饮: 'Food',
        交通: 'Transport',
        购物: 'Shopping',
        娱乐: 'Entertainment',
        居住: 'Housing',
        医疗: 'Medical',
        教育: 'Education',
        其他支出: 'Other',
        // Income
        工资: 'Salary',
        投资: 'Investment',
        兼职: 'Freelance',
        奖金: 'Bonus',
        其他收入: 'Other',
      },
    },
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      version: 'Version',
      title: 'Title',
      content: 'Content',
      tags: 'Tags',
    },
  },
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = 'flownote-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: string | Translations = translations[locale]

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k]
      } else {
        // Fallback to English
        let fallback: string | Translations = translations['en']
        for (const fk of keys) {
          if (typeof fallback === 'object' && fallback !== null && fk in fallback) {
            fallback = fallback[fk]
          } else {
            return key
          }
        }
        return typeof fallback === 'string' ? fallback : key
      }
    }

    return typeof value === 'string' ? value : key
  }

  // Provide default context during SSR
  if (!mounted) {
    return (
      <I18nContext.Provider value={{
        locale: 'zh',
        setLocale: () => {},
        t: (key: string) => key,
      }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
