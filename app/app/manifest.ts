import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FlowNote',
    short_name: 'FlowNote',
    description: 'FlowNote - ideas, journal and finance notes',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f0f0f',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['productivity', 'utilities'],
    lang: 'zh-CN',
    dir: 'ltr',
    scope: '/',
  }
}
