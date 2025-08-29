import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CasesByDepartment = ({ complaints }) => {
  const processData = (complaints) => {
    const departmentData = {};
    complaints.forEach((c) => {
      const department = c.department || "Unassigned";
      if (!departmentData[department]) {
        departmentData[department] = {
          department,
          resolved: 0,
          pending: 0,
          processing: 0,
          total: 0,
        };
      }
      if (c.status === "Resolved") {
        departmentData[department].resolved += 1;
      } else if (c.status === "Pending") {
        departmentData[department].pending += 1;
      } else if (c.status === "Processing") {
        departmentData[department].processing += 1;
      }
    });
    return Object.values(departmentData);
  };

  const data = processData(complaints);

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(30px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
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
          
          @keyframes iconBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
            60% { transform: translateY(-4px); }
          }
          
          @keyframes barGrowth {
            0% {
              transform: scaleY(0);
              transform-origin: bottom;
            }
            100% {
              transform: scaleY(1);
              transform-origin: bottom;
            }
          }
          
          @keyframes legendFadeIn {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .chart-container {
            animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .chart-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          
          .chart-title {
            animation: fadeIn 1.2s ease-in-out, titleGlow 3s ease-in-out infinite;
          }
          
          .chart-icon {
            animation: iconBounce 2s ease-in-out infinite;
            display: inline-block;
            margin-right: 8px;
          }
          
          .recharts-bar {
            animation: barGrowth 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .recharts-legend-wrapper {
            animation: legendFadeIn 1s ease-in-out 0.5s both;
          }
        `}
      </style>
      <div
        className="chart-container"
        style={{
          width: "100%",
          height: 380,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle, rgba(76, 175, 80, 0.03) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50%",
            left: "-50%",
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle, rgba(255, 193, 7, 0.03) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />
        
        <h3
          className="chart-title"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.5rem",
            fontWeight: "700",
            letterSpacing: "0.8px",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Corrected: Icon with solid color */}
          <span 
            className="chart-icon"
            style={{ 
              color: '#2c3e50',
            }}
          >📊</span>
          {/* Corrected: Text with gradient */}
          <span style={{
            background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Cases by Department</span>
        </h3>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4CAF50" stopOpacity={1} />
                <stop offset="100%" stopColor="#388E3C" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFC107" stopOpacity={1} />
                <stop offset="100%" stopColor="#FFA000" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="processingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity={1} />
                <stop offset="100%" stopColor="#D84315" stopOpacity={0.8} />
              </linearGradient>
              
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
              </filter>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="rgba(108, 117, 125, 0.15)"
              strokeWidth={1}
            />
            <XAxis 
              dataKey="department" 
              tick={{ 
                fill: "#495057", 
                fontSize: 12, 
                fontWeight: 500 
              }}
              axisLine={{ 
                stroke: "rgba(108, 117, 125, 0.2)", 
                strokeWidth: 1 
              }}
              tickLine={{ 
                stroke: "rgba(108, 117, 125, 0.2)" 
              }}
            />
            <YAxis 
              tick={{ 
                fill: "#495057", 
                fontSize: 11 
              }}
              axisLine={{ 
                stroke: "rgba(108, 117, 125, 0.2)", 
                strokeWidth: 1 
              }}
              tickLine={{ 
                stroke: "rgba(108, 117, 125, 0.2)" 
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2c3e50",
                color: "#fff",
                borderRadius: "15px",
                border: "none",
                padding: "12px 18px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                fontSize: "13px",
                fontWeight: "500"
              }}
              cursor={{
                fill: "rgba(52, 73, 94, 0.05)",
                radius: 4
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="center" 
              iconType="rect"
              iconSize={12}
              wrapperStyle={{
                paddingBottom: "15px",
                fontSize: "13px",
                fontWeight: "500",
                color: "#495057"
              }}
            />
            <Bar
              dataKey="resolved"
              fill="url(#resolvedGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
              filter="url(#shadow)"
            />
            <Bar
              dataKey="pending"
              fill="url(#pendingGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
              animationDelay={200}
              filter="url(#shadow)"
            />
            <Bar
              dataKey="processing"
              fill="url(#processingGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
              animationDelay={400}
              filter="url(#shadow)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default CasesByDepartment;