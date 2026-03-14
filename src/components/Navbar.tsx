import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] px-4 md:px-8 py-6 bg-transparent text-white uppercase tracking-[0.2em]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side Links */}
        <div className="nav-left flex-1 flex justify-end gap-4 md:gap-12 text-[10px] md:text-[14px] font-normal">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            HOME
          </Link>
          <Link href="/proyectos" className="hover:opacity-70 transition-opacity">
            PROYECTOS
          </Link>
        </div>

        {/* Middle Spacer for Animated Logo */}
        <div className="w-20 md:w-32 flex justify-center pointer-events-none shrink-0">
          {/* This space is for the logo to land */}
          <div className="w-10 h-10" />
        </div>

        {/* Right Side Links */}
        <div className="nav-right flex-1 flex justify-start gap-4 md:gap-12 text-[10px] md:text-[14px] font-normal">
          <Link href="/vision" className="hover:opacity-70 transition-opacity">
            VISION
          </Link>
          <Link href="/ubicacion" className="hover:opacity-70 transition-opacity">
            UBICACION
          </Link>
        </div>
      </div>
    </nav>
  );
}
