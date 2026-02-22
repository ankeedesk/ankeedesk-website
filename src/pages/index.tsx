import React, { lazy, Suspense, useState, useEffect, useRef, useLayoutEffect } from "react"
import type { HeadFC } from "gatsby"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Navbar from "../components/Navbar"
import StickyNote from "../components/StickyNote"
import AnimatedText from "../components/AnimatedText"
import HandDrawnLine from "../components/HandDrawnLine"
import SmoothReveal from "../components/SmoothReveal"
import MagneticButton from "../components/MagneticButton"
import GrainOverlay from "../components/GrainOverlay"
import DrawingCanvas from "../components/DrawingCanvas"
import HandwrittenReveal from "../components/HandwrittenReveal"
import Footer from "../components/Footer"
import Seo from "../components/Seo"

const HeroScene3D = lazy(() => import("../components/HeroScene3D"))
const CustomCursor = lazy(() => import("../components/CustomCursor"))

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <>{children}</>
}

function DeferredLoad({ children, delay = 3000 }: { children: React.ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const onLoad = () => {
      const id = setTimeout(() => setReady(true), delay)
      return () => clearTimeout(id)
    }
    if (document.readyState === "complete") {
      const id = setTimeout(() => setReady(true), delay)
      return () => clearTimeout(id)
    }
    window.addEventListener("load", () => setTimeout(() => setReady(true), delay), { once: true })
  }, [delay])
  if (!ready) return null
  return <>{children}</>
}

/* ───────────────────── HERO SECTION ───────────────────── */

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 600], [0, -150])
  const y2 = useTransform(scrollY, [0, 600], [0, -80])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.92])

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 20px 80px",
      }}
    >
      {/* 3D Background Scene — deferred until page is idle */}
      <ClientOnly>
        <DeferredLoad delay={2500}>
          <Suspense fallback={null}>
            <HeroScene3D />
          </Suspense>
        </DeferredLoad>
      </ClientOnly>

      <motion.div
        style={{ y: y1, opacity, scale, position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 80,
              damping: 12,
            }}
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "clamp(5rem, 15vw, 12rem)",
              color: "var(--color-text)",
              lineHeight: 0.9,
              marginBottom: 16,
              textShadow: "0 4px 30px rgba(253,255,151,0.3)",
            }}
          >
            <motion.span
              animate={{ rotate: [0, -3, 0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              a
            </motion.span>
            <motion.span
              animate={{ rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ display: "inline-block" }}
            >
              D
            </motion.span>
          </motion.div>

          {/* Full name with letter-spacing animation */}
          <motion.div
            initial={{ opacity: 0, y: 20, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
            transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              color: "var(--color-text-light)",
              marginBottom: 40,
            }}
          >
            ankeeDesk
          </motion.div>

          {/* Tagline on sticky note */}
          <motion.div style={{ y: y2 }}>
            <StickyNote
              color="var(--color-sticky-yellow)"
              rotate={-1.5}
              delay={0.7}
              hasTape
              tapePosition="top"
              style={{
                display: "inline-block",
                padding: "32px 48px",
                maxWidth: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
                  lineHeight: 1.3,
                  fontWeight: "normal",
                }}
              >
                We turn your wildest ideas into unforgettable brands
              </h1>
            </StickyNote>
          </motion.div>

          {/* Subtitle with blur-in */}
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{
              marginTop: 32,
              fontSize: "1.15rem",
              color: "var(--color-text-light)",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            Strategy. Branding. Digital Magic.
            <br />A creative marketing agency that gives a damn.
          </motion.p>

          {/* CTA Buttons — now magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <MagneticButton href="#work" strength={0.35}>
              <motion.span
                whileHover={{
                  boxShadow: "4px 6px 30px rgba(0,0,0,0.25)",
                }}
                style={{
                  display: "inline-block",
                  background: "var(--color-text)",
                  color: "var(--color-primary)",
                  padding: "16px 44px",
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.5rem",
                  borderRadius: "2px",
                  boxShadow: "2px 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                See Our Work
              </motion.span>
            </MagneticButton>
            <MagneticButton href="#contact" strength={0.35}>
              <motion.span
                whileHover={{
                  boxShadow: "4px 6px 30px rgba(253,255,151,0.4)",
                }}
                style={{
                  display: "inline-block",
                  background: "var(--color-primary)",
                  color: "var(--color-text)",
                  padding: "16px 44px",
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.5rem",
                  borderRadius: "2px",
                  boxShadow: "2px 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                Start a Project
              </motion.span>
            </MagneticButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            style={{
              marginTop: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <motion.span
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.1rem",
                opacity: 0.5,
              }}
            >
              scroll down
            </motion.span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4 L12 20 M6 14 L12 20 L18 14"
                  stroke="var(--color-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────────────── SERVICES SECTION ───────────────────── */

const services = [
  {
    title: "Brand Strategy",
    description:
      "We dig deep to find what makes you tick, then build a brand that screams YOU — but louder.",
    icon: "💡",
    color: "var(--color-sticky-yellow)",
    rotate: -2,
  },
  {
    title: "Visual Identity",
    description:
      "Logos, colors, typography — the whole shebang. We make you look so good, your competitors cry.",
    icon: "🎨",
    color: "var(--color-sticky-pink)",
    rotate: 1.5,
  },
  {
    title: "Digital Marketing",
    description:
      "SEO, social media, paid ads — we put you in front of eyeballs that matter. Real ones.",
    icon: "📱",
    color: "var(--color-sticky-blue)",
    rotate: -1,
  },
  {
    title: "Content Creation",
    description:
      "Words and visuals that stop the scroll. We tell stories that make people feel something.",
    icon: "✍️",
    color: "var(--color-sticky-green)",
    rotate: 2,
  },
  {
    title: "Web Design",
    description:
      "Beautiful, fast, accessible websites that convert visitors into fans (and customers).",
    icon: "🖥️",
    color: "var(--color-sticky-orange)",
    rotate: -1.5,
  },
  {
    title: "Campaign Management",
    description:
      "From concept to execution — we orchestrate campaigns that make noise in all the right places.",
    icon: "🚀",
    color: "var(--color-sticky-purple)",
    rotate: 1,
  },
]

const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      style={{
        padding: "100px 20px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <SmoothReveal>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <AnimatedText
            text="What We Do"
            tag="h2"
            handwritten
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              justifyContent: "center",
              marginBottom: 8,
            }}
          />
          <HandDrawnLine width={180} delay={0.3} />
          <motion.p
            initial={{ opacity: 0, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              marginTop: 16,
              fontSize: "1.1rem",
              color: "var(--color-text-light)",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Creative services that make brands unforgettable
          </motion.p>
        </div>
      </SmoothReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          padding: "0 20px",
        }}
      >
        {services.map((service, i) => (
          <StickyNote
            key={service.title}
            color={service.color}
            rotate={service.rotate}
            delay={i * 0.1}
            style={{ minHeight: 220 }}
          >
            <motion.div
              style={{ fontSize: "2.5rem", marginBottom: 12 }}
              whileHover={{ scale: 1.3, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {service.icon}
            </motion.div>
            <h3
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.8rem",
                marginBottom: 8,
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "var(--color-text-light)",
              }}
            >
              {service.description}
            </p>
          </StickyNote>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────── ABOUT SECTION ───────────────────── */

const stats = [
  { number: "150+", label: "Happy Clients" },
  { number: "400+", label: "Projects Done" },
  { number: "12", label: "Team Members" },
  { number: "8+", label: "Years of Hustle" },
]

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      style={{
        padding: "100px 20px",
        position: "relative",
        background:
          "linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-dark) 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="about-grid"
      >
        {/* Left: Notebook-style about text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div
            className="notebook-bg"
            style={{
              background: "var(--color-white)",
              padding: "40px 40px 40px 60px",
              borderRadius: "4px",
              boxShadow: "var(--shadow-sticky)",
              position: "relative",
            }}
          >
            {/* Red margin line */}
            <div
              style={{
                position: "absolute",
                left: 44,
                top: 0,
                bottom: 0,
                width: 2,
                background: "#e88e8e",
                opacity: 0.6,
              }}
            />
            {/* Spiral binding holes */}
            <div
              style={{
                position: "absolute",
                left: 12,
                top: 20,
                bottom: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                    background: "var(--color-bg)",
                  }}
                />
              ))}
            </div>

            <AnimatedText
              text="We're Not Your Average Agency"
              tag="h2"
              handwritten
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                marginBottom: 20,
                lineHeight: 1.3,
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                lineHeight: 2,
                color: "var(--color-text-light)",
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.3rem",
              }}
            >
              We're a scrappy team of creatives, strategists, and digital nerds
              who believe great marketing shouldn't be boring. We doodle in
              meetings, brainstorm over coffee, and pour our hearts into every
              project.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{
                lineHeight: 2,
                color: "var(--color-text-light)",
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.3rem",
                marginTop: 16,
              }}
            >
              From startups finding their voice to established brands
              refreshing their vibe — we're the creative partner you've been
              scribbling about in your notebook.
            </motion.p>
          </div>
        </motion.div>

        {/* Right: Stats as sticky notes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {stats.map((stat, i) => (
            <StickyNote
              key={stat.label}
              color={
                [
                  "var(--color-sticky-yellow)",
                  "var(--color-sticky-pink)",
                  "var(--color-sticky-blue)",
                  "var(--color-sticky-green)",
                ][i]
              }
              rotate={[-2, 1.5, 1, -1.5][i]}
              delay={0.2 + i * 0.15}
              pinColor={["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"][i]}
              style={{ textAlign: "center", padding: "28px 20px" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5 + i * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {stat.number}
              </motion.div>
              <div
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.2rem",
                  marginTop: 8,
                  opacity: 0.8,
                }}
              >
                {stat.label}
              </div>
            </StickyNote>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ───────────────────── WORK/PORTFOLIO SECTION (GSAP Horizontal Scroll) ───────────────────── */

const projects = [
  {
    title: "Bloom Botanicals",
    category: "Branding & Identity",
    description: "Complete rebrand for an organic skincare line that tripled their online presence.",
    color: "#97ffb5",
    num: "01",
  },
  {
    title: "TechPulse",
    category: "Digital Campaign",
    description: "Launch campaign that got 2M impressions in week one and 40K signups.",
    color: "#97d4ff",
    num: "02",
  },
  {
    title: "Savory & Co.",
    category: "Web Design",
    description: "Restaurant website that increased reservations by 340% in two months.",
    color: "#ffc397",
    num: "03",
  },
  {
    title: "FitForge",
    category: "Social Strategy",
    description: "From 500 to 50K followers in 6 months with zero paid promotion.",
    color: "#ff97b5",
    num: "04",
  },
  {
    title: "NovaTech",
    category: "Brand Identity",
    description: "Full visual system for a Series A startup that helped close their next round.",
    color: "#d197ff",
    num: "05",
  },
  {
    title: "GreenLeaf",
    category: "Content & SEO",
    description: "Organic traffic up 520% in 8 months through story-driven content strategy.",
    color: "#fdff97",
    num: "06",
  },
]

const WorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!isMounted) return
    if (typeof window === "undefined") return

    let ctx: any

    const init = async () => {
      const gsapModule = await import("gsap")
      const scrollTriggerModule = await import("gsap/ScrollTrigger")
      const gsap = gsapModule.default || gsapModule
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default?.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const totalScroll = track.scrollWidth - window.innerWidth

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }, section)
    }

    const timer = setTimeout(init, 100)

    return () => {
      clearTimeout(timer)
      if (ctx) ctx.revert()
    }
  }, [isMounted])

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-bg) 50%, var(--color-bg-dark) 100%)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          gap: 0,
          willChange: "transform",
        }}
      >
        {/* Intro panel */}
        <div
          style={{
            minWidth: "45vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(40px, 6vw, 100px)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 1.1,
              marginBottom: 16,
              color: "var(--color-text)",
            }}
          >
            Our Work
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              background: "var(--color-primary)",
              borderRadius: 2,
              marginBottom: 20,
            }}
          />
          <p
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "var(--color-text-light)",
              maxWidth: 380,
              lineHeight: 1.7,
            }}
          >
            A pinboard of projects we're proud of.
            Scroll to explore our creative journey.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: 0.4,
              fontFamily: "var(--font-handwritten)",
              fontSize: "1.2rem",
            }}
          >
            <span>Keep scrolling</span>
            <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
              <path
                d="M0 8h28M22 2l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Project cards */}
        {projects.map((project, i) => (
          <div
            key={project.title}
            style={{
              minWidth: "clamp(340px, 38vw, 500px)",
              height: "70vh",
              maxHeight: 520,
              flexShrink: 0,
              marginRight: i < projects.length - 1 ? 32 : 0,
              position: "relative",
            }}
          >
            <motion.div
              whileHover={{
                y: -8,
                rotate: 0,
                boxShadow: "6px 12px 40px rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                background: project.color,
                borderRadius: 3,
                padding: "clamp(28px, 3vw, 40px)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "3px 6px 20px rgba(0,0,0,0.12)",
                rotate: i % 2 === 0 ? -1 : 1,
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              {/* Corner fold */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: "0 0 32px 32px",
                  borderColor: "transparent transparent rgba(0,0,0,0.06) transparent",
                }}
              />

              {/* Large number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: 10,
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "clamp(8rem, 15vw, 12rem)",
                  lineHeight: 1,
                  opacity: 0.06,
                  fontWeight: "bold",
                  pointerEvents: "none",
                }}
              >
                {project.num}
              </div>

              <div>
                {/* Thumbnail placeholder */}
                <div
                  style={{
                    width: "100%",
                    height: "clamp(140px, 20vh, 200px)",
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 2,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="100" height="70" viewBox="0 0 100 70" opacity="0.2">
                    <path
                      d="M5 60 L25 25 L38 40 L55 12 L72 45 L90 32 L90 60 Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <circle cx="75" cy="18" r="10" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    fontSize: "1rem",
                    opacity: 0.5,
                    marginBottom: 8,
                    letterSpacing: "0.05em",
                  }}
                >
                  {project.category}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    marginBottom: 12,
                    lineHeight: 1.2,
                  }}
                >
                  {project.title}
                </h3>
              </div>

              <p
                style={{
                  fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
                  color: "var(--color-text-light)",
                  lineHeight: 1.6,
                }}
              >
                {project.description}
              </p>
            </motion.div>
          </div>
        ))}

        {/* End spacer */}
        <div style={{ minWidth: "10vw", flexShrink: 0 }} />
      </div>
    </section>
  )
}

/* ───────────────────── PROCESS SECTION ───────────────────── */

const steps = [
  {
    step: "01",
    title: "Discovery",
    description: "We listen. You talk. We take notes (on actual sticky notes).",
  },
  {
    step: "02",
    title: "Strategy",
    description: "We cook up a plan that's smart, bold, and uniquely yours.",
  },
  {
    step: "03",
    title: "Create",
    description: "Our team goes wild — designing, writing, building magic.",
  },
  {
    step: "04",
    title: "Launch",
    description: "We unleash your brand on the world and watch it fly.",
  },
]

const ProcessSection: React.FC = () => {
  return (
    <section
      style={{
        padding: "100px 20px",
        background:
          "linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-bg) 100%)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SmoothReveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <AnimatedText
              text="How We Roll"
              tag="h2"
              handwritten
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                justifyContent: "center",
                marginBottom: 8,
              }}
            />
            <HandDrawnLine width={160} delay={0.3} />
          </div>
        </SmoothReveal>

        <div style={{ position: "relative" }}>
          {/* Connecting dashed line */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              transformOrigin: "top",
            }}
            className="process-line"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                width: "100%",
                height: "100%",
                background:
                  "repeating-linear-gradient(to bottom, var(--color-text) 0px, var(--color-text) 8px, transparent 8px, transparent 16px)",
                transformOrigin: "top",
                opacity: 0.2,
              }}
            />
          </motion.div>

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 40,
                position: "relative",
              }}
            >
              {/* Step dot on timeline */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 300,
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 24,
                  width: 16,
                  height: 16,
                  marginLeft: -8,
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  border: "3px solid var(--color-text)",
                  zIndex: 2,
                }}
                className="process-dot"
              />

              <StickyNote
                color="var(--color-sticky-yellow)"
                rotate={i % 2 === 0 ? -1.5 : 1.5}
                delay={i * 0.2}
                style={{ width: "42%", padding: "24px 28px" }}
                className="process-card"
              >
                <div
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    fontSize: "2.5rem",
                    opacity: 0.2,
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    fontSize: "1.8rem",
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--color-text-light)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </StickyNote>
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .process-line { left: 20px !important; }
            .process-dot { left: 20px !important; }
            .process-card { width: 80% !important; margin-left: 50px !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

/* ───────────────────── TESTIMONIALS SECTION ───────────────────── */

const testimonials = [
  {
    quote:
      "ankeeDesk didn't just redesign our brand — they gave us a whole new personality. Sales up 200%!",
    author: "Sarah Chen",
    role: "CEO, Bloom Botanicals",
    color: "var(--color-sticky-pink)",
    rotate: -2,
  },
  {
    quote:
      "Working with aD feels like working with friends who happen to be creative geniuses.",
    author: "Marcus Rivera",
    role: "Founder, TechPulse",
    color: "var(--color-sticky-blue)",
    rotate: 1.5,
  },
  {
    quote:
      "They turned our boring corporate image into something people actually want to engage with.",
    author: "Emily Park",
    role: "CMO, FitForge",
    color: "var(--color-sticky-green)",
    rotate: -1,
  },
]

const TestimonialsSection: React.FC = () => {
  return (
    <section style={{ padding: "100px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <SmoothReveal>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <AnimatedText
            text="Kind Words"
            tag="h2"
            handwritten
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              justifyContent: "center",
              marginBottom: 8,
            }}
          />
          <HandDrawnLine width={150} delay={0.3} />
        </div>
      </SmoothReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 32,
        }}
      >
        {testimonials.map((t, i) => (
          <StickyNote
            key={t.author}
            color={t.color}
            rotate={t.rotate}
            delay={i * 0.15}
            pinColor={["#ff6b6b", "#4ecdc4", "#f9ca24"][i]}
          >
            <div
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "3rem",
                lineHeight: 1,
                opacity: 0.3,
                marginBottom: 8,
              }}
            >
              "
            </div>
            <p
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.3rem",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {t.quote}
            </p>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {t.author}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.6,
                }}
              >
                {t.role}
              </div>
            </div>
          </StickyNote>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────── CONTACT SECTION ───────────────────── */

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      style={{
        padding: "100px 20px",
        background:
          "linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-dark) 100%)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <SmoothReveal>
          <AnimatedText
            text="Let's Make Something Amazing"
            tag="h2"
            handwritten
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              justifyContent: "center",
              marginBottom: 8,
            }}
          />
          <HandDrawnLine width={200} delay={0.3} />
          <motion.p
            initial={{ opacity: 0, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              marginTop: 16,
              marginBottom: 48,
              fontSize: "1.1rem",
              color: "var(--color-text-light)",
            }}
          >
            Drop us a note — we don't bite (we doodle)
          </motion.p>
        </SmoothReveal>

        <StickyNote
          color="var(--color-sticky-yellow)"
          rotate={-0.5}
          delay={0.3}
          hasTape
          tapePosition="top"
          style={{ maxWidth: 600, margin: "0 auto", padding: "40px 36px" }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <input
                type="text"
                placeholder="Your Name"
                aria-label="Your Name"
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.2rem",
                  padding: "12px 16px",
                  border: "none",
                  borderBottom: "2px solid rgba(0,0,0,0.15)",
                  background: "transparent",
                  outline: "none",
                  color: "var(--color-text)",
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                aria-label="Your Email"
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.2rem",
                  padding: "12px 16px",
                  border: "none",
                  borderBottom: "2px solid rgba(0,0,0,0.15)",
                  background: "transparent",
                  outline: "none",
                  color: "var(--color-text)",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              aria-label="Subject"
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.2rem",
                padding: "12px 16px",
                border: "none",
                borderBottom: "2px solid rgba(0,0,0,0.15)",
                background: "transparent",
                outline: "none",
                color: "var(--color-text)",
              }}
            />
            <textarea
              placeholder="Tell us about your project..."
              rows={5}
              aria-label="Project details"
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "1.2rem",
                padding: "12px 16px",
                border: "none",
                borderBottom: "2px solid rgba(0,0,0,0.15)",
                background: "transparent",
                outline: "none",
                resize: "vertical",
                color: "var(--color-text)",
              }}
            />
            <MagneticButton strength={0.25}>
              <motion.button
                type="submit"
                whileHover={{
                  boxShadow: "4px 6px 30px rgba(0,0,0,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "1.5rem",
                  padding: "16px 48px",
                  background: "var(--color-text)",
                  color: "var(--color-primary)",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  boxShadow: "2px 4px 16px rgba(0,0,0,0.2)",
                  marginTop: 8,
                }}
              >
                Send it!
              </motion.button>
            </MagneticButton>
          </form>
        </StickyNote>

        {/* Alternative contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 40 }}
        >
          <p
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "1.3rem",
              color: "var(--color-text-light)",
            }}
          >
            Or just say hi at{" "}
            <motion.a
              href="mailto:hello@ankeedesk.com"
              whileHover={{ color: "#0B0B0B" }}
              style={{
                color: "var(--color-text)",
                textDecoration: "underline",
                textDecorationStyle: "wavy",
                textDecorationColor: "var(--color-primary-dark)",
              }}
            >
              hello@ankeedesk.com
            </motion.a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────── PAGE LAYOUT ───────────────────── */

const IndexPage: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <main style={{ position: "relative" }}>
      {/* Drawing canvas — doodle anywhere on the page */}
      <ClientOnly>
        <DrawingCanvas />
      </ClientOnly>

      {/* Custom cursor */}
      <ClientOnly>
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      </ClientOnly>

      {/* Film grain overlay */}
      <GrainOverlay />

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, var(--color-primary), var(--color-sticky-pink), var(--color-primary))",
          transformOrigin: "0%",
          scaleX,
          zIndex: 9999,
        }}
      />

      <Navbar />
      <HeroSection />
      <ServicesSection />

      {/* Statement section — handwritten text draws itself */}
      <section
        style={{
          padding: "clamp(80px, 12vw, 160px) 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background: "var(--color-text)",
          overflow: "hidden",
        }}
      >
        {/* Subtle ruled lines in background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 900, width: "100%", position: "relative" }}>
          <HandwrittenReveal
            text={"Every great brand\nstarts as a scribble."}
            fontSize={80}
            color="#FDFF97"
            strokeWidth={1.2}
            duration={2.5}
            style={{ marginBottom: 32 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 3.5, duration: 1 }}
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              color: "rgba(255,255,255,0.5)",
              paddingLeft: 12,
            }}
          >
            — the ankeeDesk way
          </motion.p>
        </div>
      </section>

      <AboutSection />
      <ProcessSection />
      <WorkSection />
      <TestimonialsSection />

      {/* Second handwritten reveal before contact */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 120px) 20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <HandwrittenReveal
            text={"Ready to make\nsome noise?"}
            fontSize={70}
            color="#0B0B0B"
            strokeWidth={1.5}
            duration={2}
          />
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo />
