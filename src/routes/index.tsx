import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, X, Sparkles, Users } from 'lucide-react'
import {
  type Participant,
  generateId,
  encodeParticipants,
  decodeParticipants,
} from '../lib/santa'

export const Route = createFileRoute('/')({
  component: Home,
  validateSearch: (search: Record<string, unknown>) => ({
    p: (search.p as string) || '',
  }),
})

function Home() {
  const navigate = useNavigate()
  const { p } = Route.useSearch()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [newName, setNewName] = useState('')

  // Load participants from URL on mount
  useEffect(() => {
    if (p) {
      const decoded = decodeParticipants(p)
      setParticipants(decoded)
    }
  }, [p])

  // Update URL whenever participants change
  useEffect(() => {
    if (participants.length > 0) {
      const encoded = encodeParticipants(participants)
      navigate({
        search: { p: encoded },
        replace: true,
      })
    } else if (p) {
      navigate({
        search: {},
        replace: true,
      })
    }
  }, [participants, navigate, p])

  const addParticipant = () => {
    const trimmed = newName.trim()
    if (!trimmed) return

    const exists = participants.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) {
      alert('This name is already in the list!')
      return
    }

    setParticipants([...participants, { name: trimmed, id: generateId() }])
    setNewName('')
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant()
    }
  }

  const goToGenerate = () => {
    if (participants.length < 2) {
      alert('You need at least 2 participants!')
      return
    }
    navigate({
      to: '/generate',
      search: { p: encodeParticipants(participants) },
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f3] via-[#f4e4c1]/20 to-[#d4af37]/10 -z-10" />

      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-[#8b2f2f]/5 rounded-full blur-3xl -z-10 animate-[float_20s_ease-in-out_infinite]" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-[#1a4d2e]/5 rounded-full blur-3xl -z-10 animate-[float_25s_ease-in-out_infinite]" />

      <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block mb-6 animate-[float_6s_ease-in-out_infinite]">
            <Sparkles
              className="w-16 h-16 mx-auto text-[#d4af37]"
              strokeWidth={1.5}
            />
          </div>
          <h1
            className="text-7xl md:text-8xl font-bold text-[#5a1a1a] tracking-tight leading-none"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Secret Santa
          </h1>
          <p className="text-xl text-[#5a1a1a]/70 font-light max-w-2xl mx-auto">
            Create an elegant gift exchange.{' '}
            <span className="text-[#d4af37]">No login required</span> — share
            links, spread joy.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#5a1a1a]/10 p-8 md:p-12 border border-[#d4af37]/20">
          {/* Add participant input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#5a1a1a]/70 mb-3 tracking-wide uppercase">
              Add Participants
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a name..."
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10 transition-all text-lg bg-white/50 placeholder:text-[#5a1a1a]/30"
              />
              <button
                onClick={addParticipant}
                className="px-8 py-4 bg-gradient-to-br from-[#8b2f2f] to-[#5a1a1a] text-white rounded-2xl hover:shadow-xl hover:shadow-[#5a1a1a]/30 transition-all hover:scale-105 active:scale-95 font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Participants list */}
          {participants.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#d4af37]" />
                <label className="text-sm font-medium text-[#5a1a1a]/70 tracking-wide uppercase">
                  Participants ({participants.length})
                </label>
              </div>
              <div className="space-y-3">
                {participants.map((participant, idx) => (
                  <div
                    key={participant.id}
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#faf8f3] to-white border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all hover:shadow-md animate-in fade-in slide-in-from-left-2"
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b2f2f] to-[#5a1a1a] flex items-center justify-center text-white font-semibold">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-lg text-[#5a1a1a] font-medium">
                        {participant.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#5a1a1a]/5 rounded-lg"
                    >
                      <X className="w-5 h-5 text-[#5a1a1a]/50 hover:text-[#5a1a1a]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={goToGenerate}
            disabled={participants.length < 2}
            className="w-full py-6 bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] bg-size-200 animate-[shimmer_3s_ease-in-out_infinite] text-[#5a1a1a] rounded-2xl font-bold text-xl shadow-lg shadow-[#d4af37]/30 hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            style={{
              backgroundSize: '200% 100%',
            }}
          >
            <Sparkles className="w-6 h-6" />
            Generate Secret Santa Assignments
            <Sparkles className="w-6 h-6" />
          </button>

          {participants.length < 2 && participants.length > 0 && (
            <p className="text-center text-[#5a1a1a]/50 text-sm mt-4">
              Add at least one more participant to continue
            </p>
          )}

          {participants.length === 0 && (
            <div className="text-center py-12 text-[#5a1a1a]/40">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Add participants to get started</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-[#5a1a1a]/60 text-sm">
            ✦ All data is stored in the URL — no servers, no tracking ✦
          </p>
          <p className="text-[#5a1a1a]/50 text-xs">
            Share the URL to let others add participants or generate new
            assignments
          </p>
        </div>
      </div>
    </div>
  )
}
