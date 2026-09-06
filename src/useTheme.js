import { useState, useEffect } from 'react'

/**
 * Light or dark, following the operating system until the user picks a side.
 * index.html applies the same class before first paint; this keeps React in
 * step with it afterwards.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* private mode, or storage blocked */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('theme', theme) } catch { /* nothing to do */ }
  }, [theme])

  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))]
}
