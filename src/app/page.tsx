"use client";

import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { scrollY } = useScroll();
  
  // Parallax: rising 30% slower than scroll (0.7x net speed)
  // We use a function to keep it linear and infinite (no clamping)
  const parallaxY = useTransform(scrollY, (latest) => latest * 0.3);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="relative">
        <Hero />
        {/* Parallax rising section: moves at 70% speed of scroll to feel 'delayed' and slower */}
        <motion.div 
          style={{ 
            position: "relative", 
            zIndex: 10,
            y: parallaxY
          }}
        >
          <Projects />
        </motion.div>
      </div>
    </main>
  );
}
