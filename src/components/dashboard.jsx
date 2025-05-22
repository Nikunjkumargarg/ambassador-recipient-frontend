import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    const token = localStorage.getItem("token");

    if (userRole === "admin") {
      const fetchCustomers = async () => {
        try {
          const response = await fetch("http://localhost:3000/admin/list", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setCustomers(data);
        } catch (error) {
          console.error("Error fetching recipients:", error);
        }
      };

      const fetchDistributors = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/admin/distributors-summary",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setDistributors(data);
        } catch (error) {
          console.error("Error fetching distributor summary:", error);
        }
      };
      fetchCustomers();
      fetchDistributors();
    }

    if (userRole === "distributor") {
      const fetchDistributorStats = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/admin/distributor-summary",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setDistributors([data]); // Keep in array form
        } catch (error) {
          console.error("Error fetching distributor stats:", error);
        }
      };

      fetchDistributorStats();
    }
  }, []);

  const totalAssigned = distributors.reduce(
    (sum, d) => sum + Number(d.quantity_alloted),
    0
  );
  const totalRemaining = distributors.reduce(
    (sum, d) => sum + Number(d.quantity_remaining),
    0
  );
  const totalDistributed = totalAssigned - totalRemaining;

  const handleDownloadMasterCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/admin/download-recipients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download master CSV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "master-distributior.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV Download Error:", error);
      alert("Failed to download master CSV");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/admin/download-distributors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download CSV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ambassador.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV Download Error:", error);
      alert("Failed to download CSV");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
        {role === "admin" ? "Admin Dashboard" : "Ambassador Dashboard"}
      </h2>

      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
        {role === "admin" && (
          <div className="flex flex-col space-y-3 text-sm bg-white p-4 rounded-md shadow-md border border-gray-200 w-full md:max-w-xs">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDownloadMasterCSV();
              }}
              className="text-purple-600 underline hover:text-purple-800"
            >
              📄 Download Master CSV
            </a>

            <Link
              to="/upload-distributors"
              className="text-gray-600 underline hover:text-gray-800"
            >
              ➕ Create Ambassador
            </Link>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDownloadCSV();
              }}
              className="text-blue-600 underline hover:text-blue-800"
            >
              📥 Download Ambassadors CSV
            </a>
          </div>
        )}

        {role === "distributor" && (
          <>
            <Link
              to="/create-customer"
              className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded shadow text-sm text-center"
            >
              ➕ Create Recipient
            </Link>

            {distributors.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-10 mt-6">
                <div className="bg-blue-50 border border-blue-300 p-5 rounded shadow">
                  <p className="text-gray-600 font-medium">
                    Total Units Assigned
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    {distributors[0].quantity_alloted}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-300 p-5 rounded shadow">
                  <p className="text-gray-600 font-medium">Units Distributed</p>
                  <p className="text-xl font-bold text-green-700">
                    {distributors[0].quantity_alloted -
                      distributors[0].quantity_remaining}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 p-5 rounded shadow">
                  <p className="text-gray-600 font-medium">Units Remaining</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {distributors[0].quantity_remaining}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {role === "admin" && (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Ambassadors Overview
          </h3>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 border border-blue-300 p-5 rounded shadow">
              <p className="text-gray-600 font-medium">Total Units Assigned</p>
              <p className="text-xl font-bold text-blue-700">{totalAssigned}</p>
            </div>
            <div className="bg-green-50 border border-green-300 p-5 rounded shadow">
              <p className="text-gray-600 font-medium">
                Total Units Distributed
              </p>
              <p className="text-xl font-bold text-green-700">
                {totalDistributed}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 p-5 rounded shadow">
              <p className="text-gray-600 font-medium">Total Units Remaining</p>
              <p className="text-xl font-bold text-yellow-700">
                {totalRemaining}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Ambassadors Summary
          </h3>
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 mb-10">
            <table className="min-w-full text-sm text-left text-gray-700 bg-white">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 border-b">Name</th>
                  <th className="px-6 py-3 border-b">Phone</th>
                  <th className="px-6 py-3 border-b text-center">
                    Units Assigned
                  </th>
                  <th className="px-6 py-3 border-b text-center">
                    Units Remaining
                  </th>
                  <th className="px-6 py-3 border-b text-center">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {distributors.length > 0 ? (
                  distributors.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 even:bg-gray-50">
                      <td className="px-6 py-4 border-b">{d.name}</td>
                      <td className="px-6 py-4 border-b">{d.mobile_number}</td>
                      <td className="px-6 py-4 border-b text-center">
                        {d.quantity_alloted}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {d.quantity_remaining}
                      </td>
                      <td className="px-6 py-4 border-b text-center font-semibold text-green-600">
                        {d.quantity_alloted - d.quantity_remaining}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-5 text-center text-gray-500 italic"
                    >
                      No Ambassador found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
