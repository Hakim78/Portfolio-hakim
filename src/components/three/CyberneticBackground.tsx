'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'

// Cybernetic node (robotic, metallic)
function CyberNode({
  position,
  size = 0.03,
}: {
  position: THREE.Vector3
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulse
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.2 + 1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshBasicMaterial
        color="#4f46e5"
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// Light pulse traveling along a connection
function LightPulse({
  startPos,
  endPos,
  delay,
  speed,
}: {
  startPos: THREE.Vector3
  endPos: THREE.Vector3
  delay: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const progress = useRef(delay)

  useFrame((state, delta) => {
    if (meshRef.current) {
      progress.current += delta * speed

      // Loop the animation
      const t = (progress.current % 3) / 3

      // Ease in-out for smoother movement
      const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      // Calculate position along the line
      meshRef.current.position.lerpVectors(startPos, endPos, easedT)

      // Fade in/out at endpoints
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      const fadeDistance = 0.1
      const opacity = Math.min(
        t / fadeDistance,
        (1 - t) / fadeDistance,
        1
      )
      material.opacity = opacity * 0.8
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial
        color="#818cf8"
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// Fiber optic connection line
function FiberConnection({
  start,
  end,
  pulseCount = 2,
}: {
  start: THREE.Vector3
  end: THREE.Vector3
  pulseCount?: number
}) {
  const lineObject = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
    const material = new THREE.LineBasicMaterial({
      color: '#1e1b4b',
      transparent: true,
      opacity: 0.6,
    })
    return new THREE.Line(geometry, material)
  }, [start, end])

  // Generate pulses with different delays
  const pulses = useMemo(() => {
    return Array.from({ length: pulseCount }, (_, i) => ({
      delay: (i / pulseCount) * 3,
      speed: 0.8 + Math.random() * 0.4,
    }))
  }, [pulseCount])

  return (
    <group>
      {/* Base line (dark fiber) */}
      <primitive object={lineObject} />

      {/* Light pulses */}
      {pulses.map((pulse, i) => (
        <LightPulse
          key={i}
          startPos={start}
          endPos={end}
          delay={pulse.delay}
          speed={pulse.speed}
        />
      ))}
    </group>
  )
}

// Main network structure
function CyberneticNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const mousePosition = useMousePosition()

  // Generate a grid-based network (more robotic than organic)
  const { nodes, connections } = useMemo(() => {
    const nodeList: THREE.Vector3[] = []
    const connList: { start: THREE.Vector3; end: THREE.Vector3 }[] = []

    // Create a 3D grid of nodes
    const gridSize = 5
    const spacing = 1.5
    const offset = (gridSize - 1) * spacing / 2

    // Generate nodes on a grid with some randomization
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < 3; z++) {
          // Only place nodes at certain positions (sparse grid)
          if (Math.random() > 0.6) {
            const pos = new THREE.Vector3(
              x * spacing - offset + (Math.random() - 0.5) * 0.3,
              y * spacing - offset + (Math.random() - 0.5) * 0.3,
              -z * spacing * 2 - 8 + (Math.random() - 0.5) * 0.3
            )
            nodeList.push(pos)
          }
        }
      }
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const dist = nodeList[i].distanceTo(nodeList[j])
        // Connect nodes that are reasonably close
        if (dist < 2.5 && dist > 0.5 && Math.random() > 0.3) {
          connList.push({
            start: nodeList[i],
            end: nodeList[j],
          })
        }
      }
    }

    return { nodes: nodeList, connections: connList }
  }, [])

  // Slow rotation based on mouse
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.normalizedX * 0.15,
        0.02
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.normalizedY * 0.1,
        0.02
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render connections with light pulses */}
      {connections.map((conn, i) => (
        <FiberConnection
          key={`conn-${i}`}
          start={conn.start}
          end={conn.end}
          pulseCount={Math.random() > 0.7 ? 2 : 1}
        />
      ))}

      {/* Render nodes */}
      {nodes.map((pos, i) => (
        <CyberNode key={`node-${i}`} position={pos} size={0.025 + Math.random() * 0.015} />
      ))}
    </group>
  )
}

// Ambient particles (data dust)
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 150

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 10

      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.002
      vel[i * 3 + 2] = 0
    }

    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      const positionAttribute = particlesRef.current.geometry.attributes
        .position as THREE.BufferAttribute

      for (let i = 0; i < count; i++) {
        positionAttribute.array[i * 3] += velocities[i * 3]
        positionAttribute.array[i * 3 + 1] += velocities[i * 3 + 1]

        // Reset particles that go too high
        if (positionAttribute.array[i * 3 + 1] > 8) {
          positionAttribute.array[i * 3 + 1] = -8
          positionAttribute.array[i * 3] = (Math.random() - 0.5) * 15
        }
      }

      positionAttribute.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Horizontal scan lines (CRT effect)
function ScanLines() {
  const linesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const mesh = line as THREE.Mesh
        const material = mesh.material as THREE.MeshBasicMaterial
        // Subtle flicker
        material.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 10 + i) * 0.02
      })
    }
  })

  const lines = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      y: -10 + i * 1,
    }))
  }, [])

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={[0, line.y, -15]}>
          <planeGeometry args={[30, 0.01]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.05} />
        </mesh>
      ))}
    </group>
  )
}

// Camera with subtle movement
function CameraController() {
  const { camera } = useThree()
  const mousePosition = useMousePosition()

  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mousePosition.normalizedX * 0.8,
      0.015
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mousePosition.normalizedY * 0.5,
      0.015
    )
    camera.lookAt(0, 0, -10)
  })

  return null
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 5, 25]} />
      <CameraController />
      <CyberneticNetwork />
      <DataParticles />
      <ScanLines />
    </>
  )
}

// Exported component
export function CyberneticBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 7, 0.4) 50%, rgba(5, 5, 7, 0.9) 100%)`,
        }}
      />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050507] to-transparent pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
    </div>
  )
}
