// src/components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-6 py-4 shadow-2xl border-b-4 border-emerald-400 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Left section: Logo + Brand */}
        <a href="/" className="flex items-center space-x-4 cursor-pointer group">
          {/* Logo */}
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-white to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl font-extrabold text-emerald-600">ES</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </div>

          {/* Brand Text */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white tracking-tight group-hover:text-emerald-100 transition-colors duration-300">
              EcoSarthi
            </h1>
            <p className="text-sm text-emerald-100 font-medium tracking-wide">
              Your Environmental Companion
            </p>
          </div>
        </a>

        {/* Desktop Navigation - Clean, equal buttons */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="grid grid-flow-col auto-cols-fr gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-lg">
            {[
              { href: "/eco-tips", label: "Eco Tips", icon: "🌱" },
              { href: "/about", label: "About", icon: "ℹ️" },
              { href: "/waste-classification", label: "Classification", icon: "🧪" },
              { href: "/compost-makers", label: "Compost", icon: "🌱" },
              { href: "/scrap-shops", label: "Scrap Shops", icon: "♻️" },
              { href: "/register-shop", label: "Register Shop", icon: "📝" }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 group text-center w-40"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="ml-2 grid grid-flow-col auto-cols-fr gap-2">
            {[
              { href: "/worker-login", label: "Worker", icon: "👷" },
              { href: "/trackstatus", label: "Track", icon: "🔍" }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20 text-center w-40"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm group"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-emerald-700/95 backdrop-blur-md border-t border-emerald-400/50 shadow-2xl z-50">
          <div className="px-6 py-4 space-y-3">
            <a
              href="/eco-tips"
              className="block px-4 py-3 rounded-xl text-white hover:bg-emerald-600/50 transition-all duration-300 border border-transparent hover:border-emerald-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🌱</span>
                <span>Eco Tips</span>
              </span>
            </a>
            
            <a
              href="/about"
              className="block px-4 py-3 rounded-xl text-white hover:bg-emerald-600/50 transition-all duration-300 border border-transparent hover:border-emerald-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">ℹ️</span>
                <span>About EcoSarthi</span>
              </span>
            </a>

            {/* Waste Classification Option for Mobile */}
            <a
              href="/waste-classification"
              className="block px-4 py-3 rounded-xl text-white hover:bg-purple-600/50 transition-all duration-300 border border-transparent hover:border-purple-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🧪</span>
                <span>Waste Classification</span>
              </span>
            </a>

            {/* Compost Makers Directory for Mobile */}
            <a
              href="/compost-makers"
              className="block px-4 py-3 rounded-xl text-white hover:bg-green-600/50 transition-all duration-300 border border-transparent hover:border-green-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🌱</span>
                <span>Compost Makers</span>
              </span>
            </a>

            {/* Scrap Shops Directory for Mobile */}
            <a
              href="/scrap-shops"
              className="block px-4 py-3 rounded-xl text-white hover:bg-orange-600/50 transition-all duration-300 border border-transparent hover:border-orange-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">♻️</span>
                <span>Scrap Shops</span>
              </span>
            </a>

            <a
              href="/register-shop"
              className="block px-4 py-3 rounded-xl text-white hover:bg-emerald-600/50 transition-all duration-300 border border-transparent hover:border-emerald-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span>Register Shop</span>
              </span>
            </a>
            
            <a
              href="/worker-login"
              className="block px-4 py-3 rounded-xl text-white hover:bg-emerald-600/50 transition-all duration-300 border border-transparent hover:border-emerald-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">👷</span>
                <span>Worker</span>
              </span>
            </a>

            <a
              href="/trackstatus"
              className="block px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🔍</span>
                <span>Track Status</span>
              </span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;