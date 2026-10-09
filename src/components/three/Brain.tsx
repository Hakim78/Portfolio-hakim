'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Cerveau hologramme (modèle .glb de l'ancien portfolio), en three.js nu :
 * rotation lente, flottement, lumière émeraude. Rendu uniquement quand visible.
 */
export function Brain({ src = '/models/brain_hologram.glb', className }: { src?: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 5)

    scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(10, 10, 5)
    scene.add(key)
    const rim = new THREE.PointLight(0x10b981, 80, 0, 2)
    rim.position.set(-4, -3, -2)
    scene.add(rim)
    const fill = new THREE.PointLight(0x34d399, 30, 0, 2)
    fill.position.set(3, 2, 3)
    scene.add(fill)

    const group = new THREE.Group()
    scene.add(group)

    let model: THREE.Object3D | null = null
    const loader = new GLTFLoader()
    loader.load(
      src,
      (gltf) => {
        model = gltf.scene
        // Centrage et mise à l'échelle automatiques (le modèle n'a pas d'unité connue)
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3()).length() || 1
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        model.scale.setScalar(3.4 / size)
        model.traverse((o) => {
          const mesh = o as THREE.Mesh
          if (mesh.isMesh) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            for (const m of mats) {
              const std = m as THREE.MeshStandardMaterial
              if ('emissive' in std) {
                std.emissive = new THREE.Color(0x10b981)
                std.emissiveIntensity = 0.18
              }
            }
          }
        })
        group.add(model)
        render()
      },
      undefined,
      (err) => console.warn('[brain] modèle introuvable', err)
    )

    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let raf = 0
    let visible = true
    const clock = new THREE.Clock()
    const render = () => renderer.render(scene, camera)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const t = clock.getElapsedTime()
      group.rotation.y += 0.005
      group.position.y = Math.sin(t * 0.5) * 0.2
      render()
    }
    if (reduced) render()
    else loop()

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(host)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      model?.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) {
          mesh.geometry.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [src])

  return <div ref={hostRef} aria-hidden className={className} />
}
