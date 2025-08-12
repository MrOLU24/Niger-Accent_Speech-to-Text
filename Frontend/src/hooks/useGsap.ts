'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useGsap() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Register plugins on client side only
    if (typeof window !== 'undefined' && !initialized) {
      gsap.registerPlugin(ScrollTrigger);
      setInitialized(true);
    }
  }, [initialized]);

  return { 
    gsap: initialized ? gsap : null, 
    ScrollTrigger: initialized ? ScrollTrigger : null 
  };
}
