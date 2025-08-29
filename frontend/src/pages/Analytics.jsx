import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage error

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics data", err.message);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading analytics data...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  const pieData = [
    { name: "Resolved", value: data.filter((d) => d.status === "Resolved").length },
    { name: "Pending", value: data.filter((d) => d.status !== "Resolved").length },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Complaints by Department</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Resolution Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
