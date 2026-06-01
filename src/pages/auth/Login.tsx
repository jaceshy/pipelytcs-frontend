import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const user = await login({
        email,
        password,
      });

      if (user.role === "admin") {
        navigate("/dashboard");
        return;
      }

      navigate("/team/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {errorMessage && (
            <p style={{ color: "#b42318", fontSize: "14px", margin: 0 }}>
              {errorMessage}
            </p>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="register-text">
            Don’t have an account? <Link to="/signup">Create Account</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;