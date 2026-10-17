import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

/** Same default as src/constants/api.ts (DEFAULT_API_HOST). */
const DEFAULT_API_HOST = "http://localhost:5000";

/**
 * Content-Security-Policy for the production build: scripts, styles and API calls may
 * only come from this site, Google Fonts and the API host. If someone manages to inject
 * HTML (XSS), the browser refuses to run their scripts or send data elsewhere.
 * Build-only: the dev server needs inline scripts for hot reload.
 */
const contentSecurityPolicy = (apiHost: string): Plugin => {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Frame photos can be any https:// image URL.
    "img-src 'self' https: data:",
    `connect-src 'self'${apiHost ? ` ${apiHost}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "meta",
        attrs: { "http-equiv": "Content-Security-Policy", content: policy },
        injectTo: "head-prepend",
      },
    ],
  };
};

// Libraries change far less often than app code. Giving each its own stable chunk
// means a deploy that only touches the app doesn't make visitors re-download React.
const VENDOR_CHUNKS = [
  {
    name: "vendor-react",
    test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
  },
  {
    name: "vendor-router",
    test: /node_modules[\\/](react-router|react-router-dom)[\\/]/,
  },
  {
    name: "vendor-redux",
    test: /node_modules[\\/](@reduxjs|react-redux|redux|immer|reselect|redux-thunk|use-sync-external-store)[\\/]/,
  },
  { name: "vendor-axios", test: /node_modules[\\/]axios[\\/]/ },
  { name: "vendor-icons", test: /node_modules[\\/]lucide-react[\\/]/ },
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // Not set in a production build → the app calls its own site (see src/config/env.ts).
  const apiHost = (
    env.VITE_API_HOST ?? (mode === "production" ? "" : DEFAULT_API_HOST)
  ).replace(/\/+$/, "");

  return {
    plugins: [react(), contentSecurityPolicy(apiHost)],
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
  };
});
