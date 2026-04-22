'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * 主题初始化组件
 *
 * 处理 Capacitor App 的主题同步：
 * 1. App 启动时，原生端检测系统主题并设置 localStorage.theme
 * 2. 此组件在挂载时读取并应用主题
 * 3. 后续主题切换由用户控制，不再跟随系统
 */
export function ThemeInit() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 读取 localStorage 中的主题（由原生端或用户设置）
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'dark' || savedTheme === 'light') {
      // 应用保存的主题
      setTheme(savedTheme)

      // 确保 HTML class 正确
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(savedTheme)
    }

    setMounted(true)
  }, [setTheme])

  // 调试输出
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      console.log('ThemeInit: current theme =', resolvedTheme)
    }
  }, [mounted, resolvedTheme])

  return null
}
