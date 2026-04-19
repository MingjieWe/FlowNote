// Chunked localStorage utility for handling large data volumes
// Automatically splits data into chunks to avoid localStorage quota limits

const CHUNK_PREFIX = 'flownote-chunk-'
const MAX_CHUNK_SIZE = 1024 * 1024 // 1MB per chunk (localStorage typically allows 5-10MB total)

interface ChunkedData {
  chunks: number
  totalSize: number
  timestamp: number
}

export const storage = {
  // Save data with automatic chunking if needed
  setItem(key: string, data: unknown): boolean {
    try {
      const serialized = JSON.stringify(data)
      const size = new Blob([serialized]).size

      // Clear any existing chunks first
      this.clearChunks(key)

      // If data is small enough, save normally
      if (size < MAX_CHUNK_SIZE) {
        localStorage.setItem(key, serialized)
        return true
      }

      // Otherwise, chunk the data
      const chunks = Math.ceil(size / MAX_CHUNK_SIZE)
      const chunkSize = Math.ceil(serialized.length / chunks)

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, serialized.length)
        const chunk = serialized.slice(start, end)
        localStorage.setItem(`${CHUNK_PREFIX}${key}-${i}`, chunk)
      }

      // Store metadata
      const meta: ChunkedData = {
        chunks,
        totalSize: size,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify({ __chunked: true, ...meta }))

      return true
    } catch (error) {
      console.error('Storage save failed:', error)
      return false
    }
  },

  // Load data, automatically handling chunked data
  getItem<T>(key: string): T | null {
    try {
      const metaRaw = localStorage.getItem(key)
      if (!metaRaw) return null

      const meta = JSON.parse(metaRaw)

      // If not chunked, return directly
      if (!meta.__chunked) {
        return JSON.parse(metaRaw) as T
      }

      // Reconstruct chunked data
      let serialized = ''
      for (let i = 0; i < meta.chunks; i++) {
        const chunk = localStorage.getItem(`${CHUNK_PREFIX}${key}-${i}`)
        if (chunk === null) {
          console.error(`Missing chunk ${i} for key ${key}`)
          return null
        }
        serialized += chunk
      }

      return JSON.parse(serialized) as T
    } catch (error) {
      console.error('Storage load failed:', error)
      return null
    }
  },

  // Remove item and any associated chunks
  removeItem(key: string): void {
    this.clearChunks(key)
    localStorage.removeItem(key)
  },

  // Clear chunks for a specific key
  clearChunks(key: string): void {
    const metaRaw = localStorage.getItem(key)
    if (!metaRaw) return

    try {
      const meta = JSON.parse(metaRaw)
      if (meta.__chunked && meta.chunks) {
        for (let i = 0; i < meta.chunks; i++) {
          localStorage.removeItem(`${CHUNK_PREFIX}${key}-${i}`)
        }
      }
    } catch {
      // Not valid JSON, ignore
    }
  },

  // Get storage usage statistics
  getUsage(): { used: number; total: number; percentage: number } {
    let used = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        used += new Blob([key]).size + new Blob([value]).size
      }
    }

    // Estimate total (varies by browser, typically 5-10MB)
    const total = 5 * 1024 * 1024
    const percentage = (used / total) * 100

    return { used, total, percentage }
  },

  // Check if storage is nearly full
  isNearlyFull(threshold = 80): boolean {
    const { percentage } = this.getUsage()
    return percentage >= threshold
  },

  // Clear all app data
  clearAll(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('flownote-') || key.startsWith(CHUNK_PREFIX))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  },
}

// Hook for using storage with loading state
export function useStorage() {
  return storage
}
