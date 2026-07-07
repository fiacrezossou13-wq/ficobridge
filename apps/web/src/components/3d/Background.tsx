import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 200

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#4A6FA5'),
      new THREE.Color('#87CEEB'),
      new THREE.Color('#FF6B35'),
      new THREE.Color('#F4D03F'),
      new THREE.Color('#27AE60'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function FloatingLights() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
      })
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 30, Math.random() * 10, (Math.random() - 0.5) * 20 - 5]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#F4D03F" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Images de gratte-ciel réalistes */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="city"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/40 to-slate-50/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-orange-900/10" />
      </div>

      {/* Particules 3D discrètes */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.3} />
          <Particles />
          <FloatingLights />
        </Canvas>
      </div>

      {/* Overlay glassmorphism final */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/5 pointer-events-none" />
    </div>
  )
}
