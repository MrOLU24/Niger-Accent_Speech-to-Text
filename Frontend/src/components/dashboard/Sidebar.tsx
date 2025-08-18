'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import Image from 'next/image';
import { 
  Mic, 
  Home, 
  History, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mounted: boolean;
  handleSignOut: () => Promise<void>;
}

export default function Sidebar({ user, sidebarOpen, setSidebarOpen, mounted }: SidebarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`
      w-64 bg-white dark:bg-[#0a0b0f] border-r border-gray-200 dark:border-white/10 flex flex-col
      lg:relative lg:translate-x-0
      fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Close Button for Mobile */}
      <div className="lg:hidden p-4 flex justify-end">
        <Button
          onClick={() => setSidebarOpen(false)}
          variant="outline"
          size="sm"
          className="bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
              ToriType
            </h1>
            <p className="text-xs text-gray-500 dark:text-white/60">Nigerian AI Platform</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
          <Image
            src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-[#0db2f3]/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-600 dark:text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        
        {/* Theme Toggle */}
        {mounted && (
          <div className="mb-4">
            <Button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              className="w-full bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20"
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        )}
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
