// src/components/CreateCustomer.js
import React, { useState } from "react";

export default function CreateCustomer() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    const res = await fetch("http://localhost:3000/customer/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ mobile_number: `+91${mobile}` }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP sent to " + mobile);
      setOtpSent(true);
    } else {
      alert(data.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:3000/customer/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ mobile_number: `+91${mobile}`, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP verified successfully");
      setOtpVerified(true);
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  const createCustomer = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return alert("Please verify OTP before creating customer.");
    }

    const res = await fetch("http://localhost:3000/customer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, mobile_number: `+91${mobile}` }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Customer created successfully");
      setName("");
      setMobile("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } else {
      alert(data.message || "Failed to create recipient");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create Recipient
      </h2>
      <form onSubmit={createCustomer} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Recipient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setOtpSent(false);
            setOtpVerified(false);
            setOtp("");
          }}
          required
        />

        {!otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={!otpVerified}
          className={`w-full py-2 rounded text-white ${
            otpVerified
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create Recipient
        </button>
      </form>
    </div>
  );
}
