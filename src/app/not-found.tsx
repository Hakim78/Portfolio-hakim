import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="gutter flex min-h-svh flex-col justify-center">
      <p className="label text-fg/50">404</p>
      <h1 className="title-xl mt-6">Cette page n&apos;existe pas.</h1>
      <Link href="/" className="btn-pill mt-10 w-fit">
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
