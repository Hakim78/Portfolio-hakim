/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Anciennes pages → sections de la page d'accueil
    return [
      { source: '/about', destination: '/#profil', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
    ]
  },
}

export default nextConfig
