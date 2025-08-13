'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, Mic } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleThemeToggle = () => {
    const isDark = resolvedTheme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'features', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
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
  ];

  return (
  <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border/20 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              ToriType
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Theme Toggle */}
      {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="rounded-full"
              >
        {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}

            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
      {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="rounded-full"
              >
        {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/20">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    activeSection === item.id
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-base font-semibold">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
