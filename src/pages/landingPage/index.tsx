import React from 'react';
import { Link as RouterLink} from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Soccer Ball */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <div className="w-full h-full rounded-full border-4 border-black relative">
            <div className="absolute top-1 left-4 w-6 h-6 border-2 border-black rounded-full"></div>
            <div className="absolute bottom-2 right-3 w-4 h-4 border-2 border-black rounded-full"></div>
          </div>
        </div>
        
        {/* Basketball */}
        <div className="absolute top-32 right-16 w-14 h-14 bg-orange-600 rounded-full animate-pulse">
          <div className="w-full h-full rounded-full relative">
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-black transform -translate-x-0.5"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-0.5"></div>
          </div>
        </div>
        
        {/* Tennis Ball */}
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2.5s'}}>
          <div className="w-full h-full rounded-full relative">
            <div className="absolute top-1 left-1 w-10 h-5 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-10 h-5 border-2 border-white rounded-full"></div>
          </div>
        </div>
        
        {/* Dumbbells */}
        <div className="absolute top-1/2 right-8 w-20 h-6 animate-pulse" style={{animationDelay: '2s'}}>
          <div className="flex items-center">
            <div className="w-6 h-8 bg-gray-700 rounded"></div>
            <div className="flex-1 h-2 bg-gray-800 mx-1"></div>
            <div className="w-6 h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-16 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* App Name with Glow Effect */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            FITZONE
          </h1>
          
          {/* Slogan */}
          <p className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-wider">
            Unleash Your Athletic Potential
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your fitness journey with personalized workouts, real-time progress tracking, 
            and a community of athletes pushing their limits. From soccer drills to strength training, 
            we've got every sport covered.
          </p>
          
          {/* CTA Button */}
          <RouterLink 
          to='/login'
          className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xl rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/25">
            <span className="relative z-10">START YOUR JOURNEY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full group-hover:animate-pulse"></div>
          </RouterLink>
          
          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Sport Training</h3>
              <p className="text-gray-300">Soccer, basketball, tennis, and more</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-white mb-2">Strength & Conditioning</h3>
              <p className="text-gray-300">Build muscle and endurance</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-300">Monitor your athletic journey</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>
    </div>
  );
};

export default LandingPage;