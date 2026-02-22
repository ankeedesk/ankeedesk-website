import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "./Logo"

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 40px" : "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrolled
          ? "rgba(245, 240, 232, 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <a href="#hero" style={{ textDecoration: "none" }}>
        <Logo size="sm" />
      </a>

      {/* Desktop nav */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "center",
        }}
        className="desktop-nav"
      >
        {navLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -2 }}
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "1.4rem",
              color: "var(--color-text)",
              textDecoration: "none",
              position: "relative",
            }}
          >
            {link.label}
            <motion.div
              style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: "var(--color-primary)",
                borderRadius: 1,
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ))}

        <motion.a
          href="#contact"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{
            scale: 1.05,
            rotate: -1,
            boxShadow: "4px 6px 16px rgba(0,0,0,0.15)",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text)",
            padding: "10px 24px",
            fontFamily: "var(--font-handwritten)",
            fontSize: "1.3rem",
            borderRadius: "2px",
            boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
            textDecoration: "none",
          }}
        >
          Let's Talk!
        </motion.a>
      </div>

      {/* Mobile hamburger */}
      <motion.button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        whileTap={{ scale: 0.9 }}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          zIndex: 1001,
        }}
        aria-label="Toggle menu"
      >
        <div style={{ width: 28, height: 20, position: "relative" }}>
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            style={{
              display: "block",
              width: "100%",
              height: 3,
              background: "var(--color-text)",
              borderRadius: 2,
              position: "absolute",
              top: 0,
            }}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
            style={{
              display: "block",
              width: "100%",
              height: 3,
              background: "var(--color-text)",
              borderRadius: 2,
              position: "absolute",
              top: 8,
            }}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
            style={{
              display: "block",
              width: "100%",
              height: 3,
              background: "var(--color-text)",
              borderRadius: 2,
              position: "absolute",
              top: 16,
            }}
          />
        </div>
      </motion.button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "80vw",
              maxWidth: 360,
              height: "100vh",
              background: "var(--color-bg)",
              boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              zIndex: 999,
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "2rem",
                  color: "var(--color-text)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  )
}

export default Navbar
