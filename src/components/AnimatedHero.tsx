"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 153;

export default function AnimatedHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const hasAutoScrolled = useRef(false);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // Funciones para cargar imágenes con un padstart fijo (ej. out_0001.webp)
    const currentFrame = (index: number) =>
        `/frames/out_${index.toString().padStart(4, "0")}.webp`;

    useEffect(() => {
        // 1. Preload all images
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                setImagesLoaded(loadedCount);
                if (loadedCount === FRAME_COUNT) {
                    // Todas las imágenes cargadas, dibujar el primer frame
                    setImages(loadedImages);
                }
            };
            loadedImages.push(img);
        }
    }, []);

    // Auto-scroll logic on first interaction
    useEffect(() => {
        const triggerScroll = () => {
            if (!hasAutoScrolled.current) {
                hasAutoScrolled.current = true;
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth"
                });
            }
        };

        window.addEventListener("click", triggerScroll, { once: true });
        window.addEventListener("wheel", triggerScroll, { once: true });
        window.addEventListener("touchstart", triggerScroll, { once: true });

        return () => {
            window.removeEventListener("click", triggerScroll);
            window.removeEventListener("wheel", triggerScroll);
            window.removeEventListener("touchstart", triggerScroll);
        };
    }, []);

    useEffect(() => {
        if (images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Configurar canvas para cubrir todo el ancho/alto de pantalla
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(0); // Redibujar al redimensionar
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas(); // Inicializar dimensiones

        function renderFrame(frameIndex: number) {
            if (!context || !canvas || images.length === 0) return;
            const img = images[frameIndex];
            if (!img) return;

            // Lógica tipo object-fit: cover en el canvas
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

            const xOffset = (canvas.width - drawWidth) / 2;
            const yOffset = (canvas.height - drawHeight) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
        }

        // Scroll listener
        const handleScroll = () => {
            // Calcular qué porcentaje hemos scroleado basándonos en el contenedor principal
            const html = document.documentElement;

            // Top scroll point 
            const scrollTop = html.scrollTop;
            // Scrollable height del documento 
            const maxScrollTop = html.scrollHeight - window.innerHeight;

            const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

            // Mapear la fraccion al index (1 a FRAME_COUNT) - en array es 0 a FRAME_COUNT-1
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.ceil(scrollFraction * FRAME_COUNT)
            );

            requestAnimationFrame(() => renderFrame(frameIndex));

            // Animate Logo position
            if (logoRef.current) {
                // To perfectly center the logo in the ~64px navbar (midpoint = 32px from top):
                // The logo starts bottom-12 (48px from bottom).
                const logoHeight = logoRef.current.clientHeight || 73;
                const startCenterY = window.innerHeight - 48 - (logoHeight / 2);
                const targetCenterY = 32; // Middle of navbar
                const yDistance = startCenterY - targetCenterY;

                const currentY = -yDistance * scrollFraction;

                logoRef.current.style.transform = `translate(-50%, ${currentY}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        renderFrame(0); // Dibujar el primer frame inmediatamente al cargar

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [images]);

    return (
        <div ref={containerRef} className="h-[400vh] bg-black w-full relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {imagesLoaded < FRAME_COUNT && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-white mix-blend-difference">
                        Cargando secuencias... {Math.round((imagesLoaded / FRAME_COUNT) * 100)}%
                    </div>
                )}
                <canvas ref={canvasRef} className="block w-full h-full object-cover" />

                {/* Modern Frosted Glass Overlay with Noise */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Dark gradient base to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />

                    {/* SVG Noise Texture for the "Frosted" granular look */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
                        <filter id="noiseFilter">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                    </svg>

                    {/* The Frosted Glass Layer */}
                    <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border-t border-white/10"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        }}
                    />
                </div>
            </div>

            {/* Logo goes up on scroll, making it fixed */}
            <div
                ref={logoRef}
                className="fixed bottom-12 left-1/2 z-50 flex flex-col items-center justify-center opacity-90 drop-shadow-lg"
                style={{ transform: "translate(-50%, 0px)", transformOrigin: 'center center' }}
            >
                <svg className="w-12 h-auto transition-transform duration-1000" viewBox="0 0 113.98 173.45">
                    <path fill="#fff" d="M114,58.87a62.42,62.42,0,0,0-9-31.08,57.4,57.4,0,0,0-5.13-7.2q-1.16-1.41-2.43-2.76A56.54,56.54,0,0,0,79.68,5a52.23,52.23,0,0,0-7.12-2.68,54.5,54.5,0,0,0-31.13,0A51.87,51.87,0,0,0,34.3,5,56.65,56.65,0,0,0,16.53,17.83c-.82.87-1.61,1.76-2.37,2.68A60.1,60.1,0,0,0,9,27.69,62.37,62.37,0,0,0,0,58.75c0,.51,0,1,0,1.55v52.85c0,1.88.08,3.75.24,5.59a61.42,61.42,0,0,0,16.29,36.88,54.82,54.82,0,0,0,80.92,0,61.29,61.29,0,0,0,16.28-36.84c.17-1.86.25-3.73.25-5.63V60.3C114,59.82,114,59.34,114,58.87Zm-7.42,1.43v8L87.86,92.15a41.34,41.34,0,0,0-6.31-5.88L101.39,36.8A55.35,55.35,0,0,1,106.55,60.3ZM88.61,108a33.08,33.08,0,0,1,1.47,6q-4.36-.18-8.73-.31l-.92,0c-3.1-.09-6.19-.16-9.29-.22h-.49l-6.45-.08-1.51,0q-5.65,0-11.3,0h-1.6q-3.19,0-6.38.07H42.9c-3.1,0-6.2.11-9.3.19l-1,0q-4.38.12-8.74.3a32.1,32.1,0,0,1,1.49-6,31.32,31.32,0,0,1,1.28-3.17,33.83,33.83,0,0,1,4.18-6.71,35,35,0,0,1,4.53-4.66,33.8,33.8,0,0,1,6.32-4.22,31.26,31.26,0,0,1,4.36-1.87,33.1,33.1,0,0,1,7.27-1.64,35.15,35.15,0,0,1,7.3,0,33.1,33.1,0,0,1,7.27,1.64,32.45,32.45,0,0,1,4.44,1.91,33.82,33.82,0,0,1,6.31,4.24,33.67,33.67,0,0,1,8.68,11.39A33.4,33.4,0,0,1,88.61,108Zm8.06-79.39L75.13,82.31A38.68,38.68,0,0,0,69,79.85L78.57,12.7A50.55,50.55,0,0,1,96.67,28.62ZM57,7.43a46.2,46.2,0,0,1,14.5,2.31l-9.8,68.58a41,41,0,0,0-9.4,0L42.49,9.74A46.25,46.25,0,0,1,57,7.43ZM35.41,12.7,45,79.85a40,40,0,0,0-6.07,2.41L17.38,28.53A50.54,50.54,0,0,1,35.41,12.7Zm-28,47.6a55.51,55.51,0,0,1,5.21-23.61L32.5,86.21a41.48,41.48,0,0,0-6.32,5.89L7.43,68.2Zm0,52.85V80.25L21.66,98.38a39.27,39.27,0,0,0-2.38,4.77,40.61,40.61,0,0,0-2.35,7.6c-.23,1.15-.42,2.31-.55,3.5q-3.15.14-6.31.32H9.83l-2.38.13c0-.36,0-.72,0-1.09C7.43,113.47,7.43,113.31,7.43,113.15ZM57,166a47.87,47.87,0,0,1-35-15.49,54,54,0,0,1-13.8-28.42l.45,0,1.88-.11,5.63-.28c3.46-.17,6.94-.31,10.41-.43,1.22,0,2.44-.09,3.67-.12,3-.1,6.1-.18,9.15-.24l2.54,0c.89,0,1.78,0,2.66,0l4.07,0h2.24c1.17,0,2.34,0,3.52,0q2.67,0,5.34,0c1.14,0,2.29,0,3.43,0,3,0,6,.06,9,.12l2.56,0q4.56.11,9.1.26l3.55.13h0c3.51.12,7,.28,10.51.46,1.87.09,3.73.19,5.6.3l1.71.1.63,0C101.78,147.11,81.46,166,57,166Zm49.56-72.08v19.21c0,.17,0,.34,0,.51,0,.4,0,.79,0,1.17l-2.54-.14h-.07l-6.29-.33c-.14-1.2-.32-2.37-.56-3.53a39.93,39.93,0,0,0-2.33-7.61,42.13,42.13,0,0,0-2.36-4.76l14.18-18.08Z" />
                </svg>
            </div>
        </div>
    );
}
