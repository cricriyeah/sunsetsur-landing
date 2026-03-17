"use client";

import { useRef, useState, useEffect } from "react";
import NextImage from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import styles from "./Hero.module.css";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const phraseRef = useRef(null);
    const brandingRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(phraseRef, { once: true, amount: 0.5 });

    const phrase = "Historias que emergen al caer la tarde.";
    const characters = phrase.split("");

    const { scrollY } = useScroll();

    // Dynamically calculate the travel distance to ensure it hits the top perfectly
    const [travelDistance, setTravelDistance] = useState(0);

    useEffect(() => {
        const updateDistance = () => {
            const vh = window.innerHeight;
            const isDesktop = window.innerWidth >= 768;
            const bottomPadding = isDesktop ? 56 : 32; // Matches Hero.module.css padding
            const targetTop = isDesktop ? 56 : 32; // Sync with Navbar top (3.5rem / 2rem)
            const brandingHeight = brandingRef.current?.offsetHeight || 40;
            
            // distance = starting bottom position - target top position
            // We want the logo to end up at 'targetTop' from the top of the viewport.
            // Starting position (from top) = vh - bottomPadding - brandingHeight
            // End position (from top) = targetTop
            // Travel = Starting - End
            const distance = (vh - bottomPadding - brandingHeight) - targetTop;
            setTravelDistance(distance);
        };

        updateDistance();
        // Delay slightly for accurate measurement after hydration
        const timer = setTimeout(updateDistance, 100);
        
        window.addEventListener("resize", updateDistance);
        return () => {
            window.removeEventListener("resize", updateDistance);
            clearTimeout(timer);
        };
    }, []);

    // Perfectly linear 1:1 scroll mapping
    // We use a function to avoid clamping at hardcoded values
    const brandingY = useTransform(scrollY, (latest) => {
        // Linear move: -1px for every 1px of scroll
        // Clamp it at the travel distance so it stays in the navbar
        return Math.max(-travelDistance, -latest);
    });

    return (
        <div className={styles.heroWrapper} ref={containerRef}>
            {/* Layer 0: Fixed Static Background */}
            <div className={styles.heroBackground}>
                <div className={styles.noiseOverlay} />

                {/* Poetic Background Phrase (Z-Index: 5) */}
                <div ref={phraseRef} className={styles.phraseContainer}>
                    {characters.map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
                            animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                            transition={{
                                duration: 1.2,
                                delay: 0.04 * i,
                                ease: [0.2, 0.65, 0.3, 0.9]
                            }}
                            className={`${styles.char} ${char === " " ? styles.space : ""}`}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Layer 20: Global Fixed Branding Overlay */}
            <div className={styles.heroBranding}>
                <motion.div 
                    ref={brandingRef}
                    style={{ y: brandingY }}
                    className={styles.centerRow}
                >
                    <div className={styles.logoContainer}>
                        <NextImage
                            src="/logo-color.svg"
                            alt="SunsetSur Logo"
                            width={40}
                            height={40}
                            className={styles.logo}
                            priority
                        />
                    </div>
                    <div className={styles.nameContainer}>
                        <div className={styles.companyName}>
                            <span className={styles.sunset}>sunsetsur</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}