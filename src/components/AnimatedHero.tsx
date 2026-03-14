"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import NextImage from "next/image";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 153;

export default function AnimatedHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // Contexto para animar el index
    const airRender = useRef({ frame: 0 });

    const currentFrame = (index: number) =>
        `/frames/out_${index.toString().padStart(4, "0")}.webp`;

    // 1. Preload images and Reset Scroll
    useEffect(() => {
        // Reset scroll to top on load/refresh
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                setImagesLoaded(loadedCount);
                if (loadedCount === FRAME_COUNT) {
                    setImages(loadedImages);
                }
            };
            loadedImages.push(img);
        }
    }, []);

    useGSAP(() => {
        if (images.length === 0 || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { alpha: false }); // Optimización extra para no usar alpha
        if (!context) return;

        let renderParams = { drawWidth: 0, drawHeight: 0, xOffset: 0, yOffset: 0 };

        const calculateParams = () => {
            const img = images[0];
            if (!img) return;

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight;
            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
            }

            renderParams = {
                drawWidth,
                drawHeight,
                xOffset: (canvas.width - drawWidth) / 2,
                yOffset: (canvas.height - drawHeight) / 2
            };
        };

        const renderFrame = (index: number) => {
            const img = images[index];
            if (!img) return;

            context.drawImage(
                img,
                renderParams.xOffset,
                renderParams.yOffset,
                renderParams.drawWidth,
                renderParams.drawHeight
            );
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            calculateParams();
            renderFrame(Math.round(airRender.current.frame));
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Detectar si es móvil para ajustar offsets
        const isMobile = window.innerWidth < 768;
        const navOffset = isMobile ? 36 : 48; // Offset para cerrar el hueco del logo (24px móvil, 64px desktop aprox)
        
        // 2. GSAP Timeline - Pausada inicialmente
        const tl = gsap.timeline({ paused: true });

        // Estado inicial de los links del Navbar
        gsap.set(".nav-left", { x: navOffset, opacity: 1 });
        gsap.set(".nav-right", { x: -navOffset, opacity: 1 });

        // Animación de los frames: lineal (none) para evitar que se atranque
        tl.to(airRender.current, {
            frame: FRAME_COUNT - 1,
            duration: 2.5,
            ease: "none",
            onUpdate: () => renderFrame(Math.round(airRender.current.frame)),
        });

        // 3. Animación del Logo y Expansión del Navbar (Split)
        tl.to(".hero-logo", {
            top: isMobile ? "38px" : "42px",
            left: "50%",
            scale: isMobile ? 0.25 : 0.35, 
            duration: 2,
            ease: "expo.out",
        }, 0.2); 

        tl.to(".nav-left", {
            x: 0,
            duration: 2,
            ease: "expo.out",
        }, 0.2);

        tl.to(".hero-video", {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        }, 0);

        tl.to(".nav-right", {
            x: 0,
            duration: 2,
            ease: "expo.out",
        }, 0.2);

        // 4. ScrollTrigger para DISPARAR la línea de tiempo
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top -5px", // Requiere un pequeño movimiento de scroll real
            onEnter: () => tl.play(),
            once: true // Solo se dispara una vez
        });

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [images]);

    return (
        <div ref={containerRef} className="h-[200vh] bg-black w-full relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {imagesLoaded < FRAME_COUNT && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
                        <div className="text-sm font-mono tracking-widest mb-4 opacity-50 uppercase">Sunsetsur Studios</div>
                        <div className="text-2xl font-light">Cargando secuencias...</div>
                        <div className="mt-4 w-48 h-[1px] bg-white/20 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${(imagesLoaded / FRAME_COUNT) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                <video 
                    className="hero-video absolute inset-0 w-full h-full object-cover z-[5]"
                    src="https://res.cloudinary.com/dkofkzzc5/video/upload/v1773451824/Generaci%C3%B3n_de_Video_Completada_fanofc.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                <canvas ref={canvasRef} className="block w-full h-full object-cover relative z-0" />

                {/* Frosted powdery top fade - Expanded range, subtle strength */}
                <div className="absolute inset-x-0 top-0 h-[90vh] pointer-events-none z-50">
                    {/* Unified Glass layer - Reverted to md for precision */}
                    <div
                        className="absolute inset-0 backdrop-blur-md bg-black/20"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 100%)'
                        }}
                    />

                    {/* Powdery texture overlay - Expanded mask */}
                    <div
                        className="absolute inset-0"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full opacity-[0.4] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                            <filter id="powderNoise">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
                                <feColorMatrix type="saturate" values="0" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#powderNoise)" />
                        </svg>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 1.5, top: "50%", left: "50%", x: "-50%" }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="hero-logo fixed z-[60] flex flex-col items-center justify-center -translate-y-1/2 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            >
                <NextImage
                    src="/logo1blanconuevo.svg"
                    alt="SunsetSur Logo"
                    width={96}
                    height={96}
                    className="w-24 h-auto"
                    priority
                />
            </motion.div>
        </div>
    );
}
