import * as THREE from 'three'

export interface CardContent {
  title: string
  tagline: string
  image?: string
}

export interface CardFonts {
  display: string
  text: string
}

const TEX_W = 2048
const TEX_H = Math.round(TEX_W / 1.75)

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`image introuvable : ${src}`))
    img.src = src
  })

/** Dessine l'image en « cover » (remplit, recadre au centre). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

function fillTruncated(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y)
    return
  }
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1).trimEnd()
  ctx.fillText(`${t}…`, x, y)
}

/** Lit les familles définies par next/font sur <html>. */
export function readCardFonts(): CardFonts {
  const cs = getComputedStyle(document.documentElement)
  const display = cs.getPropertyValue('--font-inter-tight').trim() || 'Inter, system-ui, sans-serif'
  const text = cs.getPropertyValue('--font-inter').trim() || 'Inter, system-ui, sans-serif'
  return { display, text }
}

/**
 * Texture d'une carte : capture du projet, voile sombre en bas,
 * titre + une ligne de description à gauche, bouton flèche à droite.
 * Le texte fait partie de la surface : il se déforme avec la carte.
 */
export async function createCardTexture(item: CardContent, fonts: CardFonts): Promise<THREE.CanvasTexture> {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d indisponible')

  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  if (item.image) {
    try {
      drawCover(ctx, await loadImage(item.image), TEX_W, TEX_H)
    } catch (err) {
      console.warn('[strip]', (err as Error).message)
    }
  }

  // Voile en bas pour la lisibilité du titre
  const veil = ctx.createLinearGradient(0, TEX_H * 0.6, 0, TEX_H)
  veil.addColorStop(0, 'rgba(0,0,0,0)')
  veil.addColorStop(1, 'rgba(0,0,0,0.6)')
  ctx.fillStyle = veil
  ctx.fillRect(0, TEX_H * 0.6, TEX_W, TEX_H * 0.4)

  const titleSize = Math.round(TEX_W * 0.037)
  const tagSize = Math.round(TEX_W * 0.0165)
  const titleFont = `500 ${titleSize}px ${fonts.display}`
  const tagFont = `400 ${tagSize}px ${fonts.text}`
  try {
    await Promise.race([
      Promise.all([document.fonts.load(titleFont), document.fonts.load(tagFont)]),
      new Promise((r) => setTimeout(r, 1500)),
    ])
  } catch {
    /* police de secours */
  }

  const pad = Math.round(TEX_W * 0.034)
  const baseline = TEX_H - Math.round(TEX_H * 0.072)

  // Bouton flèche
  const r = Math.round(TEX_W * 0.025)
  const cx = TEX_W - pad - r
  const cy = baseline - Math.round(titleSize * 0.34)
  ctx.fillStyle = '#f4f4f2'
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = Math.max(3, r * 0.1)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const a = r * 0.42
  ctx.beginPath()
  ctx.moveTo(cx - a, cy)
  ctx.lineTo(cx + a, cy)
  ctx.moveTo(cx + a * 0.3, cy - a * 0.7)
  ctx.lineTo(cx + a, cy)
  ctx.lineTo(cx + a * 0.3, cy + a * 0.7)
  ctx.stroke()

  // Titre
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 14
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#f4f4f2'
  ctx.font = titleFont
  ctx.fillText(item.title, pad, baseline)
  const titleW = ctx.measureText(item.title).width

  // Description, à droite du titre, tronquée si besoin
  ctx.font = tagFont
  ctx.fillStyle = 'rgba(244,244,242,0.55)'
  const tx = pad + titleW + Math.round(TEX_W * 0.02)
  const maxW = cx - r - Math.round(TEX_W * 0.03) - tx
  if (maxW > tagSize * 6) fillTruncated(ctx, item.tagline, tx, baseline, maxW)
  ctx.shadowBlur = 0

  const tex = new THREE.CanvasTexture(canvas)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}
