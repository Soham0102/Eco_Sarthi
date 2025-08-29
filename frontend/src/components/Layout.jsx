// Layout.jsx
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Complaint", path: "/complaint" },
    { name: "Voice Input", path: "/voice" },
    { name: "Track", path: "/track" },
    { name: "Analytics", path: "/analytics" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <>
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JantaVoice
        </Link>
        <div className="space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 ${
                pathname === item.path ? "bg-blue-100 text-blue-700" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
