import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/BrandLogo";

export interface UserProfile {
  name: string;
  email: string;
  tag: string;
  rank: string;
  xp: string;
  tournamentsCount: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
  onSuccess: (user: UserProfile) => void;
  notify: (msg: string) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess,
  notify,
}: Omit<AuthModalProps, "onSwitchToLogin">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      notify("Please enter your username or email");
      return;
    }
    if (!password) {
      notify("Please enter your password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        name: username.toUpperCase(),
        email: username.includes("@") ? username : `${username.toLowerCase()}@egorgaming.dz`,
        tag: `#DZ-${Math.floor(1000 + Math.random() * 9000)}`,
        rank: "PLATINUM IV",
        xp: "2,840 XP",
        tournamentsCount: 3,
      });
      notify(`Welcome back, ${username}! Authenticated.`);
      onClose();
    }, 450);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        name: "AKRAM",
        email: "akram@egorgaming.dz",
        tag: "#DZ-7721",
        rank: "DIAMOND II",
        xp: "4,620 XP",
        tournamentsCount: 5,
      });
      notify("Logged in as AKRAM (Demo User)");
      onClose();
    }, 300);
  };

  return (
    <div
      className="egor-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="egor-auth-card">
        {/* Top bar with close */}
        <div className="egor-auth-top">
          <div className="egor-auth-badge">
            <BrandMark size="sm" />
            <span>EGOR // HUB_STATION</span>
          </div>
          <button className="egor-modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="egor-auth-head">
          <span className="eyebrow">AUTHENTICATION // PROTOCOL</span>
          <h2>WELCOME <em>BACK.</em></h2>
          <p>Sign in to access your dashboard, tournaments, and games.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="egor-auth-form">
          <div className="egor-form-field">
            <label>CALLSIGN OR EMAIL</label>
            <div className="egor-input-wrapper">
              <User size={15} className="egor-input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Akram or user@example.com"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="egor-form-field">
            <div className="egor-field-header">
              <label>PASSWORD</label>
              <button
                type="button"
                className="egor-forgot-link"
                onClick={() => notify("Password reset link sent to registered email")}
              >
                Forgot?
              </button>
            </div>
            <div className="egor-input-wrapper">
              <Lock size={15} className="egor-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="egor-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="egor-remember-row">
            <label className="egor-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="egor-custom-check">
                {rememberMe && <Check size={11} />}
              </span>
              <span>Remember this station</span>
            </label>
            <span className="egor-security-tag"><Shield size={12} /> SECURE 256-BIT</span>
          </div>

          <div className="egor-form-actions">
            <button
              type="submit"
              className="action-button egor-auth-submit"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN TO ACCOUNT"}
              {!loading && <ArrowRight size={15} />}
            </button>

            <button
              type="button"
              className="egor-auth-demo-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <Zap size={14} className="text-lime" />
              <span>⚡ ONE-CLICK DEMO SIGN IN (AKRAM)</span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="egor-auth-divider">
          <span>OR CONNECT WITH</span>
        </div>

        {/* Social */}
        <div className="egor-social-grid">
          <button
            type="button"
            className="egor-social-btn"
            onClick={() => {
              notify("Connecting via Google...");
              handleDemoLogin();
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            className="egor-social-btn"
            onClick={() => {
              notify("Connecting via Discord...");
              handleDemoLogin();
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Discord</span>
          </button>
        </div>

        {/* Footer switch */}
        <div className="egor-auth-foot">
          <p>
            New to the platform?{" "}
            <button
              type="button"
              className="egor-switch-link"
              onClick={onSwitchToRegister}
            >
              CREATE NEW ACCOUNT
            </button>
          </p>
          <a
            href="https://egorgaming.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="egor-official-link"
          >
            <span>Official egorgaming.com/login</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
  notify,
}: Omit<AuthModalProps, "onSwitchToRegister">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      notify("Please choose a username/callsign");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      notify("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      notify("Password should be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      notify("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      notify("Please accept the Terms & Privacy Policies");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        name: username.toUpperCase(),
        email: email,
        tag: `#DZ-${Math.floor(1000 + Math.random() * 9000)}`,
        rank: "BRONZE I",
        xp: "100 XP",
        tournamentsCount: 0,
      });
      notify(`Welcome to the arena, ${username}! Account created.`);
      onClose();
    }, 500);
  };

  const handleDemoRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        name: "STRIKER_DZ",
        email: "striker@egorgaming.dz",
        tag: "#DZ-9024",
        rank: "SILVER III",
        xp: "850 XP",
        tournamentsCount: 1,
      });
      notify("Registered & logged in as STRIKER_DZ");
      onClose();
    }, 350);
  };

  return (
    <div
      className="egor-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="egor-auth-card egor-auth-card--register">
        {/* Top bar with close */}
        <div className="egor-auth-top">
          <div className="egor-auth-badge">
            <BrandMark size="sm" />
            <span>EGOR // ESTABLISH_IDENTITY</span>
          </div>
          <button className="egor-modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="egor-auth-head">
          <span className="eyebrow">NEW OPERATOR // REGISTRATION</span>
          <h2>FORGE YOUR <em>LEGACY.</em></h2>
          <p>Enter the grid. Secure your callsign. Join Algeria&apos;s elite esports platform.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="egor-auth-form">
          <div className="egor-form-grid">
            <div className="egor-form-field">
              <label>CALLSIGN (USERNAME)</label>
              <div className="egor-input-wrapper">
                <User size={15} className="egor-input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. StrikeMaster"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="egor-form-field">
              <label>EMAIL ADDRESS</label>
              <div className="egor-input-wrapper">
                <Mail size={15} className="egor-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          <div className="egor-form-field">
            <label>PHONE NUMBER (ALGERIA)</label>
            <div className="egor-input-wrapper">
              <span className="egor-country-prefix">🇩🇿 +213</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="550 12 34 56"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="egor-form-grid">
            <div className="egor-form-field">
              <label>PASSWORD</label>
              <div className="egor-input-wrapper">
                <Lock size={15} className="egor-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="egor-form-field">
              <label>CONFIRM PASSWORD</label>
              <div className="egor-input-wrapper">
                <Lock size={15} className="egor-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="egor-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="egor-remember-row">
            <label className="egor-checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="egor-custom-check">
                {agreeTerms && <Check size={11} />}
              </span>
              <span>
                I agree to the{" "}
                <a
                  href="https://egorgaming.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="egor-terms-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms &amp; Privacy Policies
                </a>
              </span>
            </label>
          </div>

          <div className="egor-form-actions">
            <button
              type="submit"
              className="action-button egor-auth-submit"
              disabled={loading}
            >
              {loading ? "ESTABLISHING IDENTITY..." : "CREATE ACCOUNT"}
              {!loading && <ArrowRight size={15} />}
            </button>

            <button
              type="button"
              className="egor-auth-demo-btn"
              onClick={handleDemoRegister}
              disabled={loading}
            >
              <Zap size={14} className="text-lime" />
              <span>⚡ ONE-CLICK DEMO REGISTER</span>
            </button>
          </div>
        </form>

        {/* Footer switch */}
        <div className="egor-auth-foot">
          <p>
            Already registered?{" "}
            <button
              type="button"
              className="egor-switch-link"
              onClick={onSwitchToLogin}
            >
              ENTER ARENA. LOGIN
            </button>
          </p>
          <a
            href="https://egorgaming.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="egor-official-link"
          >
            <span>Official egorgaming.com/register</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
