import { useState } from "react";
import { login } from "../auth/authService";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await login(email, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      alert("Login successful");
      window.location.href = "/dashboard";
    } 
    catch (err) {
      alert("Invalid credentials");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">AI Chatbot Portal</h2>
        <p className="subtitle">Student • Faculty • Admin</p>

        <input
          className="input"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
