import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // --------- Validation functions ----------
  const validateEmail = (value) => {
    if (!value || value.trim() === "") {
      return "Please enter a valid email";
    }
    return null;
  };

  const validatePassword = (value) => {
    if (!value || value.trim() === "") {
      return "Please enter a valid password";
    }
    return null;
  };

  // --------- Login handler ----------
  const handleLogin = async () => {
    setMsg("");

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
      setMsg(emailError);
      return;
    }

    if (passwordError) {
      setMsg(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        userEmail: email, // إرسال الإيميل للسيرفر
        userPassword: password,
      });

      if (response.data.success) {
        alert("Login successful");

        const user = response.data.user;

        // تخزين بيانات المستخدم في localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userName", response.data.userName || "");

        // تحويل حسب نوع المستخدم
        if (response.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/events");
        }
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  // --------- Inline styles ----------
  const styles = {
    card: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      borderRadius: "16px",
      backgroundColor: "#fff",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      textAlign: "center",
    },
    logo: { width: "110px", marginBottom: "20px" },
    title: { fontSize: "22px", marginBottom: "20px", color: "#333" },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "#2a9db5",
      color: "white",
      padding: "12px 0",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      marginBottom: "12px",
      transition: "0.3s",
    },
    linkText: { color: "#2a9db5", cursor: "pointer", marginLeft: "4px" },
    errorMsg: { color: "red", textAlign: "center", marginBottom: "12px" },
  };

  return (
    <div style={styles.card}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.title}>Volunteer Opportunities System</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button
        style={styles.button}
        onClick={handleLogin}
        disabled={loading}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1a7a8a")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2a9db5")}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {msg && <p style={styles.errorMsg}>{msg}</p>}

      <div style={{ fontSize: "14px", color: "#666" }}>
        Don’t have an account?
        <span style={styles.linkText} onClick={() => navigate("/register")}>
          Sign Up
        </span>
      </div>
    </div>
  );
}

export default Login;
