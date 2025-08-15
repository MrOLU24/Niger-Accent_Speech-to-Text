"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingProvider";
import { ReactNode, useEffect, useState } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Only proceed if we're on the client side
    if (!isClient) return;
    
    // Only show loading for different routes
    const currentPath = window.location.pathname;
    if (href !== currentPath) {
      // Show loading state
      setLoading(true);
    }
    
    // Navigate immediately
    router.push(href);
  };

  return (
    <a 
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

interface NavigationButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  showLoading?: boolean;
}

export function NavigationButton({ onClick, children, className, showLoading = true }: NavigationButtonProps) {
  const { setLoading } = useLoading();

  const handleClick = () => {
    if (showLoading) {
      setLoading(true);
    }
    
    // Execute the original onClick immediately
    onClick();
  };

  return (
    <button 
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
