import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Prevent "process is not defined" error in browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
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
  };
});