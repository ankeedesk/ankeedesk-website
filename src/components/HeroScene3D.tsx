import React, { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

function FadeIn({ delay, children }: { delay: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!)
  const [elapsed, setElapsed] = useState(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    if (elapsed < delay) {
      setElapsed((e) => e + delta)
      ref.current.scale.setScalar(0)
      return
    }
    const t = Math.min(1, (elapsed - delay) / 0.6)
    const eased = 1 - Math.pow(1 - t, 3)
    ref.current.scale.setScalar(eased)
    if (t < 1) setElapsed((e) => e + delta)
  })

  return <group ref={ref}>{children}</group>
}

function CameraRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.8
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.5
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.03
    camera.position.y += (target.current.y + 0.5 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return null
}

interface StickyNote3DProps {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  scale?: number
  speed?: number
}

function StickyNote3D({ position, rotation, color, scale = 1, speed = 1.5 }: StickyNote3DProps) {
  const mat = useMemo(() => new THREE.MeshLambertMaterial({ color }), [color])
  const cornerMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    [color]
  )

  return (
    <Float speed={speed} floatIntensity={0.3} rotationIntensity={0.15}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh material={mat}>
          <boxGeometry args={[1.2, 1.2, 0.015]} />
        </mesh>
        <mesh position={[0.5, -0.5, 0.01]} rotation={[0, 0, Math.PI / 4]} material={cornerMat}>
          <planeGeometry args={[0.22, 0.22]} />
        </mesh>
        {[-0.15, 0.05, 0.25].map((y, i) => (
          <mesh key={i} position={[-0.05, y, 0.009]}>
            <planeGeometry args={[0.65 - i * 0.12, 0.025]} />
            <meshBasicMaterial color="#00000010" transparent />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function Pencil3D({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <Float speed={1} floatIntensity={0.25} rotationIntensity={0.1}>
      <group position={position} rotation={rotation} scale={0.12}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 6, 6]} />
          <meshLambertMaterial color="#f4c542" />
        </mesh>
        <mesh position={[0, -3.3, 0]}>
          <coneGeometry args={[0.12, 0.6, 6]} />
          <meshLambertMaterial color="#f5deb3" />
        </mesh>
        <mesh position={[0, -3.55, 0]}>
          <coneGeometry args={[0.04, 0.15, 6]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0, 3.25, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 6]} />
          <meshLambertMaterial color="#e8a0a0" />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.15, 6]} />
          <meshLambertMaterial color="#c0c0c0" />
        </mesh>
      </group>
    </Float>
  )
}

function PaperAirplane({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime
      ref.current.position.x = position[0] + Math.sin(t * 0.4) * 0.5
      ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.1
    }
  })

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0); s.lineTo(1.5, 0.4); s.lineTo(0, 0.8); s.lineTo(0.2, 0.4); s.closePath()
    return s
  }, [])

  const wingMat = useMemo(() => new THREE.MeshLambertMaterial({ color: "#f5f0e8", side: THREE.DoubleSide }), [])

  return (
    <group ref={ref} position={position} rotation={rotation} scale={0.5}>
      <mesh rotation={[0.3, 0, 0]} material={wingMat}>
        <shapeGeometry args={[shape]} />
      </mesh>
      <mesh rotation={[-0.3, 0, 0]} material={wingMat}>
        <shapeGeometry args={[shape]} />
      </mesh>
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(50 * 3)
    for (let i = 0; i < 50; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={50} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fdff97" size={0.04} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function Scene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <pointLight position={[-3, 2, -2]} intensity={0.4} color="#fdff97" />

      <FadeIn delay={0}>
        <StickyNote3D position={[-2.8, 1.2, -1]} rotation={[0.1, 0.3, -0.15]} color="#fdff97" scale={0.8} speed={1.2} />
      </FadeIn>
      <FadeIn delay={0.3}>
        <StickyNote3D position={[2.5, 0.8, -0.5]} rotation={[-0.1, -0.2, 0.1]} color="#ff97b5" scale={0.65} speed={1.8} />
      </FadeIn>
      <FadeIn delay={0.6}>
        <StickyNote3D position={[-1.5, -1.0, 0.5]} rotation={[0.05, 0.1, 0.2]} color="#97d4ff" scale={0.55} speed={1.5} />
      </FadeIn>
      <FadeIn delay={0.9}>
        <StickyNote3D position={[3.2, -0.6, -1.5]} rotation={[-0.1, 0.4, -0.1]} color="#97ffb5" scale={0.5} speed={2} />
      </FadeIn>
      <FadeIn delay={1.2}>
        <StickyNote3D position={[-3.5, -0.3, -2]} rotation={[0.2, -0.3, 0.15]} color="#ffc397" scale={0.45} speed={1.3} />
      </FadeIn>
      <FadeIn delay={1.5}>
        <Pencil3D position={[1.8, 1.8, 0.5]} rotation={[0.3, 0.2, -0.8]} />
      </FadeIn>
      <FadeIn delay={1.8}>
        <PaperAirplane position={[-1.0, 1.8, 1]} rotation={[0, -0.5, 0.1]} />
      </FadeIn>
      <FadeIn delay={0.5}>
        <Particles />
      </FadeIn>
    </>
  )
}

const HeroScene3D: React.FC = () => {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
        frameloop="always"
        performance={{ min: 0.5 }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default HeroScene3D
