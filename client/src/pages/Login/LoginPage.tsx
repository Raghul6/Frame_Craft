import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import Alert from "../../components/common/Alert";
import FormField from "../../components/common/FormField";
import { PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH } from "../../constants/auth";
import PasswordInput from "../../components/common/PasswordInput";
import { login } from "../../features/auth/thunks";
import { useAuth } from "../../hooks/useAuth";
import { useClearAuthErrors } from "../../hooks/useClearAuthErrors";
import { preloadRegister } from "../../routes/lazyPages";
import { getPostLoginPath, PATHS } from "../../routes/paths";
import type { RedirectState } from "../../types/auth";
import type { LoginFormErrors } from "../../types/forms";
import "../../styles/auth.css";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, fieldErrors } = useAuth();
  useClearAuthErrors();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: LoginFormErrors = {};
    if (!username.trim()) next.username = "Username is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    // The thunk handles API errors itself (shown via `error` below).
    const user = await dispatch(login({ username: username.trim(), password }));
    if (user) {
      const from = (location.state as RedirectState | null)?.from;
      navigate(getPostLoginPath(user.role, from), { replace: true });
    }
  };

  const usernameError = errors.username ?? fieldErrors.username;
  const passwordError = errors.password ?? fieldErrors.password;

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="hero-subtitle">— Welcome back</span>
        <h2>Log in</h2>
        <p className="auth-intro">
          Sign in to track orders and save your frame designs.
        </p>

        {error && !usernameError && !passwordError && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="username" label="Username" error={usernameError}>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!usernameError}
              maxLength={USERNAME_MAX_LENGTH}
              autoFocus
            />
          </FormField>

          <FormField id="password" label="Password" error={passwordError}>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!passwordError}
              maxLength={PASSWORD_MAX_LENGTH}
            />
          </FormField>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New to FrameCraft?{" "}
          <Link
            to={PATHS.register}
            onMouseEnter={preloadRegister}
            onFocus={preloadRegister}
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
