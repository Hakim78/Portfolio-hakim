'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/projects', label: 'Projets' },
  { href: '/about', label: 'À Propos' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-4' : 'py-6'
      )}
    >
      <nav
        className={cn(
          'mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between',
          'transition-all duration-500',
          isScrolled && 'glass rounded-full mx-4 lg:mx-8 px-6 py-3'
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-display font-bold tracking-tight hover:text-primary transition-colors"
        >
          H<span className="text-primary">.</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-primary',
                  'after:transition-all after:duration-300',
                  pathname === item.href
                    ? 'text-white after:w-full'
                    : 'text-dark-600 hover:text-white after:w-0 hover:after:w-full'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-dark-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Disponible pour alternance</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all duration-300 origin-left',
                isMobileMenuOpen && 'rotate-45 translate-x-px'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all duration-300',
                isMobileMenuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all duration-300 origin-left',
                isMobileMenuOpen && '-rotate-45 translate-x-px'
              )}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-dark/95 backdrop-blur-xl transition-all duration-500 pt-24',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <ul className="flex flex-col items-center gap-8 p-8">
          {navItems.map((item, index) => (
            <li
              key={item.href}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms',
              }}
              className={cn(
                'transition-all duration-500',
                isMobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              )}
            >
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-3xl font-display font-bold transition-colors',
                  pathname === item.href ? 'text-primary' : 'text-white'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-dark-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Disponible pour alternance</span>
          </div>
        </div>
      </div>
    </header>
  )
}
