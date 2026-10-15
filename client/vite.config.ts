import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Libraries change far less often than app code. Giving each its own stable chunk
// means a deploy that only touches the app doesn't make visitors re-download React.
const VENDOR_CHUNKS = [
  { name: "vendor-react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
  { name: "vendor-router", test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
  {
    name: "vendor-redux",
    test: /node_modules[\\/](@reduxjs|react-redux|redux|immer|reselect|redux-thunk|use-sync-external-store)[\\/]/,
  },
  { name: "vendor-axios", test: /node_modules[\\/]axios[\\/]/ },
  { name: "vendor-icons", test: /node_modules[\\/]lucide-react[\\/]/ },
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fail instead of silently moving to 5174 — the server's CORS allows only CLIENT_ORIGIN.
    strictPort: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: { groups: VENDOR_CHUNKS },
      },
    },
  },
});
