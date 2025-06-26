import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Eye, EyeOff, Camera, Save, LogOut, ChevronRight, Moon, Sun, Globe, Smartphone } from 'lucide-react';

const AccountPage: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    achievements: true,
    weeklyReports: false,
    socialUpdates: true
  });
  
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    username: 'alexfit2024',
    bio: 'Fitness enthusiast passionate about strength training and soccer',
    height: '5\'10"',
    weight: '165 lbs',
    fitnessLevel: 'Intermediate',
    goals: 'Build muscle, improve endurance'
  });

  const [accountSettings, setAccountSettings] = useState({
    language: 'English',
    units: 'Imperial',
    privacy: 'Friends Only',
    twoFactor: false
  });

  const handleSignOut = () => {
    setIsSignedIn(false);
    // In a real app, this would clear tokens and redirect
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
    // In a real app, this would handle authentication
  };

  const updateProfile = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (field: string, value: string | boolean) => {
    setAccountSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              FITZONE
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to continue your fitness journey</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter your email"
                defaultValue="alex.johnson@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-12"
                  placeholder="Enter your password"
                  defaultValue="password123"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Sign In
            </button>

            <div className="text-center">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-gray-300 mt-1">Manage your profile and preferences</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Profile */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <User className="mr-2" size={24} />
                  Profile Information
                </h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform">
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    AJ
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{userProfile.name}</h3>
                  <p className="text-gray-400">@{userProfile.username}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={userProfile.username}
                    onChange={(e) => updateProfile('username', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Level</label>
                  <select
                    value={userProfile.fitnessLevel}
                    onChange={(e) => updateProfile('fitnessLevel', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                  <input
                    type="text"
                    value={userProfile.height}
                    onChange={(e) => updateProfile('height', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight</label>
                  <input
                    type="text"
                    value={userProfile.weight}
                    onChange={(e) => updateProfile('weight', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Goals</label>
                <textarea
                  value={userProfile.goals}
                  onChange={(e) => updateProfile('goals', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                />
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <Settings className="mr-2" size={24} />
                App Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Language</p>
                      <p className="text-gray-400 text-sm">App display language</p>
                    </div>
                  </div>
                  <select
                    value={accountSettings.language}
                    onChange={(e) => updateSettings('language', e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="text-purple-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Units</p>
                      <p className="text-gray-400 text-sm">Measurement units</p>
                    </div>
                  </div>
                  <select
                    value={accountSettings.units}
                    onChange={(e) => updateSettings('units', e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="Imperial">Imperial</option>
                    <option value="Metric">Metric</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? <Moon className="text-indigo-400" size={20} /> : <Sun className="text-yellow-400" size={20} />}
                    <div>
                      <p className="text-white font-medium">Theme</p>
                      <p className="text-gray-400 text-sm">App appearance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <Bell className="mr-2" size={24} />
                Notifications
              </h2>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                    </div>
                    <button
                      onClick={() => updateNotifications(key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white flex items-center mb-6">
                <Shield className="mr-2" size={24} />
                Security
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-gray-400 text-sm">Extra security for your account</p>
                  </div>
                  <button
                    onClick={() => updateSettings('twoFactor', !accountSettings.twoFactor)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      accountSettings.twoFactor ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accountSettings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <button className="w-full p-4 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-gray-400 text-sm">Update your account password</p>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                  </div>
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Privacy</label>
                  <select
                    value={accountSettings.privacy}
                    onChange={(e) => updateSettings('privacy', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="Public">Public</option>
                    <option value="Friends Only">Friends Only</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;