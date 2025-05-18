import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, []);

  const [loginType, setLoginType] = useState("admin"); // 'admin' or 'distributor'
  const [adminLoginMode, setAdminLoginMode] = useState("password"); // 'password' or 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const url =
        loginType === "admin"
          ? "http://localhost:3000/auth/admin/send-otp"
          : "http://localhost:3000/auth/distributor/send-otp";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: `+91${mobile}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
      } else {
        alert("OTP sent successfully");
      }
    } catch (err) {
      setError("Network error while sending OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let res;
      if (loginType === "admin") {
        if (adminLoginMode === "password") {
          res = await fetch("http://localhost:3000/auth/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
        } else {
          res = await fetch("http://localhost:3000/auth/admin/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile_number: `+91${mobile}`, otp }),
          });
        }
      } else {
        res = await fetch("http://localhost:3000/auth/distributor/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: `+91${mobile}`, otp }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed due to network error");
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setLoginType("admin")}
          className={`px-4 py-2 border rounded ${
            loginType === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setLoginType("distributor")}
          className={`px-4 py-2 border rounded ${
            loginType === "distributor"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Distributor
        </button>
      </div>

      {loginType === "admin" && (
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setAdminLoginMode("password")}
            className={`px-3 py-1 border rounded text-sm ${
              adminLoginMode === "password"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            Use Password
          </button>
          <button
            onClick={() => setAdminLoginMode("otp")}
            className={`px-3 py-1 border rounded text-sm ${
              adminLoginMode === "otp"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            Use OTP
          </button>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {loginType === "admin" && adminLoginMode === "password" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {(loginType === "distributor" ||
          (loginType === "admin" && adminLoginMode === "otp")) && (
          <>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-2 border rounded mr-2"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
