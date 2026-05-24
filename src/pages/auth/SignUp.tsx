import "./SignUp.css";

const SignUp = () => {
  return (
    <main className="signup-page">
      <section className="signup-container">
        <div className="signup-left">
          <div className="signup-logo">P</div>

          <div className="signup-brand-text">
            <h1>Join Pipelytcs</h1>
            <p>
              Start tracking your sales across all platforms
              <br />
              in one unified dashboard
            </p>
          </div>

          <div className="feature-list">
            <div className="feature-card">
              <img src="/assets/auth/icon-analytics.png" alt="Analytics" />
              <span>Real-time analytics across all platforms</span>
            </div>

            <div className="feature-card">
              <img src="/assets/auth/icon-robot.png" alt="Robot" />
              <span>Analytics sales recommendations</span>
            </div>

            <div className="feature-card">
              <img src="/assets/auth/icon-forecast.png" alt="Forecast" />
              <span>Predictive sales forecasting</span>
            </div>
          </div>
        </div>

        <form className="signup-card">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Start your analytics journey today</p>
          </div>

          <div className="signup-form-group">
            <label>Full Name</label>
            <input type="text" />
          </div>

          <div className="signup-form-group">
            <label>Email</label>
            <input type="email" />
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <input type="password" />
          </div>

          <div className="signup-form-group">
            <label>Confirm Password</label>
            <input type="password" />
          </div>

          <label className="terms-row">
            <input type="checkbox" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <button type="submit" className="signup-button">
            Create Account
          </button>

          <p className="login-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </section>
    </main>
  );
};

export default SignUp;