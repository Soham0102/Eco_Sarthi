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
              <span className="text-3xl">��</span>
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-lg">
            <a
              href="/pickup-scheduling"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-emerald-500/30 transition-all duration-300 border border-transparent hover:border-emerald-300/50 group"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">♻️</span>
                <span>Recycling Pickup</span>
              </span>
            </a>

            <a
              href="/eco-tips"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-emerald-500/30 transition-all duration-300 border border-transparent hover:border-emerald-300/50 group"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">🌱</span>
                <span>Eco Tips</span>
              </span>
            </a>

            <a
              href="/about"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-emerald-500/30 transition-all duration-300 border border-transparent hover:border-emerald-300/50 group"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">ℹ️</span>
                <span>About EcoSarthi</span>
              </span>
            </a>

            {/* NEW: Waste Classification Option */}
            <a
              href="/waste-classification"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-purple-500/30 transition-all duration-300 border border-transparent hover:border-purple-300/50 group"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">🧪</span>
                <span>Waste Classification</span>
              </span>
            </a>
          </div>

          {/* Track Status Button */}
          <div className="ml-4">
            <a
              href="/trackstatus"
              className="bg-gradient-to-r from-orange-400 to-orange-600 
                         hover:from-orange-500 hover:to-orange-700 
                         px-6 py-3 rounded-xl text-sm font-semibold text-white 
                         transition-all duration-300 shadow-lg 
                         hover:shadow-orange-500/40 transform hover:scale-105 
                         border border-orange-400 hover:border-orange-300 
                         relative overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r 
                              from-transparent via-white/20 to-transparent 
                              translate-x-[-100%] group-hover:translate-x-[100%] 
                              transition-transform duration-700"></div>

              <span className="flex items-center gap-2 relative z-10">
                <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🔍</span>
                <span>Track Status</span>
              </span>
            </a>
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
              href="/pickup-scheduling"
              className="block px-4 py-3 rounded-xl text-white hover:bg-emerald-600/50 transition-all duration-300 border border-transparent hover:border-emerald-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">♻️</span>
                <span>Recycling Pickup</span>
              </span>
            </a>
            
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

            {/* NEW: Waste Classification Option for Mobile */}
            <a
              href="/waste-classification"
              className="block px-4 py-3 rounded-xl text-white hover:bg-purple-600/50 transition-all duration-300 border border-transparent hover:border-purple-300/50"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🧪</span>
                <span>Waste Classification</span>
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