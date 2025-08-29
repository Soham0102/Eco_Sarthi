import React from 'react';
import { Leaf, Recycle, Lightbulb, TreePine, Heart, Globe, Zap, Award } from 'lucide-react';

const EcoTips = () => {
  const tips = [
    {
      icon: Recycle,
      title: "Smart Recycling",
      tips: [
        "Separate your waste into recyclables, compostables, and landfill items",
        "Rinse containers before recycling to prevent contamination",
        "Check local recycling guidelines for accepted materials",
        "Use reusable bags and containers instead of single-use plastics"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Leaf,
      title: "Energy Conservation",
      tips: [
        "Switch to LED bulbs which use 75% less energy",
        "Unplug electronics when not in use to prevent phantom energy",
        "Use natural light during the day instead of artificial lighting",
        "Invest in energy-efficient appliances with high ratings"
      ],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: TreePine,
      title: "Water Conservation",
      tips: [
        "Fix leaky faucets and pipes immediately",
        "Install low-flow showerheads and faucets",
        "Collect rainwater for gardening and plants",
        "Turn off the tap while brushing teeth or washing dishes"
      ],
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: Heart,
      title: "Sustainable Living",
      tips: [
        "Choose products with minimal packaging",
        "Buy local and seasonal produce to reduce transportation emissions",
        "Use public transport, bike, or walk when possible",
        "Support companies with strong environmental policies"
      ],
      color: "from-blue-500 to-indigo-500"
    }
  ];

  const quotes = [
    {
             text: "The Earth is what we all have in common. Let's protect it together.",
       author: "EcoSarthi"
    },
    {
             text: "Every small action counts. Your recycling today builds tomorrow's green world.",
       author: "EcoSarthi"
    },
    {
             text: "Nature does not hurry, yet everything is accomplished. Let's work with nature, not against it.",
       author: "EcoSarthi"
    },
    {
      text: "The greatest threat to our planet is the belief that someone else will save it.",
      author: "Robert Swan"
    },
    {
             text: "We don't have a planet B. Let's take care of the one we have.",
       author: "EcoSarthi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-8">
            <Lightbulb className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Eco Tips & Wisdom
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover practical ways to live more sustainably and make a positive impact on our environment.
          </p>
        </div>

                {/* Daily Tip */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl p-8 text-white text-center mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse"></span>
              Today's Featured Tip
            </div>
            <h2 className="text-4xl font-bold mb-6">Start Your Day Green!</h2>
            <p className="text-xl mb-6 leading-relaxed max-w-4xl mx-auto">
              Begin your morning by using a reusable water bottle instead of disposable plastic bottles. 
              This simple change can save hundreds of plastic bottles from landfills each year!
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                💧 Save Water
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                🌍 Reduce Plastic
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                💰 Save Money
              </span>
            </div>
            <p className="text-emerald-100 font-medium mt-6 text-lg">- EcoSarthi</p>
          </div>
        </div>

        {/* Tips Categories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Sustainable Living Tips</h2>
          <div className="grid md:grid-cols-2 gap-8">
                         {tips.map((category, index) => (
               <div key={index} className="group bg-white rounded-3xl shadow-xl p-8 border border-emerald-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                 <div className="relative">
                   <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                     <category.icon className="w-10 h-10 text-white" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                     <span className="text-white text-sm">✨</span>
                   </div>
                 </div>
                 <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">{category.title}</h3>
                 <ul className="space-y-4">
                   {category.tips.map((tip, tipIndex) => (
                     <li key={tipIndex} className="flex items-start group/item">
                       <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                       <span className="text-gray-600 leading-relaxed group-hover/item:text-gray-800 transition-colors duration-300">{tip}</span>
                     </li>
                   ))}
                 </ul>
                 <div className="mt-6 pt-4 border-t border-emerald-100">
                   <div className="inline-flex items-center text-emerald-600 font-medium text-sm">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                     {category.tips.length} actionable tips
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Inspirational Quotes */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Words of Wisdom</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "{quote.text}"
                </blockquote>
                <p className="text-emerald-600 font-medium text-right">- {quote.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Quick Actions You Can Take Today</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Recycling</h3>
              <p className="text-sm text-gray-600">Set up a recycling system at home</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Plant Something</h3>
              <p className="text-sm text-gray-600">Add greenery to your space</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduce Waste</h3>
              <p className="text-sm text-gray-600">Choose products with less packaging</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Share Knowledge</h3>
              <p className="text-sm text-gray-600">Teach others about sustainability</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Start implementing these tips today and join thousands of others making positive environmental changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-lg">
                Start Recycling
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoTips;
