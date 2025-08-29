import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TopCities = ({ complaints }) => {
  const processData = (complaints) => {
    const cityData = {};
    complaints.forEach((c) => {
      const city = c.location || "Unknown";
      if (!cityData[city]) {
        cityData[city] = { city, cases: 0 };
      }
      cityData[city].cases += 1;
    });

    const sortedData = Object.values(cityData).sort((a, b) => b.cases - a.cases);
    return sortedData.slice(0, 5);
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
          height: 380, // Height bilkul sahi hai
          background: "#ffffff", // Background ko saaf white kiya
          padding: "25px",
          borderRadius: "20px", // Matched border radius
          boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)", // Matched shadow
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Matched transition
          position: "relative",
        }}
      >
        <h3
          className="chart-title" // Added className for animation
          style={{
            textAlign: "center",
            marginBottom: "20px", // Increased margin for consistency
            fontSize: "1.5rem", // Larger font size
            fontWeight: "700", // Bolder font
            letterSpacing: "0.8px", // Increased letter spacing
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
            🌆
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Top Cities Cases
          </span>
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid stroke="#d6d6d6" />
            <PolarAngleAxis dataKey="city" tick={{ fill: "#34495e", fontWeight: 600 }} />
            <PolarRadiusAxis stroke="#888" />
            <Radar
              name="Cases"
              dataKey="cases"
              stroke="#FF5722"
              fill="#FF5722"
              fillOpacity={0.6}
            />
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
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default TopCities;