import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./app/store";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { reportError } from "./utils/errors";

// Errors outside React rendering (event handlers' promises, timers) end up here.
window.addEventListener("unhandledrejection", (event) =>
  reportError("unhandledrejection", event.reason),
);
window.addEventListener("error", (event) =>
  reportError("window.error", event.error ?? event.message),
);

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Missing <div id="root"> in index.html');

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (err) {
  reportError("bootstrap", err);
  document.body.textContent =
    "FrameCraft could not start. Please refresh the page.";
}
