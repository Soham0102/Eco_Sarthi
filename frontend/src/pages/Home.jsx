import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Leaf, Zap, BarChart3, Shield, Users, CheckCircle, ArrowRight, Play, Star, Heart, Award, Package, Globe, TreePine, Recycle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Environmental-themed floating elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full blur-3xl animate-float" 
        style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }} 
      />
      <div 
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-300/20 to-blue-300/20 rounded-full blur-3xl animate-float" 
        style={{ transform: `translate(${scrollY * -0.1}px, ${scrollY * 0.08}px)`, animationDelay: '2s' }} 
      />
      <div 
        className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-emerald-300/20 to-green-300/20 rounded-full blur-2xl animate-float" 
        style={{ transform: `translate(${scrollY * 0.15}px, ${scrollY * -0.1}px)`, animationDelay: '1s' }} 
      />
      
      {/* Leaf particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-leaf-float text-green-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        >
          <Leaf className="w-4 h-4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        @keyframes leaf-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(10px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-25px) translateX(-5px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) translateX(15px) rotate(270deg); opacity: 0.6; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes soft-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-leaf-float { animation: leaf-float 6s ease-in-out infinite; }
        .animate-slide-up { animation: slideInUp 0.8s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
        .animate-soft-glow { animation: soft-glow 3s ease-in-out infinite; }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #059669, #10b981, #0d9488, #0891b2);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-flow 8s ease infinite;
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>

      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative z-10 px-4 pt-20 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-slide-up mb-12">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                🌱 Sustainable Living Platform
              </span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight hover-lift">
              <span className="gradient-text">EcoSarthi</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-4 leading-relaxed animate-slide-up">
              Your Environmental Companion for a 
              <span className="text-emerald-600 font-semibold"> Greener Tomorrow</span>
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto animate-pulse-soft">
              Recycle • Reduce • Reuse • Together we make a difference
            </p>
            <div className="mt-6 text-center">
              <blockquote className="text-lg text-emerald-600 font-medium italic">
                "The Earth is what we all have in common. Let's protect it together."
              </blockquote>
              <p className="text-sm text-emerald-500 mt-2">- EcoSarthi</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <button 
              onClick={() => navigate('/user-login')}
              className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-emerald-500/25 min-w-[250px] overflow-hidden hover-lift animate-soft-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 animate-shimmer group-hover:animate-none"></div>
              <span className="relative flex items-center justify-center text-white">
                <Leaf className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Citizen Login
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button 
              onClick={() => navigate('/admin-login')}
              className="group relative bg-gradient-to-r from-orange-500 to-red-500 px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-orange-500/25 min-w-[250px] overflow-hidden hover-lift animate-soft-glow" 
              style={{ animationDelay: '0.8s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 animate-shimmer group-hover:animate-none"></div>
              <span className="relative flex items-center justify-center text-white">
                <Shield className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Admin Login
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-effect p-8 rounded-2xl hover-lift">
              <div className="text-4xl font-bold text-emerald-600 mb-2">♻️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Recycling</h3>
              <p className="text-gray-600">Transform waste into resources with our organized pickup system</p>
            </div>
            <div className="glass-effect p-8 rounded-2xl hover-lift">
              <div className="text-4xl font-bold text-teal-600 mb-2">🌍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600">Build a greener future through conscious environmental choices</p>
            </div>
            <div className="glass-effect p-8 rounded-2xl hover-lift">
              <div className="text-4xl font-bold text-green-600 mb-2">🤝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">Join hands with like-minded environmental enthusiasts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-4 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose EcoSarthi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making environmental sustainability accessible, convenient, and impactful for everyone.
            </p>
            <div className="mt-4">
              <blockquote className="text-lg text-emerald-600 font-medium italic">
                "Every small action counts. Your recycling today builds tomorrow's green world."
              </blockquote>
              <p className="text-sm text-emerald-500 mt-2">- EcoSarthi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Recycle,
                title: "Smart Recycling",
                description: "Our intelligent system ensures proper sorting and processing of recyclable materials.",
                gradient: "from-green-500 to-emerald-500",
                delay: "0.1s"
              },
              {
                icon: Leaf,
                title: "Environmental Impact",
                description: "Track your contribution to reducing carbon footprint and landfill waste.",
                gradient: "from-emerald-500 to-teal-500",
                delay: "0.2s"
              },
              {
                icon: Zap,
                title: "Quick & Easy",
                description: "Schedule pickups in minutes with our user-friendly platform.",
                gradient: "from-teal-500 to-blue-500",
                delay: "0.3s"
              },
              {
                icon: Globe,
                title: "Global Mission",
                description: "Be part of a worldwide movement towards environmental sustainability.",
                gradient: "from-blue-500 to-indigo-500",
                delay: "0.4s"
              }
            ].map((feature, index) => (
              <div key={index} className="group animate-slide-up hover-lift" style={{ animationDelay: feature.delay }}>
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Join thousands of eco-conscious individuals who are already contributing to a sustainable future.
            </p>
            <div className="mb-6">
              <blockquote className="text-lg text-emerald-100 font-medium italic">
                "Nature does not hurry, yet everything is accomplished. Let's work with nature, not against it."
              </blockquote>
              <p className="text-sm text-emerald-200 mt-2">- EcoSarthi</p>
            </div>
            <button 
              onClick={() => navigate('/admin-login')}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;