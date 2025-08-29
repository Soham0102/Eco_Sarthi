import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyTrend = ({ complaints }) => {
  const processData = (complaints) => {
    const monthlyData = {};
    complaints.forEach((c) => {
      const date = new Date(c.timestamp);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, complaints: 0 };
      }
      monthlyData[monthYear].complaints += 1;
    });

    return Object.values(monthlyData);
  };

  const data = processData(complaints);

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-8px);
            }
            60% {
              transform: translateY(-4px);
            }
          }
          
          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 5px rgba(44, 62, 80, 0.3); }
            50% { text-shadow: 0 0 20px rgba(44, 62, 80, 0.6); }
          }
          
          .chart-title {
            animation: fadeIn 1.2s ease-in-out, titleGlow 3s ease-in-out infinite;
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          height: 380,
          background: "#ffffff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
        }}
      >
        <h3
          className="chart-title"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: "700",
            letterSpacing: "0.8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1
          }}
        >
          <span
            style={{
              fontSize: "1.6rem",
              animation: "bounce 2s infinite",
              color: '#2c3e50',
            }}
          >
            📈
          </span>
          <span style={{
            background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Monthly Complaints Trend</span>
        </h3>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#d6d6d6" />
            <XAxis dataKey="month" tick={{ fill: "#34495e", fontWeight: 600 }} />
            <YAxis tick={{ fill: "#34495e" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2c3e50",
                color: "#fff",
                borderRadius: "15px", // Adjusted to match other charts
                border: "none",
                padding: "12px 18px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)", // Adjusted to match other charts
                fontSize: "13px",
                fontWeight: "500"
              }}
            />
            <Legend verticalAlign="top" align="center" iconType="circle" />
            <Line
              type="monotone"
              dataKey="complaints"
              stroke="#FF5722"
              strokeWidth={3}
              dot={{ r: 6, fill: "#FF5722", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#4CAF50", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default MonthlyTrend;