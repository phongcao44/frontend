import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ['fa7a81d9cccc.ngrok-free.app'] // 👈 Thêm domain ngrok ở đây
  }
});
