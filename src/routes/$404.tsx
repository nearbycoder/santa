import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, Gift } from 'lucide-react'

export const Route = createFileRoute('/$404')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f3] via-[#f4e4c1]/20 to-[#d4af37]/10 -z-10" />

      <div className="fixed top-20 right-20 w-96 h-96 bg-[#8b2f2f]/5 rounded-full blur-3xl -z-10 animate-[float_20s_ease-in-out_infinite]" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-[#1a4d2e]/5 rounded-full blur-3xl -z-10 animate-[float_25s_ease-in-out_infinite]" />

      <div className="text-center px-6">
        <div className="mb-8 animate-[float_6s_ease-in-out_infinite]">
          <Gift
            className="w-24 h-24 mx-auto text-[#d4af37] opacity-50"
            strokeWidth={1.5}
          />
        </div>

        <h1
          className="text-9xl font-bold text-[#5a1a1a]/20 mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          404
        </h1>

        <h2
          className="text-4xl md:text-5xl font-bold text-[#5a1a1a] mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Page Not Found
        </h2>

        <p className="text-xl text-[#5a1a1a]/70 mb-12 max-w-md mx-auto">
          This page seems to be missing from the gift exchange.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8b2f2f] to-[#5a1a1a] text-white rounded-2xl hover:shadow-xl hover:shadow-[#5a1a1a]/30 transition-all hover:scale-105 active:scale-95 font-medium"
        >
          <Home className="w-5 h-5" />
          Go back home
        </Link>
      </div>
    </div>
  )
}
