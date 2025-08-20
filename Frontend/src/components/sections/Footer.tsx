import { Mic, Github, Twitter, Linkedin, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-[#0a0b0f] light:bg-gray-50 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#0e0f16] dark:to-[#0a0b0f] light:from-gray-100 light:to-gray-50"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0db2f3] to-blue-500 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
                    ToriType
                  </h3>
                  <p className="text-xs text-gray-400">Nigerian AI Platform</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 light:text-gray-600 text-sm leading-relaxed max-w-md mb-6">
                Empowering Nigerian voices with AI-powered speech-to-text technology that understands our unique accents, dialects, and cultural expressions.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-9 h-9 bg-white/80 dark:bg-white/5 light:bg-white/80 hover:bg-blue-50 dark:hover:bg-[#0db2f3]/20 light:hover:bg-blue-50 border border-gray-200 dark:border-white/10 light:border-gray-200 hover:border-blue-300 dark:hover:border-[#0db2f3]/30 light:hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Github className="w-4 h-4 text-gray-600 dark:text-gray-400 light:text-gray-600 group-hover:text-[#0db2f3]" />
                </a>
                <a href="#" className="w-9 h-9 bg-white/80 dark:bg-white/5 light:bg-white/80 hover:bg-blue-50 dark:hover:bg-[#0db2f3]/20 light:hover:bg-blue-50 border border-gray-200 dark:border-white/10 light:border-gray-200 hover:border-blue-300 dark:hover:border-[#0db2f3]/30 light:hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400 light:text-gray-600 group-hover:text-[#0db2f3]" />
                </a>
                <a href="#" className="w-9 h-9 bg-white/80 dark:bg-white/5 light:bg-white/80 hover:bg-blue-50 dark:hover:bg-[#0db2f3]/20 light:hover:bg-blue-50 border border-gray-200 dark:border-white/10 light:border-gray-200 hover:border-blue-300 dark:hover:border-[#0db2f3]/30 light:hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400 light:text-gray-600 group-hover:text-[#0db2f3]" />
                </a>
                <a href="mailto:hello@toritype.com" className="w-9 h-9 bg-white/80 dark:bg-white/5 light:bg-white/80 hover:bg-blue-50 dark:hover:bg-[#0db2f3]/20 light:hover:bg-blue-50 border border-gray-200 dark:border-white/10 light:border-gray-200 hover:border-blue-300 dark:hover:border-[#0db2f3]/30 light:hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 light:text-gray-600 group-hover:text-[#0db2f3]" />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-gray-900 dark:text-white light:text-gray-900 font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-gray-900 dark:text-white light:text-gray-900 font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-600 dark:text-gray-400 light:text-gray-600 hover:text-[#0db2f3] transition-colors text-sm">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-white/10 light:border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 light:text-gray-600">
              <Link href="/privacy" className="hover:text-[#0db2f3] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#0db2f3] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-[#0db2f3] transition-colors">
                Cookie Policy
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 light:text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Made in Nigeria</span>
              </div>
              <span>© {currentYear} ToriType. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
