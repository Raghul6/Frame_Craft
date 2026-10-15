import { Component, type ErrorInfo } from "react";
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from "../../types/components";
import { reportError } from "../../utils/errors";

/**
 * Catches errors thrown while rendering its children (try/catch can't catch those)
 * and shows a recovery screen instead of a blank page. React only supports this as
 * a class component.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError("render", { error, componentStack: info.componentStack });
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.reset();
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className={`error-fallback${this.props.inline ? " inline" : ""}`}
        role="alert"
      >
        <h2>Something went wrong</h2>
        <p>
          This part of the page failed to load. You can try again, or go back to
          the home page.
        </p>
        <div className="error-fallback-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.reset}
          >
            Try again
          </button>
          {/* A plain link (not <Link>) because this boundary may sit outside the router. */}
          <a href="/" className="btn btn-secondary">
            Go home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
