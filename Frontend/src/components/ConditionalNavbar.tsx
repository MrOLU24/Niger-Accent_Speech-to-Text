"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on dashboard or auth pages
  const hideNavbar = pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/auth/') ||
                    pathname === '/login';

  if (hideNavbar) {
    return null;
  }

  return <Navbar />;
}
