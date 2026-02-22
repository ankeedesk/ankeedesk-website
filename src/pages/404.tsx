import React from "react"
import type { HeadFC } from "gatsby"
import { motion } from "framer-motion"

const NotFoundPage: React.FC = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#f5f0e8",
        fontFamily:
          '"JustMeAgainDownHere", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -3, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        whileHover={{
          scale: 1.05,
          rotate: 0,
          boxShadow: "4px 8px 24px rgba(0,0,0,0.2)",
        }}
        style={{
          background: "#FDFF97",
          padding: "48px 56px",
          boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
          borderRadius: 2,
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 0 24px 24px",
            borderColor: "transparent transparent rgba(0,0,0,0.08) transparent",
          }}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          style={{ fontSize: "6rem", lineHeight: 1, marginBottom: 16 }}
        >
          404
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "1.8rem", marginBottom: 24 }}
        >
          Oops! This page got lost in our notes...
        </motion.p>
        <motion.a
          href="/"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "inline-block",
            background: "#0B0B0B",
            color: "#FDFF97",
            padding: "12px 32px",
            fontSize: "1.3rem",
            borderRadius: "2px",
            boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
            textDecoration: "none",
          }}
        >
          Back to the Desk
        </motion.a>
      </motion.div>
    </main>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => (
  <>
    <title>404: Page Not Found | ankeeDesk</title>
    <meta name="description" content="This page doesn't exist" />
  </>
)
