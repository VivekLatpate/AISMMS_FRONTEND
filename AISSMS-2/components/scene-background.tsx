"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SceneBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    if (prefersReducedMotion.matches) {
       gsap.set(spotlight, { opacity: 0 });
       return;
    }

    const moveSpotlight = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveSpotlight);

    return () => {
      window.removeEventListener("mousemove", moveSpotlight);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden outline-none">
      <div
        ref={spotlightRef}
        className="absolute -left-[250px] -top-[250px] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] dark:bg-orange-500/10"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
