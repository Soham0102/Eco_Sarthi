import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserOptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl w-full max-w-6xl p-12 border border-white/20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-8 shadow-lg">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Choose Your Environmental Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select the service that helps you contribute to a sustainable future. 
            Every choice you make brings us closer to a greener tomorrow.
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Making a difference, one service at a time
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {/* Recycling Pickup Service */}
          <div
            onClick={() => navigate("/pickup-scheduling")}
            className="group relative bg-white border-2 border-emerald-200/50 shadow-xl hover:shadow-2xl p-8 rounded-3xl text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-emerald-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:shadow-emerald-500/25 transition-all duration-500">
                ♻️
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-4 group-hover:from-emerald-700 group-hover:to-emerald-800 transition-all duration-300">
                Recycling Pickup
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Schedule pickup of recyclable materials<br />
                <span className="text-sm font-medium text-emerald-600 mt-2 block">
                  पुनर्चक्रण सामग्री का पिकअप | रीसाइक्लिंग पिकअप
                </span>
              </p>
              <div className="mt-6 inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300 shadow-lg group-hover:shadow-emerald-500/25">
                Get Started
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Voice Bot */}
          <div
            onClick={() => navigate("/voice")}
            className="group relative bg-white border-2 border-green-200/50 shadow-xl hover:shadow-2xl p-8 rounded-3xl text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-green-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:shadow-green-500/25 transition-all duration-500">
                🎤
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4 group-hover:from-green-700 group-hover:to-green-800 transition-all duration-300">
                Voice Bot
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Use voice commands for complaints<br />
                <span className="text-sm font-medium text-green-600 mt-2 block">
                  आवाज से शिकायत करें | वॉइस बॉट
                </span>
              </p>
              <div className="mt-6 inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 shadow-lg group-hover:shadow-green-500/25">
                Start Voice
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Written Complaint */}
          <div
            onClick={() => navigate("/complaint")}
            className="group relative bg-white border-2 border-teal-200/50 shadow-xl hover:shadow-2xl p-8 rounded-3xl text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-teal-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:shadow-teal-500/25 transition-all duration-500">
                ✍️
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-4 group-hover:from-teal-700 group-hover:to-teal-800 transition-all duration-300">
                Written Complaint
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Submit written complaints online<br />
                <span className="text-sm font-medium text-teal-600 mt-2 block">
                  लिखित शिकायत दर्ज करें | ऑनलाइन शिकायत
                </span>
              </p>
              <div className="mt-6 inline-flex items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-teal-600 group-hover:to-teal-700 transition-all duration-300 shadow-lg group-hover:shadow-teal-500/25">
                Submit Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Track Status */}
          <div
            onClick={() => navigate("/trackstatus")}
            className="group relative bg-white border-2 border-blue-200/50 shadow-xl hover:shadow-2xl p-8 rounded-3xl text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-blue-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:shadow-blue-500/25 transition-all duration-500">
                🔍
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300">
                Track Status
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Check current status of your requests<br />
                <span className="text-sm font-medium text-blue-600 mt-2 block">
                  अपने अनुरोध की स्थिति देखें | स्थिति ट्रैक करें
                </span>
              </p>
              <div className="mt-6 inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25">
                Track Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer help text */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is available 24/7 to assist you with your environmental journey.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                📧 Email Support
              </span>
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                💬 Live Chat
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                📱 WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}