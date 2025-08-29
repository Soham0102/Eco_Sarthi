import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFC107", // Yellow
  "#FF5722", // Orange
  "#9C27B0", // Purple
  "#00BCD4", // Cyan
  "#E91E63", // Pink
];

const renderCustomizedLabel = ({ percent, name }) => {
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

const CasesByCity = ({ complaints }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const processData = (complaints) => {
    const cityData = {};
    complaints.forEach((c) => {
      const city = c.location || "Unknown";
      if (!cityData[city]) {
        cityData[city] = { city, cases: 0 };
      }
      cityData[city].cases += 1;
    });
    return Object.values(cityData);
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
          
          .recharts-pie-sector {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .recharts-pie-sector:hover {
            filter: brightness(1.1) !important;
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
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)";
        }}
      >
        <h3
          className="chart-title" // Added className to apply animation
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
            🏙️
          </span>
          <span style={{
            background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Cases by Area</span>
        </h3>
        
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
              ))}
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2"/>
              </filter>
            </defs>
            
            <Pie
              data={data}
              dataKey="cases"
              nameKey="city"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={115}
              label={renderCustomizedLabel}
              labelLine={false}
              animationDuration={1500}
              animationBegin={0}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index % COLORS.length})`}
                  stroke="#fff"
                  strokeWidth={3}
                  filter="url(#shadow)"
                  style={{
                    transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>
            
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: "#2c3e50",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: "12px 16px",
                boxShadow: "0 12px 36px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "14px",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
                animation: "tooltipFadeIn 0.3s ease-out",
              }}
              labelStyle={{
                color: "#2c3e50",
                fontWeight: "700",
                marginBottom: "4px",
              }}
            />
            
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: "15px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
              iconSize={12}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default CasesByCity;
