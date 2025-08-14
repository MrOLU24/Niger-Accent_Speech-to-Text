"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    // Only show loading for different routes
    if (href !== window.location.pathname) {
      setIsLoading(true);
      
      // Navigate with a small delay to show loading
      setTimeout(() => {
        router.push(href);
      }, 100);
    } else {
      router.push(href);
    }
  };

  return (
    <Link 
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
