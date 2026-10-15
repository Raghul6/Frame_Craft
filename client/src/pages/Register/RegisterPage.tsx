import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import Alert from "../../components/common/Alert";
import FormField from "../../components/common/FormField";
import PasswordInput from "../../components/common/PasswordInput";
import PasswordStrengthMeter from "../../components/common/PasswordStrengthMeter";
import {
  CONTACT_FIELDS,
  CONTACT_MAX_LENGTH,
  CONTACT_TYPES,
  PASSWORD_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
} from "../../constants/auth";
import { register } from "../../features/auth/thunks";
import { useAuth } from "../../hooks/useAuth";
import { useClearAuthErrors } from "../../hooks/useClearAuthErrors";
import { preloadLogin } from "../../routes/lazyPages";
import { PATHS } from "../../routes/paths";
import type { ContactType } from "../../types/auth";
import type { RegisterFormErrors } from "../../types/forms";
import {
  isStrongPassword,
  validateContact,
  validateUsername,
} from "../../utils/validators";
import "../../styles/auth.css";

const validate = (
  username: string,
  contactType: ContactType,
  contact: string,
  password: string,
  confirmPassword: string,
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {
    username: validateUsername(username),
    contact: validateContact(contactType, contact),
  };
  if (!password) errors.password = "Password is required";
  else if (!isStrongPassword(password)) {
    errors.password = "Password does not meet all the requirements below";
  }
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, fieldErrors } = useAuth();
  useClearAuthErrors();

  const [username, setUsername] = useState("");
  const [contactType, setContactType] = useState<ContactType>("email");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const switchContactType = (type: ContactType) => {
    setContactType(type);
    setContact("");
    setErrors((prev) => ({ ...prev, contact: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(
      username,
      contactType,
      contact,
      password,
      confirmPassword,
    );
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    // The thunk handles API errors itself (shown via `error` / `fieldErrors`).
    const user = await dispatch(
      register({
        username: username.trim(),
        contactType,
        contact: contact.trim(),
        password,
      }),
    );
    if (user) navigate(PATHS.home, { replace: true });
  };

  const err = (field: keyof RegisterFormErrors) =>
    errors[field] ?? fieldErrors[field];
  const hasFieldError =
    Object.values(errors).some(Boolean) || Object.keys(fieldErrors).length > 0;
  const contactField = CONTACT_FIELDS[contactType];

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="hero-subtitle">— Join FrameCraft</span>
        <h2>Create your account</h2>
        <p className="auth-intro">
          A customer account lets you save designs, track orders and check out
          faster.
        </p>

        {error && !hasFieldError && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="username"
            label="Username"
            error={err("username")}
            hint="You'll use this to log in."
          >
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!err("username")}
              maxLength={USERNAME_MAX_LENGTH}
              autoFocus
            />
          </FormField>

          <div className="form-field">
            <span className="field-label">Sign up with</span>
            <div className="segmented" role="tablist">
              {CONTACT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={contactType === type}
                  className={contactType === type ? "active" : ""}
                  onClick={() => switchContactType(type)}
                >
                  {CONTACT_FIELDS[type].tab}
                </button>
              ))}
            </div>
          </div>

          <FormField
            id="contact"
            label={contactField.label}
            error={err("contact")}
          >
            <input
              id="contact"
              type={contactField.type}
              inputMode={contactField.inputMode}
              autoComplete={contactField.autoComplete}
              placeholder={contactField.placeholder}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              aria-invalid={!!err("contact")}
              maxLength={CONTACT_MAX_LENGTH}
            />
          </FormField>

          <FormField id="password" label="Password" error={err("password")}>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!err("password")}
              maxLength={PASSWORD_MAX_LENGTH}
            />
            <PasswordStrengthMeter password={password} />
          </FormField>

          <FormField
            id="confirmPassword"
            label="Confirm password"
            error={err("confirmPassword")}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!err("confirmPassword")}
              maxLength={PASSWORD_MAX_LENGTH}
            />
          </FormField>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link
            to={PATHS.login}
            onMouseEnter={preloadLogin}
            onFocus={preloadLogin}
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
