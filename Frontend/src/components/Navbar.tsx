'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Mic, Brain } from 'lucide-react';
import { Button } from './ui/button';
import LoadingLink from './LoadingLink';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const handleThemeToggle = () => {
    const isDark = resolvedTheme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  };

  // Track scroll position for navbar background
  useEffect(() => {
    // Don't set up scroll listeners on login page
    if (pathname === '/login') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      // Track active section
      const sections = ['hero', 'about', 'features', 'testimonials'];
      const scrollPos = scrollPosition + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Don't render navbar on login page - AFTER all hooks are called
  if (pathname === '/login') {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = window.innerWidth < 768 ? 70 : 80; // Smaller offset for mobile
      const offsetTop = element.offsetTop - navHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#0e0f16]/95 dark:bg-[#0e0f16]/95 light:bg-white/95 backdrop-blur-xl border-b border-[#0db2f3]/20 shadow-lg shadow-[#0db2f3]/10' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
          {/* Logo with enhanced branding */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#0db2f3]/30">
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ animation: 'spin 4s linear infinite' }}></div>
              <Mic className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-400 bg-clip-text text-transparent">
                ToriType
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium -mt-0.5 sm:-mt-1 hidden xs:block">
                Nigerian AI
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === item.id
                    ? 'text-[#0db2f3] bg-[#0db2f3]/10 shadow-lg shadow-[#0db2f3]/20'
                    : 'text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-[#0db2f3] hover:bg-[#0db2f3]/5'
                }`}
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0db2f3]/20 to-blue-400/20 animate-pulse"></div>
                )}
              </button>
            ))}

            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0db2f3]/10 border border-[#0db2f3]/20">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-300 dark:text-gray-300 light:text-gray-600">
                  AI Online
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="group w-9 h-9 rounded-full hover:bg-[#0db2f3]/10 hover:scale-110 transition-all duration-300 border border-transparent hover:border-[#0db2f3]/30"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-gray-300 group-hover:text-[#0db2f3] group-hover:rotate-45 transition-all duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600 group-hover:text-[#0db2f3] group-hover:rotate-12 transition-all duration-300" />
                )}
              </Button>
            )}

            <LoadingLink 
              href="/login"
              className="group relative bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-[#0db2f3]/90 hover:to-blue-500/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0db2f3]/30 hover:shadow-xl hover:shadow-[#0db2f3]/40 overflow-hidden inline-flex items-center"
            >
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ animation: 'spin 3s linear infinite' }}></div>
              <span className="relative group-hover:scale-110 transition-transform duration-300">Get Started</span>
            </LoadingLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1.5 sm:space-x-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-[#0db2f3]/10 hover:scale-110 transition-all duration-300 group border border-transparent hover:border-[#0db2f3]/30"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-[#0db2f3] group-hover:rotate-45 transition-all duration-300" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-[#0db2f3] group-hover:rotate-12 transition-all duration-300" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-[#0db2f3]/10 hover:scale-110 transition-all duration-300 group border border-transparent hover:border-[#0db2f3]/30"
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 dark:text-gray-300 light:text-gray-600 group-hover:text-[#0db2f3] group-hover:rotate-90 transition-all duration-300" />
              ) : (
                <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 dark:text-gray-300 light:text-gray-600 group-hover:text-[#0db2f3] group-hover:scale-110 transition-all duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#0db2f3]/20 bg-[#0e0f16]/95 dark:bg-[#0e0f16]/95 light:bg-white/95 backdrop-blur-xl">
            <div className="py-3 px-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                    activeSection === item.id
                      ? 'text-[#0db2f3] bg-[#0db2f3]/10 shadow-lg shadow-[#0db2f3]/20'
                      : 'text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-[#0db2f3] hover:bg-[#0db2f3]/5'
                  }`}
                >
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0db2f3]/20 to-blue-400/20 animate-pulse"></div>
                  )}
                </button>
              ))}
              
              {/* Mobile AI Status */}
              <div className="flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-full bg-[#0db2f3]/10 border border-[#0db2f3]/20 mx-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-300 dark:text-gray-300 light:text-gray-600">
                    AI Online
                  </span>
                </div>
              </div>
              
              <LoadingLink 
                href="/login"
                className="group relative w-full mt-3 mx-3 max-w-[calc(100%-24px)] bg-gradient-to-r from-[#0db2f3] to-blue-500 text-white px-6 py-3 rounded-full text-base font-semibold hover:from-[#0db2f3]/90 hover:to-blue-500/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0db2f3]/30 hover:shadow-xl overflow-hidden inline-flex items-center justify-center"
              >
                {/* Rotating border effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ animation: 'spin 3s linear infinite' }}></div>
                <span className="relative group-hover:scale-110 transition-transform duration-300">Get Started</span>
              </LoadingLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
