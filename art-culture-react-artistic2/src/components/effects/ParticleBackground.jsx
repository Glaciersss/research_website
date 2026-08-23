import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 500 }) {
  const pointsRef = useRef()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const actualCount = isMobile ? 150 : count

  const [positions, colors, sizes, velocities] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3)
    const col = new Float32Array(actualCount * 3)
    const siz = new Float32Array(actualCount)
    const vel = new Float32Array(actualCount * 3)

    const palette = [
      new THREE.Color('#e8785a'), // coral
      new THREE.Color('#c9a452'), // gold
      new THREE.Color('#5d9e8f'), // teal
      new THREE.Color('#5e8ab8'), // blue
      new THREE.Color('#f4a88e'), // coral light
      new THREE.Color('#e0cc88'), // gold light
    ]

    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2

      vel[i * 3] = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001

      const color = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b

      siz[i] = Math.random() * 0.06 + 0.015
    }

    return [pos, col, siz, vel]
  }, [actualCount])

  const sprite = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(232,120,90,0.9)')
    gradient.addColorStop(0.3, 'rgba(201,164,82,0.5)')
    gradient.addColorStop(0.7, 'rgba(93,158,143,0.1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const posArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < actualCount; i++) {
      posArray[i * 3] += velocities[i * 3] * delta * 60
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60

      if (Math.abs(posArray[i * 3]) > 15) velocities[i * 3] *= -1
      if (Math.abs(posArray[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1
      if (Math.abs(posArray[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y += 0.0001 * delta * 60
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={actualCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={actualCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={actualCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={sprite}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.5}
      />
    </points>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Particles count={500} />
        </Suspense>
      </Canvas>
    </div>
  )
}
