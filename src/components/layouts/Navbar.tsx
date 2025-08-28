"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";

type AvatarSrc = string | StaticImageData | null | undefined;

function Avatar({
  src,
  alt,
  initials,
  size = 36,
}: {
  src: AvatarSrc;
  alt: string;
  initials: string;
  size?: number;
}) {
  if (!src) {
    return (
      <div
        className="rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700"
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null); // <— measure this

  const { user, loading, logout } = useUnifiedAuth();

  const toggleDrawer = () => setIsOpen((s) => !s);
  const toggleMenu = () => setMenuOpen((s) => !s);

  // Add compact style when page is scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#nav-user-menu")) setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [menuOpen]);

  // Measure navbar height and set --nav-h
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.offsetHeight}px`
      );
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    // also update on orientation change
    window.addEventListener("orientationchange", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", setVar);
    };
  }, []);

  const initials = useMemo(() => {
    if (!user) return "U";
    const fn = (user.firstName || "").trim();
    const ln = (user.lastName || "").trim();
    if (fn || ln)
      return `${fn?.[0] ?? ""}${ln?.[0] ?? ""}`.toUpperCase() || "U";
    if (user.username) return user.username.slice(0, 2).toUpperCase();
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return "U";
  }, [user]);

  const avatarSrc: AvatarSrc = useMemo(() => {
    return user?.image ?? user?.profilePicture ?? null;
  }, [user]);

  return (
    <div
      ref={wrapRef}
      id="navbar"
      className={`fixed inset-x-0 top-0 z-[99] transition-all duration-300
        ${
          isScrolled
            ? "bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm"
            : "bg-white/70 backdrop-blur border-b border-transparent"
        }
      `}
    >
      {/* Desktop Navbar */}
      <div className="hidden lg:grid grid-cols-[25%_50%_25%] h-16 w-full px-6 xl:px-20 items-center">
        {/* Left: Brand */}
        <div className="font-bold text-lg">
          <Link href="/" className="hover:opacity-80">
            Real Estate
          </Link>
        </div>

        {/* Center: Links */}
        <nav className="flex justify-center gap-8">
          <Link
            href="/"
            className="text-sm text-gray-700 hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/listings"
            className="text-sm text-gray-700 hover:text-primary transition"
          >
            Listings
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-700 hover:text-primary transition"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-700 hover:text-primary transition"
          >
            Contact us
          </Link>
        </nav>

        {/* Right: User */}
        <div
          className="flex items-center justify-end gap-3 relative"
          id="nav-user-menu"
        >
          {loading ? (
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          ) : user ? (
            <>
              <button
                type="button"
                onClick={toggleMenu}
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 px-2 py-1 transition"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Avatar
                  src={avatarSrc}
                  alt="Profile image"
                  initials={initials}
                  size={36}
                />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium truncate max-w-[140px]">
                    {user.firstName || user.username || user.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {user.email ?? ""}
                  </p>
                </div>
                <span aria-hidden>▾</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-56 bg-white text-black border rounded-md shadow-lg overflow-hidden"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/auth/registration"
                className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden h-14 px-4 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Real Estate</h2>
        <button
          className="px-3 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition"
          onClick={toggleDrawer}
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      >
        <div
          className={`fixed top-0 left-0 bg-white text-black w-72 h-full p-6 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Avatar
                    src={avatarSrc}
                    alt="Profile"
                    initials={initials}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {user.firstName || user.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email ?? ""}
                    </p>
                  </div>
                </>
              ) : (
                <h2 className="text-lg font-bold">Menu</h2>
              )}
            </div>
            <button
              className="text-gray-600 text-2xl"
              onClick={toggleDrawer}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-lg hover:text-primary transition"
                onClick={toggleDrawer}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/listings"
                className="text-lg hover:text-primary transition"
                onClick={toggleDrawer}
              >
                Listings
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-lg hover:text-primary transition"
                onClick={toggleDrawer}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-lg hover:text-primary transition"
                onClick={toggleDrawer}
              >
                Contact us
              </Link>
            </li>

            <li className="pt-2 border-t" />

            {loading ? (
              <li>
                <div className="w-full h-9 bg-gray-200 rounded animate-pulse" />
              </li>
            ) : user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="text-lg hover:text-primary transition"
                    onClick={toggleDrawer}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-lg hover:text-primary transition"
                    onClick={toggleDrawer}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full text-left text-lg text-red-600 hover:text-red-700 transition"
                    onClick={async () => {
                      await logout();
                      toggleDrawer();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/signin"
                    className="text-lg hover:text-primary transition"
                    onClick={toggleDrawer}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/registration"
                    className="text-lg hover:text-primary transition"
                    onClick={toggleDrawer}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
