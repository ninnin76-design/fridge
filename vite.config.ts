import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 농림축산식품부 API 서버로 전달
      '/api': {
        target: 'http://211.237.50.150:7080', // 사용자가 요청한 특정 IP 주소 및 포트 적용
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
});