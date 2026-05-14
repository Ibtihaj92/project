import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";

// Yup validation schema
const RegisterSchema = yup.object().shape({
  userName: yup.string().required("User name is required"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email "),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  address: yup.string().required("Please select a Address"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain numbers only")
    .length(8, "Phone number must be exactly 8 digits"),
});

//  Governorates
const governorates = [
  "Muscat",
  "Dhofar",
  "Al Batinah North",
  "Al Batinah South",
  "Al Dakhiliyah",
  "Al Dhahirah",
  "Al Sharqiyah North",
  "Al Sharqiyah South",
  "Al Wusta",
  "Musandam",
  "Al Buraimi",
];

function Register() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      address: "",
      phone: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMsg("");

    try {
      await axios.post("http://localhost:5000/register", {
        userName: data.userName,
        userEmail: data.email,     
        userPassword: data.password,
        userPhone: data.phone,
        userAddress: data.address,
      });

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      setMsg(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

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
      marginBottom: "8px",
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
    errorMsg: { color: "red", fontSize: "12px", marginBottom: "8px" },
    linkText: { color: "#2a9db5", cursor: "pointer", marginLeft: "4px" },
  };

  return (
    <div style={styles.card}>
      <img src={logo} alt="logo" style={styles.logo} />
      <h2 style={styles.title}>Volunteer Opportunities System</h2>

      {/* User Name */}
      <Controller
        control={control}
        name="userName"
        render={({ field }) => (
          <>
            <input
              type="text"
              placeholder="User Name"
              {...field}
              style={styles.input}
            />
            <p style={styles.errorMsg}>{errors.userName?.message}</p>
          </>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <>
            <input
              type="email"
              placeholder="Email "
              {...field}
              style={styles.input}
            />
            <p style={styles.errorMsg}>{errors.email?.message}</p>
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <>
            <input
              type="password"
              placeholder="Password"
              {...field}
              style={styles.input}
            />
            <p style={styles.errorMsg}>{errors.password?.message}</p>
          </>
        )}
      />

      {/* Governorate */}
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <>
            <select {...field} style={styles.input}>
              <option value="">Select Address</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <p style={styles.errorMsg}>{errors.address?.message}</p>
          </>
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              {...field}
              style={styles.input}
            />
            <p style={styles.errorMsg}>{errors.phone?.message}</p>
          </>
        )}
      />

      <button
        style={styles.button}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ fontSize: "14px", color: "#666" }}>
        Already have an account?
        <span style={styles.linkText} onClick={() => navigate("/login")}>
          Sign In
        </span>
      </div>
    </div>
  );
}

export default Register;
