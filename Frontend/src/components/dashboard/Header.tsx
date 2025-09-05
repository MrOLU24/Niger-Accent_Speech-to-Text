import React from 'react';
import { Menu, History, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  userName: string;
  onSignOut: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onSignOut, onHistory, onSettings }) => {
  // Extract first name from full name or email
  const getFirstName = (name: string) => {
    if (name.includes('@')) {
      // If it's an email, extract the part before @
      return name.split('@')[0].split('.')[0];
    }
    // If it's a full name, return the first word
    return name.split(' ')[0];
  };

  const firstName = getFirstName(userName);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
      {/* Left side - Logo */}
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold text-blue-400">
          ToriType
        </div>
      </div>

      {/* Center - Greeting */}
      <div className="flex-1 text-center">
        <h1 className="text-xl text-gray-100">
          Hello, <span className="text-blue-400 capitalize">{firstName}</span>
        </h1>
      </div>

      {/* Right side - Menu */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-gray-800 border-gray-700 text-gray-100"
          >
            <DropdownMenuItem 
              onClick={onHistory}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <History className="mr-2 h-4 w-4" />
              History
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onSettings}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={onSignOut}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
