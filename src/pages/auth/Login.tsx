import "./Login.css";

const Login = () => {
  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand">
          <div className="brand-logo">P</div>

          <div className="brand-text">
            <h1>Pipelytcs</h1>
            <p>Unified Sales Analytics Across All Platforms</p>
          </div>

          <div className="platform-list">
            <div className="platform-card shopee">
              <img src="/logos/shopee.png" alt="Shopee" />
              <span>Shopee</span>
            </div>

            <div className="platform-card tokopedia">
              <img src="/logos/tokopedia.png" alt="Tokopedia" />
              <span>Tokopedia</span>
            </div>

            <div className="platform-card tiktok">
              <img src="/logos/tiktokshop.png" alt="TikTok Shop" />
              <span>TikTok Shop</span>
            </div>

            <div className="platform-card instagram">
              <img src="/logos/instagram.png" alt="Instagram" />
              <span>Instagram</span>
            </div>
          </div>
        </div>

        <form className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" />
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="register-text">
            Don’t have an account? <a href="/signup">Create Account</a>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;