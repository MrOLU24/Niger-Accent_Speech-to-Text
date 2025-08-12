'use client';

import { useEffect, useRef } from 'react';
import { useGsap } from '../hooks/useGsap';

interface Props {
  children: React.ReactNode;
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
}

export default function ScrollReveal({ children, y = 40, x = 0, duration = 0.8, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    if (!ref.current || !gsap) return;
    
    gsap.set(ref.current, { opacity: 0, y, x });
    
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);
    
    return () => ctx.revert();
  }, [gsap, y, x, duration, delay]);

  return <div ref={ref}>{children}</div>;
}
