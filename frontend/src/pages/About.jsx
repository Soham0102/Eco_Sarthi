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
            We’re focused on real change: solving unreliable pickups and poor segregation with verified collections, clear timing, and meaningful incentives.
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

        {/* Impact-focused Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              From Problem to Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We focus on solving daily waste management challenges at the household level and scaling the impact citywide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">The Problem</h3>
              <p className="text-gray-600 leading-relaxed">
                Unpredictable pickups, poor segregation, and lack of feedback loops lead to overflowing bins and lost recyclables.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Approach</h3>
              <p className="text-gray-600 leading-relaxed">
              Smart daily schedules, QR-verified pickups, and points that reward consistent, responsible behavior.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Measurable Impact</h3>
              <p className="text-gray-600 leading-relaxed">
              Higher collection reliability, cleaner neighborhoods, and rising green points—turning intent into visible change.
              </p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-4">What Changes with EcoSarthi</h3>
              <ul className="space-y-3 text-emerald-50">
                <li>• Clear daily pickup timing and reminders</li>
                <li>• QR-confirmed collections for accountability</li>
                <li>• Leaderboards that celebrate consistency and care</li>
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-10 border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How You Can Help</h3>
              <p className="text-gray-600 mb-4">Segregate right, show your QR when the collector arrives, and spread the word.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                  Start Today
                </button>
                <a href="/about" className="border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
   );
 };
 
 export default About;
