import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const pad2 = (n: number) => String(n).padStart(2, '0')
