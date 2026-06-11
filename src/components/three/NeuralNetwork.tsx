'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'

// Neural network node
function Node({
  position,
  connections,
  mousePosition,
}: {
  position: [number, number, number]
  connections: [number, number, number][]
  mousePosition: { normalizedX: number; normalizedY: number }
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.LineSegments>(null)

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions: number[] = []

    connections.forEach((conn) => {
      positions.push(position[0], position[1], position[2])
      positions.push(conn[0], conn[1], conn[2])
    })

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    return geometry
  }, [position, connections])

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1

      // React to mouse
      const targetX = position[0] + mousePosition.normalizedX * 0.3
      const targetZ = position[2] + mousePosition.normalizedY * 0.3
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.02
      )
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        targetZ,
        0.02
      )
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
      </mesh>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}

// Particle field for ambient effect
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
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
        size={0.02}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Neural network structure
function NeuralNetworkStructure() {
  const mousePosition = useMousePosition()
  const groupRef = useRef<THREE.Group>(null)

  // Generate network nodes
  const nodes = useMemo(() => {
    const nodeList: {
      position: [number, number, number]
      connections: [number, number, number][]
    }[] = []

    // Create layered structure (like a neural network)
    const layers = 4
    const nodesPerLayer = [4, 6, 6, 4]
    const layerPositions: [number, number, number][][] = []

    for (let l = 0; l < layers; l++) {
      const layerNodes: [number, number, number][] = []
      const xOffset = (l - (layers - 1) / 2) * 2.5

      for (let n = 0; n < nodesPerLayer[l]; n++) {
        const yOffset = (n - (nodesPerLayer[l] - 1) / 2) * 1.2
        const zOffset = (Math.random() - 0.5) * 0.5
        layerNodes.push([xOffset, yOffset, zOffset])
      }
      layerPositions.push(layerNodes)
    }

    // Create connections between layers
    for (let l = 0; l < layers; l++) {
      for (let n = 0; n < layerPositions[l].length; n++) {
        const connections: [number, number, number][] = []

        // Connect to next layer
        if (l < layers - 1) {
          layerPositions[l + 1].forEach((nextPos) => {
            if (Math.random() > 0.3) {
              connections.push(nextPos)
            }
          })
        }

        nodeList.push({
          position: layerPositions[l][n],
          connections,
        })
      }
    }

    return nodeList
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {nodes.map((node, i) => (
        <Node
          key={i}
          position={node.position}
          connections={node.connections}
          mousePosition={mousePosition}
        />
      ))}
    </group>
  )
}

// Data flow particles
function DataFlowParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 50

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = -8 + Math.random() * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 5

      vel[i * 3] = 0.02 + Math.random() * 0.03
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01
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

        // Reset particle when it goes off screen
        if (positionAttribute.array[i * 3] > 8) {
          positionAttribute.array[i * 3] = -8
          positionAttribute.array[i * 3 + 1] = (Math.random() - 0.5) * 6
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
        size={0.05}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()
  const mousePosition = useMousePosition()

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mousePosition.normalizedX * 0.5,
      0.02
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mousePosition.normalizedY * 0.5,
      0.02
    )
    camera.lookAt(0, 0, -5)
  })

  return null
}

// Main scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <CameraController />
      <NeuralNetworkStructure />
      <ParticleField />
      <DataFlowParticles />
    </>
  )
}

// Exported component
export function NeuralNetworkBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-dark/50 pointer-events-none" />
    </div>
  )
}
