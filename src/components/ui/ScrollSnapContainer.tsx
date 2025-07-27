// src/components/ui/ScrollSnapContainer.tsx - SELAH Sacred Scroll Container
// Technology that breathes with you - Sacred transitions with breathing indicator

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface ScrollSnapContainerProps {
  children: React.ReactNode[];
  currentSection: number;
  onSectionChange: (sectionIndex: number) => void;
}

const ScrollSnapContainer: React.FC<ScrollSnapContainerProps> = ({
  children,
  currentSection,
  onSectionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const containerHeight = container.clientHeight;
          const currentIndex = Math.round(scrollTop / containerHeight);

          // Determine scroll direction
          if (scrollTop > lastScrollTop) {
            setScrollDirection("down");
          } else if (scrollTop < lastScrollTop) {
            setScrollDirection("up");
          }

          lastScrollTop = scrollTop;

          // Update current section if changed
          if (
            currentIndex !== currentSection &&
            currentIndex >= 0 &&
            currentIndex < children.length
          ) {
            setIsTransitioning(true);
            onSectionChange(currentIndex);

            // Reset transition state after animation
            setTimeout(() => {
              setIsTransitioning(false);
              setScrollDirection(null);
            }, 800);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentSection, children.length, onSectionChange]);

  // Navigate to specific section
  const navigateToSection = useCallback((sectionIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const targetY = sectionIndex * container.clientHeight;
    container.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      {/* Sacred Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto scroll-smooth scrollbar-hide"
        style={{
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {/* Sacred Breathing Transition Overlay */}
        {isTransitioning && (
          <div
            className={`
              fixed inset-0 pointer-events-none z-50 transition-all duration-800 ease-in-out
              ${scrollDirection === "down" ? "breathing-transition-down" : "breathing-transition-up"}
            `}
            style={{
              background: `radial-gradient(circle at 50% 50%, 
                rgba(45, 90, 61, 0.15) 0%, 
                rgba(104, 211, 145, 0.1) 30%, 
                transparent 70%
              )`,
            }}
          />
        )}

        {/* Sacred Sections */}
        {children.map((child, index) => (
          <section
            key={index}
            id={`section-${index}`}
            className={`
              section-sacred
              ${isTransitioning && index === currentSection ? "section-breathing-transition" : ""}
            `}
          >
            {child}
          </section>
        ))}
      </div>

      {/* Sacred Breathing Page Indicator */}
      <div className="page-indicator">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSection(index)}
            className={`
              page-dot
              ${index === currentSection ? "active" : ""}
            `}
            aria-label={`Navigate to section ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default ScrollSnapContainer;
