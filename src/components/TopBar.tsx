
import React, { useState } from 'react';
import { Search, Menu, User } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-white hidden sm:block">AutoParts Pro</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
            <input
              type="text"
              placeholder="Search products, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
        
        <button className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
          <User size={20} />
        </button>
      </div>
    </div>
  );
};
