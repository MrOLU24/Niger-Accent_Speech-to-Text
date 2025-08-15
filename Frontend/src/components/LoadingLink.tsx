"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    // Navigate directly
    router.push(href);
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
