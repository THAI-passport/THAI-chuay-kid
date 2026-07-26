import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Relative base so the build works from any GitHub Pages project sub-path.
export default defineConfig({
  base: '/THAI-chuay-kid/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'THAI ช่วยคิด',
        short_name: 'ช่วยคิด',
        description: 'คำนวณและติดตามการใช้สิทธิ์ ไทยช่วยไทย 60/40',
        lang: 'th',
        theme_color: '#0050AE',
        background_color: '#F4F6F9',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
