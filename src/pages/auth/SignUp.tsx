import React from 'react';
import "./SignUp.css";

function FeatureCard({
  icon,
  text,
}: {
  icon: "chart" | "robot" | "insight";
  text: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon === "chart" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="10" width="3" height="8" rx="1" fill="white" />
            <rect x="10.5" y="6" width="3" height="12" rx="1" fill="white" />
            <rect x="17" y="13" width="3" height="5" rx="1" fill="white" />
          </svg>
        )}

        {icon === "robot" && (
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="7" width="14" height="11" rx="3" fill="white" />
            <circle cx="9" cy="12" r="1.4" fill="#8AA9FD" />
            <circle cx="15" cy="12" r="1.4" fill="#8AA9FD" />
            <path d="M10 15h4" stroke="#8AA9FD" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 4v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {icon === "insight" && (
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 17l5-5 4 3 6-8"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="4" cy="17" r="1.8" fill="white" />
            <circle cx="9" cy="12" r="1.8" fill="white" />
            <circle cx="13" cy="15" r="1.8" fill="white" />
            <circle cx="19" cy="7" r="1.8" fill="white" />
          </svg>
        )}
      </div>

      <p>{text}</p>
    </div>
  );
}

function InputField({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} />
    </div>
  );
}

export default function SignUp() {
  return (
    <main className="signup-page">
      <section className="signup-wrapper">
        <div className="signup-left">
          <div className="brand-logo">P</div>

          <div className="brand-text">
            <h1>Join Pipelytcs</h1>
            <p>Start tracking your sales across all platforms in one unified dashboard</p>
          </div>

          <div className="feature-list">
            <FeatureCard icon="chart" text="Real-time analytics across all platforms" />
            <FeatureCard icon="robot" text="AI-powered sales recommendations" />
            <FeatureCard icon="insight" text="Multi-currency & multi-language support" />
          </div>
        </div>

        <div className="signup-card">
          <div className="form-heading">
            <h2>Create Account</h2>
            <p>Start your analytics journey today</p>
          </div>

          <form className="signup-form">
            <InputField label="Full Name" />
            <InputField label="Email" type="email" />
            <InputField label="Business Category" />
            <InputField label="Password" type="password" />
            <InputField label="Confirm Password" type="password" />

            <label className="terms-row">
              <input type="checkbox" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <button type="submit" className="form-button">
              Create Account
            </button>

            <div className="divider">
              <span></span>
              <p>Or continue with</p>
              <span></span>
            </div>

            <button type="button" className="form-button google-button">
              Continue with Google
            </button>

            <p className="login-text">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}