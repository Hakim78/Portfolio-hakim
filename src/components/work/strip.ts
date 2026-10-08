import * as THREE from 'three'
import { cardFragment, cardVertex, gridFragment, gridVertex } from './shaders'
import { createCardTexture, readCardFonts, type CardContent } from './cardTexture'
import { clamp } from '@/lib/utils'

export interface StripOptions {
  reducedMotion: boolean
  /** Progression 0 → 1 de la bande, lue à chaque image */
  getProgress: () => number
  /** Index de la carte au centre (pour le compteur) */
  onIndex?: (index: number) => void
}

const RATIO = 1.75
const FOV = 42
const DEG = Math.PI / 180

interface CardUniforms extends Record<string, THREE.IUniform> {
  uMap: THREE.IUniform<THREE.Texture | null>
  uHasMap: THREE.IUniform<number>
  uSize: THREE.IUniform<THREE.Vector2>
  uRadius: THREE.IUniform<number>
  uOpacity: THREE.IUniform<number>
  uHover: THREE.IUniform<number>
  uLightDir: THREE.IUniform<THREE.Vector3>
  uCamPos: THREE.IUniform<THREE.Vector3>
  uCurv: THREE.IUniform<number>
  uAmp: THREE.IUniform<number>
  uWaveK: THREE.IUniform<number>
  uPhase: THREE.IUniform<number>
  uLift: THREE.IUniform<number>
}

/**
 * Bande de cartes WebGL : géométrie plate qui s'éloigne sur les côtés,
 * onde en profondeur proportionnelle à la vitesse, éclairage spéculaire,
 * grille fixe au sol. Pas de snap : la position vient du scroll de la page.
 */
export class Strip {
  readonly items: CardContent[]
  private readonly opts: StripOptions
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.PerspectiveCamera
  private readonly geometry = new THREE.PlaneGeometry(1, 1, 72, 36)
  private readonly cards: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = []
  private readonly grid: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private readonly raycaster = new THREE.Raycaster()
  private readonly clock = new THREE.Clock()

  private W = 1
  private H = 1
  private dist = 1
  private cardW = 1
  private cardH = 1
  private pitch = 1
  private ampMax = 0
  private ampIdle = 0

  private offset = 0
  private prevOffset = 0
  private vel = 0
  private amp = 0
  private time = 0
  private intro = 0
  private index = -1

  private pointer = new THREE.Vector2(2, 2)
  private pointerDirty = false
  private hoverIndex = -1
  private readonly hover: number[]

  private raf = 0
  private disposed = false

  constructor(canvas: HTMLCanvasElement, items: CardContent[], opts: StripOptions) {
    this.items = items
    this.opts = opts
    this.hover = items.map(() => 0)

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 1, 10000)

    const fonts = readCardFonts()
    items.forEach((item, i) => {
      const uniforms: CardUniforms = {
        uMap: { value: null },
        uHasMap: { value: 0 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uRadius: { value: 0 },
        uOpacity: { value: opts.reducedMotion ? 1 : 0 },
        uHover: { value: 0 },
        uLightDir: { value: new THREE.Vector3(-0.35, 0.55, 1).normalize() },
        uCamPos: { value: this.camera.position },
        uCurv: { value: 0 },
        uAmp: { value: 0 },
        uWaveK: { value: 0 },
        uPhase: { value: 0 },
        uLift: { value: 0 },
      }
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: cardVertex,
        fragmentShader: cardFragment,
        transparent: true,
        depthWrite: true,
      })
      const mesh = new THREE.Mesh(this.geometry, material)
      mesh.userData.index = i
      mesh.renderOrder = 1
      mesh.frustumCulled = false
      this.scene.add(mesh)
      this.cards.push(mesh)

      createCardTexture(item, fonts)
        .then((tex) => {
          if (this.disposed) {
            tex.dispose()
            return
          }
          tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
          uniforms.uMap.value = tex
          uniforms.uHasMap.value = 1
        })
        .catch((err) => console.warn('[strip] texture', err))
    })

    this.grid = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: {
          uCell: { value: 100 },
          uColor: { value: new THREE.Color('#2a2a2a') },
          uFar: { value: 1000 },
          uCamPos: { value: this.camera.position },
          uOpacity: { value: opts.reducedMotion ? 1 : 0 },
        },
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        transparent: true,
        depthWrite: false,
      })
    )
    this.grid.rotation.x = -Math.PI / 2
    this.grid.renderOrder = 0
    this.grid.frustumCulled = false
    this.scene.add(this.grid)

    this.raf = requestAnimationFrame(this.frame)
  }

  /** Distance de scroll (px) qui fait défiler toute la bande */
  get travel() {
    return (this.items.length - 1) * this.pitch
  }

  resize(W: number, H: number) {
    this.W = W
    this.H = H
    this.renderer.setSize(W, H, false)

    // Caméra : 1 unité monde = 1 px CSS dans le plan z = 0
    this.dist = H / 2 / Math.tan((FOV / 2) * DEG)
    this.camera.aspect = W / H
    this.camera.position.set(0, 0, this.dist)
    this.camera.near = this.dist * 0.05
    this.camera.far = this.dist * 12
    this.camera.updateProjectionMatrix()

    const mobile = W < 768
    this.cardW = (mobile ? 0.86 : 0.59) * W
    this.cardH = this.cardW / RATIO
    this.pitch = this.cardW + 0.02 * W
    this.ampMax = Math.min(0.22 * W, 0.4 * this.dist)
    this.ampIdle = this.opts.reducedMotion ? 0 : 0.012 * W

    const curv = 0.55 / W
    const waveK = (Math.PI * 2) / (1.1 * W)
    const radius = 0.016 * this.cardW

    for (const card of this.cards) {
      card.scale.set(this.cardW, this.cardH, 1)
      const u = card.material.uniforms as unknown as CardUniforms
      u.uSize.value.set(this.cardW, this.cardH)
      u.uRadius.value = radius
      u.uCurv.value = curv
      u.uWaveK.value = waveK
    }

    this.grid.scale.set(W * 10, H * 10, 1)
    this.grid.position.set(0, -(this.cardH / 2 + 0.045 * H), -H * 3)
    this.grid.material.uniforms.uCell.value = 0.064 * W
    this.grid.material.uniforms.uFar.value = H * 5.5
  }

  /** Position du pointeur (px CSS) pour le survol */
  setPointer(x: number, y: number) {
    this.pointer.set((x / this.W) * 2 - 1, -(y / this.H) * 2 + 1)
    this.pointerDirty = true
  }

  clearPointer() {
    this.pointer.set(2, 2)
    this.pointerDirty = true
  }

  /** Index de la carte sous le point (px CSS), −1 sinon */
  hitTest(x: number, y: number): number {
    const ndc = new THREE.Vector2((x / this.W) * 2 - 1, -(y / this.H) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const hit = this.raycaster.intersectObjects(this.cards, false)[0]
    return hit ? (hit.object.userData.index as number) : -1
  }

  get hovered() {
    return this.hoverIndex
  }

  private frame = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.frame)

    const dt = clamp(this.clock.getDelta(), 0.001, 0.05)
    const f = dt * 60 // facteur de normalisation à 60 i/s
    this.time += dt

    // Entrée : la bande glisse en place et une onde s'amortit
    const reduced = this.opts.reducedMotion
    this.intro = reduced ? 1 : Math.min(1, this.intro + dt / 1.8)
    const ie = 1 - Math.pow(1 - this.intro, 3)

    const target = -clamp(this.opts.getProgress(), 0, 1) * this.travel + (1 - ie) * 0.3 * this.W
    this.offset += (target - this.offset) * Math.min(1, 0.32 * f)

    const v = ((this.offset - this.prevOffset) / f) || 0
    this.prevOffset = this.offset
    this.vel += (v - this.vel) * Math.min(1, 0.18 * f)

    // Amplitude de l'onde ∝ vitesse (attaque rapide, relâche lente)
    const speed = Math.min(1, Math.abs(this.vel) / 38)
    const ampTarget = reduced
      ? 0
      : this.ampMax * Math.pow(speed, 0.85) + (1 - ie) * 0.5 * this.ampMax + this.ampIdle
    this.amp += (ampTarget - this.amp) * Math.min(1, (ampTarget > this.amp ? 0.22 : 0.05) * f)

    const phase = this.time * 0.6 - this.offset * ((Math.PI * 2) / (1.1 * this.W)) * 0.35

    // Survol
    if (this.pointerDirty) {
      this.pointerDirty = false
      if (this.pointer.x > 1.5) {
        this.hoverIndex = -1
      } else {
        this.raycaster.setFromCamera(this.pointer, this.camera)
        const hit = this.raycaster.intersectObjects(this.cards, false)[0]
        this.hoverIndex = hit ? (hit.object.userData.index as number) : -1
      }
    }

    const opacity = reduced ? 1 : ie
    this.cards.forEach((card, i) => {
      const x = i * this.pitch + this.offset
      card.position.x = x
      card.visible = Math.abs(x) < this.W * 1.6
      this.hover[i] += ((i === this.hoverIndex ? 1 : 0) - this.hover[i]) * Math.min(1, 0.12 * f)
      const u = card.material.uniforms as unknown as CardUniforms
      u.uAmp.value = this.amp
      u.uPhase.value = phase
      u.uHover.value = this.hover[i]
      u.uLift.value = this.hover[i] * 14
      u.uOpacity.value = opacity
    })
    this.grid.material.uniforms.uOpacity.value = opacity

    // Carte au centre → compteur
    const idx = clamp(Math.round(-this.offset / this.pitch), 0, this.items.length - 1)
    if (idx !== this.index) {
      this.index = idx
      this.opts.onIndex?.(idx)
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    for (const card of this.cards) {
      const u = card.material.uniforms as unknown as CardUniforms
      u.uMap.value?.dispose()
      card.material.dispose()
    }
    this.geometry.dispose()
    this.grid.geometry.dispose()
    this.grid.material.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
