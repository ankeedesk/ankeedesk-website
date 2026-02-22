import React from "react"
import { motion } from "framer-motion"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        background: "var(--color-text)",
        color: "var(--color-bg)",
        padding: "60px 40px 30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Torn paper edge */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: 0,
          right: 0,
          height: 40,
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 1440 40">
          <path
            d="M0 40 L0 20 Q 30 15 60 22 Q 90 28 120 18 Q 150 8 180 20 Q 210 30 240 16 Q 270 5 300 22 Q 330 35 360 18 Q 390 5 420 20 Q 450 32 480 15 Q 510 3 540 22 Q 570 36 600 18 Q 630 4 660 20 Q 690 33 720 16 Q 750 2 780 22 Q 810 38 840 18 Q 870 3 900 20 Q 930 34 960 15 Q 990 0 1020 22 Q 1050 38 1080 18 Q 1110 2 1140 20 Q 1170 35 1200 16 Q 1230 0 1260 22 Q 1290 38 1320 18 Q 1350 2 1380 20 Q 1410 35 1440 18 L1440 40 Z"
            fill="var(--color-text)"
          />
        </svg>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 40,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "3rem",
              marginBottom: 12,
              color: "var(--color-primary)",
            }}
          >
            aD
          </div>
          <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
            Turning ideas into impact.<br />
            Your story, our craft.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h4
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "1.6rem",
              marginBottom: 16,
              color: "var(--color-primary)",
            }}
          >
            Quick Links
          </h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Home", "Services", "About", "Work", "Contact"].map((item) => (
              <li key={item}>
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ x: 4, color: "#FDFF97" }}
                  style={{
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    display: "inline-block",
                    color: "var(--color-bg)",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h4
            style={{
              fontFamily: "var(--font-handwritten)",
              fontSize: "1.6rem",
              marginBottom: 16,
              color: "var(--color-primary)",
            }}
          >
            Get in Touch
          </h4>
          <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
            hello@ankeedesk.com<br />
            +1 (555) 123-4567
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {["Twitter", "Instagram", "LinkedIn"].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -3, color: "#FDFF97" }}
                style={{
                  opacity: 0.7,
                  fontSize: "0.9rem",
                  color: "var(--color-bg)",
                  textDecoration: "none",
                }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: "center",
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          opacity: 0.5,
          fontSize: "0.85rem",
        }}
      >
        <p>
          © {currentYear} ankeeDesk. Scribbled with passion.
        </p>
      </motion.div>
    </footer>
  )
}

export default Footer
