import "./Login.css";

type Platform = "shopee" | "tokopedia" | "tiktok" | "instagram";

function PlatformIcon({ type }: { type: Platform }) {
  if (type === "shopee") {
    return (
      <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
        <path
          d="M18 23h28l-2.2 30H20.2L18 23Z"
          fill="#FF6B35"
        />
        <path
          d="M24 23c0-7 3.5-12 8-12s8 5 8 12"
          stroke="#FF6B35"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="44"
          textAnchor="middle"
          fontSize="25"
          fontFamily="Arial"
          fill="white"
        >
          S
        </text>
      </svg>
    );
  }

  if (type === "tokopedia") {
    return (
      <svg width="59" height="59" viewBox="0 0 64 64" fill="none">
        <rect x="16" y="17" width="36" height="35" rx="4" fill="#26B64F" />
        <path d="M20 18C21 10 28 7 34 15" stroke="#297126" strokeWidth="5" strokeLinecap="round" />
        <circle cx="28" cy="32" r="7" fill="#EDEDED" stroke="#111" strokeWidth="1.5" />
        <circle cx="43" cy="32" r="7" fill="#EDEDED" stroke="#111" strokeWidth="1.5" />
        <circle cx="28" cy="32" r="3" fill="#303030" />
        <circle cx="43" cy="32" r="3" fill="#303030" />
        <path d="M31 43c4 3 8 3 12 0" stroke="#303030" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 39h4l-2 3-2-3Z" fill="#FEDE02" stroke="#111" strokeWidth="1" />
      </svg>
    );
  }

  if (type === "tiktok") {
    return (
      <svg width="47" height="47" viewBox="0 0 64 64" fill="none">
        <path
          d="M37 10v30.5C37 49 30.5 55 22 55c-7 0-12-4.5-12-11s5.2-11 12-11c1.4 0 2.7.2 4 .7v8.2c-1-.6-2.1-.9-3.4-.9-2.9 0-5 1.9-5 4.4 0 2.7 2.1 4.5 5 4.5 3.2 0 5.4-2.2 5.4-6V10h9Z"
          fill="#00F2EA"
        />
        <path
          d="M42 10c1.3 7 5.4 11.7 12 13.2v8.4c-4.7-.2-8.7-1.8-12-4.8V10Z"
          fill="#FF004F"
        />
        <path
          d="M34 8v30.5C34 47 27.5 53 19 53c-7 0-12-4.5-12-11s5.2-11 12-11c1.4 0 2.7.2 4 .7v8.2c-1-.6-2.1-.9-3.4-.9-2.9 0-5 1.9-5 4.4 0 2.7 2.1 4.5 5 4.5 3.2 0 5.4-2.2 5.4-6V8h9Z"
          fill="#000000"
        />
        <path
          d="M39 8c1.3 7 5.4 11.7 12 13.2v8.4c-4.7-.2-8.7-1.8-12-4.8V8Z"
          fill="#000000"
        />
      </svg>
    );
  }

  return (
    <svg width="65" height="65" viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="ig1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 58) rotate(-54) scale(70)">
          <stop stopColor="#FFDD55" />
          <stop offset="0.22" stopColor="#FF543E" />
          <stop offset="0.55" stopColor="#C837AB" />
          <stop offset="1" stopColor="#3771C8" />
        </radialGradient>
      </defs>
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#ig1)" />
      <rect x="18" y="18" width="28" height="28" rx="9" stroke="white" strokeWidth="4" />
      <circle cx="32" cy="32" r="8" stroke="white" strokeWidth="4" />
      <circle cx="43" cy="21" r="3" fill="white" />
    </svg>
  );
}

function PlatformCard({
  type,
  label,
}: {
  type: Platform;
  label: string;
}) {
  return (
    <div className="platform-card">
      <PlatformIcon type={type} />
      <p className={`platform-label ${type}`}>{label}</p>
    </div>
  );
}

function LoginInput({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) {
  return (
    <div className="login-input-group">
      <label>{label}</label>
      <input type={type} />
    </div>
  );
}

export default function Login() {
  return (
    <main className="login-page">
      <section className="login-wrapper">
        <div className="login-left">
          <div className="login-brand-logo">P</div>

          <div className="login-brand-text">
            <h1>Pipelytcs</h1>
            <p>Unified Sales Analytics Across All Platforms</p>
          </div>

          <div className="platform-list">
            <PlatformCard type="shopee" label="Shopee" />
            <PlatformCard type="tokopedia" label="Tokopedia" />
            <PlatformCard type="tiktok" label="TikTok Shop" />
            <PlatformCard type="instagram" label="Instagram" />
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="login-form">
            <LoginInput label="Email" type="email" />
            <LoginInput label="Password" type="password" />

            <div className="login-options">
              <label className="remember-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="login-divider">
              <span></span>
              <p>Or continue with</p>
              <span></span>
            </div>

            <button type="button" className="login-button">
              Continue with Google
            </button>

            <p className="create-account-text">
              Don’t have an account? <a href="/signup">Create Account</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}