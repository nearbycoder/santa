import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Copy, Check, Gift, Share2, ArrowLeft } from 'lucide-react'
import {
  decodeParticipants,
  generateAssignments,
  createRevealToken,
  type Assignment,
} from '../lib/santa'

export const Route = createFileRoute('/generate')({
  component: Generate,
  validateSearch: (search: Record<string, unknown>) => ({
    p: (search.p as string) || '',
  }),
})

function Generate() {
  const { p } = Route.useSearch()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  useEffect(() => {
    if (!p) return

    const participants = decodeParticipants(p)
    if (participants.length < 2) return

    const newAssignments = generateAssignments(participants)
    setAssignments(newAssignments)
  }, [p])

  const getRevealUrl = (assignment: Assignment) => {
    const token = createRevealToken(assignment, assignments)
    return `${window.location.origin}/reveal?t=${token}`
  }

  const copyLink = async (assignment: Assignment) => {
    const url = getRevealUrl(assignment)
    await navigator.clipboard.writeText(url)
    setCopiedId(assignment.giverId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyAllLinks = async () => {
    const links = assignments
      .map(
        (assignment) => `${assignment.giver}: ${getRevealUrl(assignment)}`
      )
      .join('\n\n')

    await navigator.clipboard.writeText(links)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  if (!p || assignments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5a1a1a]/60 mb-4">No participants found</p>
          <Link
            to="/"
            className="text-[#d4af37] hover:text-[#8b2f2f] underline"
          >
            Go back to add participants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f3] via-[#f4e4c1]/20 to-[#d4af37]/10 -z-10" />

      <div className="fixed top-20 left-20 w-96 h-96 bg-[#1a4d2e]/5 rounded-full blur-3xl -z-10 animate-[float_20s_ease-in-out_infinite]" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-[#8b2f2f]/5 rounded-full blur-3xl -z-10 animate-[float_25s_ease-in-out_infinite]" />

      <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            to="/"
            search={{ p }}
            className="inline-flex items-center gap-2 text-[#5a1a1a]/60 hover:text-[#5a1a1a] mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to participants
          </Link>
          <div className="inline-block mb-6 animate-[float_6s_ease-in-out_infinite]">
            <Gift
              className="w-12 h-12 mx-auto text-[#d4af37] sm:w-16 sm:h-16"
              strokeWidth={1.5}
            />
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#5a1a1a] tracking-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Assignments Ready!
          </h1>
          <p className="text-base sm:text-lg text-[#5a1a1a]/70 font-light max-w-2xl mx-auto">
            Share each personalized link below. Each person will only see{' '}
            <span className="text-[#8b2f2f] font-medium">who they're giving to</span>.
          </p>
        </div>

        {/* Copy all button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={copyAllLinks}
            className="w-full sm:w-auto justify-center px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-[#d4af37]/30 text-[#5a1a1a] rounded-xl hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {copiedAll ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                Copied all links!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Copy all links
              </>
            )}
          </button>
        </div>

        {/* Assignments grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {assignments.map((assignment, idx) => (
            <div
              key={assignment.giverId}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-[#5a1a1a]/10 p-4 sm:p-6 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${idx * 75}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b2f2f] to-[#5a1a1a] flex items-center justify-center text-white font-bold text-lg">
                    {assignment.giver.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#5a1a1a] break-all"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {assignment.giver}
                    </h3>
                    <p className="text-sm text-[#5a1a1a]/50">
                      Personalized link
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => copyLink(assignment)}
                className="w-full py-3 bg-gradient-to-r from-[#8b2f2f] to-[#5a1a1a] text-white rounded-xl hover:shadow-lg hover:shadow-[#5a1a1a]/30 transition-all hover:scale-105 active:scale-95 font-medium flex items-center justify-center gap-2"
              >
                {copiedId === assignment.giverId ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy link
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-[#d4af37]/10 via-[#f4e4c1]/10 to-[#d4af37]/10 rounded-2xl p-5 sm:p-8 border border-[#d4af37]/30">
          <h3
            className="text-xl sm:text-2xl font-bold text-[#5a1a1a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            How to share
          </h3>
          <ol className="space-y-3 text-sm sm:text-base text-[#5a1a1a]/70">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#d4af37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>
                Click "Copy link" next to each person's name to copy their
                unique reveal link
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#d4af37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                Send each person their link via text, email, or your preferred
                messaging app
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#d4af37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                Each person clicks their link to reveal who they're giving a
                gift to — <strong>only they can see their assignment!</strong>
              </span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center space-y-3">
          <p className="text-[#5a1a1a]/60 text-sm">
            ✦ Links are secure and unique to each person ✦
          </p>
          <p className="text-[#5a1a1a]/50 text-xs">
            Want to create a new exchange?{' '}
            <Link to="/" className="text-[#d4af37] hover:underline">
              Start over
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
