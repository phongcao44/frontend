import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ['dff5f19a4f17.ngrok-free.app'] // 👈 Thêm domain ngrok ở đây
  }
});
