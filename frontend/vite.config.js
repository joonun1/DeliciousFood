// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 스프링 부트
        changeOrigin: true,
        secure: false,                   // (http 백엔드면 안전)
        // ws: true,                      // 웹소켓 쓰면 켜기
        // rewrite: p => p,               // /api 접두어 유지 (우리 백엔드가 /api 사용하니까 그대로)
      },
    },
  },
})
