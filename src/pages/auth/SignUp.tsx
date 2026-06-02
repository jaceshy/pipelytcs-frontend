import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match");
      return;
    }

    setIsLoading(true);

    try {
      const user = await register({
        fullName,
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
        error instanceof Error ? error.message : "Register failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Start your analytics journey today</p>
          </div>

          {errorMessage && (
            <p style={{ color: "#b42318", fontSize: "14px", margin: 0 }}>
              {errorMessage}
            </p>
          )}

          <div className="signup-form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default SignUp;