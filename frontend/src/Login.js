import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.loggedIn) {
      const to = location.state?.from?.pathname || "/books";
      navigate(to, { replace: true });
    }
  }, [user, navigate, location.state]);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!emailOk(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login({ name: name.trim(), email: email.trim() });
    const to = location.state?.from?.pathname || "/books";
    navigate(to, { replace: true });
  };

  return (
    <div className="page page-login">
      <Navbar page="default" />
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-card__title">Sign in</h1>
          <p className="login-card__hint">
            All fields are required to access your library.
          </p>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </label>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </label>
            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </label>
            <button type="submit" className="btn btn-login-submit">
              Login
            </button>
          </form>
          <p className="login-footer">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

