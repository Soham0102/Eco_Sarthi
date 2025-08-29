import React from 'react';
import { Leaf, Recycle, Globe, Heart, Users, Award, Target, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-8">
            <Leaf className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            About EcoSarthi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in building a sustainable future through innovative recycling solutions and environmental consciousness.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To make environmental sustainability accessible to everyone by providing convenient recycling solutions, 
              promoting eco-conscious living, and building a community dedicated to protecting our planet.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world where every individual actively participates in environmental conservation, 
              creating a sustainable ecosystem for future generations through responsible waste management.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Environmental Care</h3>
              <p className="text-gray-600">
                We prioritize the health of our planet in every decision and action we take.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community First</h3>
              <p className="text-gray-600">
                We believe in the power of collective action and building strong environmental communities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to make environmental practices easier and more effective.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Recycling</h3>
              <p className="text-sm text-gray-600">
                Efficient pickup and processing of recyclable materials
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Eco Education</h3>
              <p className="text-sm text-gray-600">
                Spreading awareness about sustainable living practices
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-teal-100">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Global Impact</h3>
              <p className="text-sm text-gray-600">
                Contributing to worldwide environmental conservation efforts
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Service</h3>
              <p className="text-sm text-gray-600">
                Ensuring the highest standards in environmental services
              </p>
            </div>
          </div>
        </div>

        {/* Inspirational Quotes */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Words That Inspire Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center">
              <blockquote className="text-xl font-medium italic mb-4">
                "The best time to plant a tree was 20 years ago. The second best time is now."
              </blockquote>
              <p className="text-emerald-100">- Chinese Proverb</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center">
              <blockquote className="text-xl font-medium italic mb-4">
                "We do not inherit the earth from our ancestors; we borrow it from our children."
              </blockquote>
              <p className="text-green-100">- Native American Proverb</p>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white text-center">
              <blockquote className="text-xl font-medium italic mb-4">
                "The Earth laughs in flowers."
              </blockquote>
              <p className="text-teal-100">- Ralph Waldo Emerson</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-white text-center">
              <blockquote className="text-xl font-medium italic mb-4">
                "Nature is not a place to visit. It is home."
              </blockquote>
              <p className="text-blue-100">- Gary Snyder</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
                         <h2 className="text-3xl font-bold mb-6">
               Join the EcoSarthi Movement
             </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Together, we can create a sustainable future for generations to come.
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-lg">
                 Start Recycling Today
               </button>
               <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                 Learn More
               </button>
             </div>
           </div>
         </div>
       </div>

               {/* Created By Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate minds behind EcoSarthi, dedicated to creating a sustainable future
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Aishwarya Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100 hover:shadow-emerald-200/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <span className="text-6xl">👩‍💻</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm">✨</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                    Aishwarya Kalshetti
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <blockquote className="text-gray-700 italic text-center">
                      "Every pixel, every interaction, every moment - designed with purpose for a greener tomorrow."
                    </blockquote>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4">
                    <blockquote className="text-gray-700 italic text-center">
                      "Innovation meets sustainability in every line of code we write."
                    </blockquote>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-emerald-100">
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Creative</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Passionate</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Visionary</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Soham Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-teal-100 hover:shadow-teal-200/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <span className="text-6xl">👨‍💻</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm">🚀</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    Soham Tawari
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-teal-50 rounded-xl p-4">
                    <blockquote className="text-gray-700 italic text-center">
                      "Building digital bridges that connect people to environmental solutions."
                    </blockquote>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <blockquote className="text-gray-700 italic text-center">
                      "Technology is our tool, sustainability is our mission."
                    </blockquote>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-teal-100">
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Innovative</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Dedicated</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Focused</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Collaboration Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Collaboration & Innovation</h3>
              <p className="text-lg text-emerald-100 mb-6 max-w-3xl mx-auto">
                Together, we've combined creativity with technical excellence to build EcoSarthi - 
                a platform that makes environmental sustainability accessible to everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">React.js</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">Node.js</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">MongoDB</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">AI/ML</span>
              </div>
            </div>
          </div>
        </div>
     </div>
   );
 };
 
 export default About;
