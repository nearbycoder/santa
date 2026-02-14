import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Gift, Sparkles, PartyPopper, Home } from 'lucide-react'
import { decodeRevealToken } from '../lib/santa'

export const Route = createFileRoute('/reveal')({
  component: Reveal,
  validateSearch: (search: Record<string, unknown>) => ({
    t: (search.t as string) || '',
  }),
})

function Reveal() {
  const { t } = Route.useSearch()
  const [revealed, setRevealed] = useState(false)
  const [assignment, setAssignment] = useState<{
    giver: string
    receiver: string
  } | null>(null)

  useEffect(() => {
    if (!t) return

    const decoded = decodeRevealToken(t)
    if (decoded) {
      setAssignment({
        giver: decoded.giver,
        receiver: decoded.receiver,
      })
    }
  }, [t])

  if (!t || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f3] via-[#f4e4c1]/20 to-[#d4af37]/10">
        <div className="text-center">
          <p className="text-[#5a1a1a]/60 text-lg mb-4">Invalid or missing reveal link</p>
          <Link
            to="/"
            className="text-[#d4af37] hover:text-[#8b2f2f] underline font-medium"
          >
            Create a new Secret Santa
          </Link>
        </div>
      </div>
    )
  }

  const handleReveal = () => {
    setRevealed(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f3] via-[#f4e4c1]/20 to-[#d4af37]/10 -z-10" />

      <div className="fixed top-20 right-20 w-96 h-96 bg-[#8b2f2f]/5 rounded-full blur-3xl -z-10 animate-[float_20s_ease-in-out_infinite]" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-[#1a4d2e]/5 rounded-full blur-3xl -z-10 animate-[float_25s_ease-in-out_infinite]" />

      <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        {!revealed ? (
          // Before reveal
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-block mb-8 animate-[float_6s_ease-in-out_infinite]">
              <Gift
                className="w-24 h-24 mx-auto text-[#d4af37]"
                strokeWidth={1.5}
              />
            </div>

            <h1
              className="text-6xl md:text-8xl font-bold text-[#5a1a1a] tracking-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Hello, {assignment.giver}
            </h1>

            <p className="text-2xl text-[#5a1a1a]/70 font-light mb-12 max-w-2xl mx-auto">
              You've been matched for Secret Santa!
              <br />
              Ready to discover who you're gifting to?
            </p>

            <button
              onClick={handleReveal}
              className="group relative px-16 py-8 bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] bg-size-200 text-[#5a1a1a] rounded-3xl font-bold text-3xl shadow-2xl shadow-[#d4af37]/50 hover:shadow-[#d4af37]/70 transition-all hover:scale-105 active:scale-95 animate-[glow_3s_ease-in-out_infinite]"
              style={{
                fontFamily: 'Playfair Display, serif',
                backgroundSize: '200% 100%',
              }}
            >
              <span className="relative z-10 flex items-center gap-4">
                <Sparkles className="w-8 h-8" />
                Reveal My Match
                <Sparkles className="w-8 h-8" />
              </span>
            </button>

            <p className="text-[#5a1a1a]/50 text-sm mt-8">
              Click the button above to see your Secret Santa assignment
            </p>
          </div>
        ) : (
          // After reveal
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <div className="mb-8">
              <PartyPopper
                className="w-24 h-24 mx-auto text-[#d4af37] animate-in spin-in zoom-in duration-1000"
                strokeWidth={1.5}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#5a1a1a]/20 p-12 md:p-16 border-4 border-[#d4af37]/30 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <p
                className="text-2xl text-[#5a1a1a]/60 mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                You're giving a gift to...
              </p>

              <div className="relative inline-block mb-8">
                <h2
                  className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b2f2f] via-[#d4af37] to-[#1a4d2e] tracking-tight animate-in fade-in zoom-in duration-1000 delay-500"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {assignment.receiver}
                </h2>
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 via-transparent to-[#d4af37]/20 blur-xl -z-10 animate-pulse" />
              </div>

              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-8" />

              <p className="text-xl text-[#5a1a1a]/70 font-light max-w-2xl mx-auto mb-8">
                Start thinking about the perfect gift!
                <br />
                <span className="text-[#8b2f2f] font-medium">
                  Keep it a secret
                </span>{' '}
                until the big reveal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-[#5a1a1a]/60 text-sm">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Happy gifting!</span>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="mt-12 space-y-4 animate-in fade-in duration-1000 delay-700">
              <p className="text-[#5a1a1a]/50 text-sm">
                ✦ This assignment is unique to you ✦
              </p>
              <p className="text-[#5a1a1a]/40 text-xs">
                You can bookmark this page to see your assignment again
              </p>
            </div>

            {/* Home link */}
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#5a1a1a]/60 hover:text-[#5a1a1a] transition-colors group"
              >
                <Home className="w-4 h-4" />
                <span>Create a new Secret Santa</span>
              </Link>
            </div>
          </div>
        )}

        {/* Decorative sparkles */}
        {revealed && (
          <>
            <div className="absolute top-20 left-20 animate-in fade-in zoom-in duration-1000 delay-500">
              <Sparkles className="w-8 h-8 text-[#d4af37]/40 animate-[float_4s_ease-in-out_infinite]" />
            </div>
            <div className="absolute top-40 right-32 animate-in fade-in zoom-in duration-1000 delay-700">
              <Sparkles className="w-6 h-6 text-[#8b2f2f]/40 animate-[float_5s_ease-in-out_infinite]" />
            </div>
            <div className="absolute bottom-32 left-32 animate-in fade-in zoom-in duration-1000 delay-900">
              <Sparkles className="w-10 h-10 text-[#1a4d2e]/40 animate-[float_6s_ease-in-out_infinite]" />
            </div>
            <div className="absolute bottom-20 right-20 animate-in fade-in zoom-in duration-1000 delay-1000">
              <Sparkles className="w-7 h-7 text-[#d4af37]/40 animate-[float_4.5s_ease-in-out_infinite]" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
