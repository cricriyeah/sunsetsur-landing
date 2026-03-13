import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-transparent mix-blend-difference text-white">
      <Link href="/" className="text-xl font-bold tracking-tighter">
        SUNSETSUR
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/" className="hover:opacity-70 transition-opacity">
          HOME
        </Link>
        <Link href="/proyectos" className="hover:opacity-70 transition-opacity">
          PROYECTOS
        </Link>
        <Link href="/vision" className="hover:opacity-70 transition-opacity">
          VISION
        </Link>
        <Link href="/contacto" className="hover:opacity-70 transition-opacity">
          CONTACTO
        </Link>
      </div>
    </nav>
  );
}
