"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
import GlassContainer from "./ui/GlassContainer";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when we've scrolled past the hero (approx 100vh)
      const threshold = window.innerHeight * 0.95;
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Don't call handleScroll immediately to avoid race conditions with hydration
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.4
              }}
              className={styles.glassWrapper}
            >
              <GlassContainer>
                <div className={styles.container}>
                  <div className={styles.links}>
                    <Link href="/" className={styles.navLink}>
                      HOME
                    </Link>
                    <Link href="/proyectos" className={styles.navLink}>
                      PROYECTOS
                    </Link>
                    <Link href="/vision" className={styles.navLink}>
                      VISION
                    </Link>
                  </div>
                </div>
              </GlassContainer>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Link href="/ubicacion" className={styles.contactButton}>
          CONTACTANOS
        </Link>
      </div>
    </nav>
  );
}
