import { useState } from "react";
import { Link as RouterLink} from "react-router-dom";
import { Plus, User, Home, TrendingUp, Calendar, Settings, Target, Clock, CheckCircle } from 'lucide-react';


const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home');
    
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];
return (
  <nav className="bg-slate-900 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            FITZONE
          </div>
        </div>

        <div className="flex space-x-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <RouterLink
                key={item.id}
                to={`/${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent size={18} />
                <span className="hidden md:inline">{item.label}</span>
              </RouterLink>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
);
}

export default Navbar



    
