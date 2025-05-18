import React, { useState } from "react";

export default function UploadDistributors() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitsAssigned, setUnitsAssigned] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const distributorData = {
      email,
      name,
      phone_number: phone,
      units_assigned: Number(unitsAssigned),
    };

    try {
      const res = await fetch(
        "http://localhost:3000/admin/create-distributor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(distributorData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Distributor created successfully");
        setEmail("");
        setName("");
        setPhone("");
        setUnitsAssigned("");
      } else {
        setMessage(data.message || "Failed to create distributor");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Distributor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Number of Units Assigned"
          value={unitsAssigned}
          onChange={(e) => setUnitsAssigned(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-blue-700">{message}</p>
      )}
    </div>
  );
}
