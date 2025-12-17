import { createFileRoute, useSearch } from '@tanstack/react-router'
import {
  useEffect,
  useState,
  useCallback,
  useTransition,
  Suspense,
} from 'react'
import {
  Download,
  Eye,
  EyeOff,
  Gift,
  Plus,
  Share2,
  Shuffle,
  Trash2,
  Users,
} from 'lucide-react'
import {
  decodeMatches,
  decodeParticipants,
  encodeMatches,
  encodeParticipants,
  generateId,
  generateSecretSantaMatches,
  validateEmail,
  validateParticipant,
} from '../lib/secret-santa'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import type {
  Participant,
  SecretSantaMatch,
  SecretSantaUrlState,
} from '../types/secret-santa'

export const Route = createFileRoute('/')({
  component: SecretSantaApp,
  validateSearch: (search: Record<string, unknown>): SecretSantaUrlState => {
    return {
      p: typeof search.p === 'string' ? search.p : undefined,
      m: typeof search.m === 'string' ? search.m : undefined,
      r: typeof search.r === 'string' ? search.r : undefined,
      v: typeof search.v === 'string' ? search.v : undefined,
    }
  },
})

function SecretSantaApp() {
  const search = useSearch({ from: '/' })
  const [, startTransition] = useTransition()
  const [participants, setParticipants] = useState<Array<Participant>>([])
  const [matches, setMatches] = useState<Array<SecretSantaMatch>>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [currentView, setCurrentView] = useState<
    'setup' | 'matches' | 'reveal'
  >('setup')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  const decodeUrlData = useCallback(async () => {
    const updates: {
      participants?: Array<Participant>
      matches?: Array<SecretSantaMatch>
      isRevealed?: boolean
      currentView?: 'setup' | 'matches' | 'reveal'
    } = {}

    if (search.p) {
      try {
        // Use requestIdleCallback for non-blocking decoding
        const decodedParticipants = await new Promise<Array<Participant>>(
          (resolve) => {
            const decode = () => {
              try {
                const result = decodeParticipants(search.p!)
                resolve(result)
              } catch {
                resolve([])
              }
            }

            if (window.requestIdleCallback) {
              window.requestIdleCallback(decode)
            } else {
              setTimeout(decode, 0)
            }
          },
        )
        updates.participants = decodedParticipants
      } catch (error) {
        console.error('Failed to decode participants from URL:', error)
      }
    }

    if (search.m) {
      try {
        const decodedMatches = await new Promise<Array<SecretSantaMatch>>(
          (resolve) => {
            const decode = () => {
              try {
                const result = decodeMatches(search.m!)
                resolve(result)
              } catch {
                resolve([])
              }
            }

            if (window.requestIdleCallback) {
              window.requestIdleCallback(decode)
            } else {
              setTimeout(decode, 0)
            }
          },
        )
        updates.matches = decodedMatches
        updates.currentView = 'matches'
      } catch (error) {
        console.error('Failed to decode matches from URL:', error)
      }
    }

    if (search.r) {
      updates.isRevealed = search.r === 'true'
    }

    if (search.v) {
      updates.currentView = search.v as 'setup' | 'matches' | 'reveal'
    }

    startTransition(() => {
      if (updates.participants !== undefined) {
        setParticipants(updates.participants)
      }
      if (updates.matches !== undefined) {
        setMatches(updates.matches)
      }
      if (updates.isRevealed !== undefined) {
        setIsRevealed(updates.isRevealed)
      }
      if (updates.currentView !== undefined) {
        setCurrentView(updates.currentView)
      }
      setIsInitialized(true)
    })
  }, [search.p, search.m, search.r, search.v])

  useEffect(() => {
    decodeUrlData()
  }, [decodeUrlData])

  const updateURL = useCallback(
    (
      newParticipants: Array<Participant>,
      newMatches: Array<SecretSantaMatch>,
      newIsRevealed: boolean,
      newCurrentView: 'setup' | 'matches' | 'reveal',
    ) => {
      const searchParams: SecretSantaUrlState = {}

      if (newParticipants.length > 0) {
        searchParams.p = encodeParticipants(newParticipants)
      }

      if (newMatches.length > 0) {
        searchParams.m = encodeMatches(newMatches)
      }

      if (newIsRevealed) {
        searchParams.r = 'true'
      }

      if (newCurrentView !== 'setup') {
        searchParams.v = newCurrentView
      }

      // Use requestAnimationFrame to prevent blocking
      requestAnimationFrame(() => {
        window.history.pushState(
          {},
          '',
          `/?${new URLSearchParams(searchParams as any).toString()}`,
        )
      })
    },
    [],
  )

  const addParticipant = useCallback(() => {
    const nameValidationError = validateParticipant(newName)
    if (nameValidationError) {
      setNameError(nameValidationError)
      return
    }

    const emailValidationError = validateEmail(newEmail)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    const participant: Participant = {
      id: generateId(),
      name: newName.trim(),
      email: newEmail.trim() || undefined,
    }

    const newParticipants = [...participants, participant]
    setParticipants(newParticipants)
    setNewName('')
    setNewEmail('')
    setNameError('')
    setEmailError('')
    updateURL(newParticipants, matches, isRevealed, currentView)
  }, [
    newName,
    newEmail,
    participants,
    matches,
    isRevealed,
    currentView,
    updateURL,
  ])

  const removeParticipant = (id: string) => {
    const newParticipants = participants.filter((p) => p.id !== id)
    setParticipants(newParticipants)
    if (matches.length > 0) {
      setMatches([])
      setCurrentView('setup')
      setIsRevealed(false)
      updateURL(newParticipants, [], false, 'setup')
    } else {
      updateURL(newParticipants, matches, isRevealed, currentView)
    }
  }

  const generateMatches = useCallback(() => {
    if (participants.length < 2) {
      alert('You need at least 2 participants to generate matches!')
      return
    }

    startTransition(() => {
      try {
        const newMatches = generateSecretSantaMatches(participants)
        setMatches(newMatches)
        setCurrentView('matches')
        setIsRevealed(false)
        updateURL(participants, newMatches, false, 'matches')
      } catch (error) {
        alert(
          error instanceof Error ? error.message : 'Failed to generate matches',
        )
      }
    })
  }, [participants, updateURL])

  const toggleReveal = () => {
    const newRevealed = !isRevealed
    setIsRevealed(newRevealed)
    const newView = newRevealed ? 'reveal' : 'matches'
    setCurrentView(newView)
    updateURL(participants, matches, newRevealed, newView)
  }

  const shareMatches = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  const exportMatches = () => {
    const text = matches
      .map(
        (match, index) =>
          `${index + 1}. ${match.giver.name} → ${match.receiver.name}`,
      )
      .join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'secret-santa-matches.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    setParticipants([])
    setMatches([])
    setIsRevealed(false)
    setCurrentView('setup')
    window.history.pushState({}, '', '/')
  }

  // Show loading state while initializing - AFTER all hooks
  if (!isInitialized) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Secret Santa...</p>
          </div>
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <Gift className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-600" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Secret Santa
              </h1>
              <Gift className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600" />
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Organize your Secret Santa gift exchange
            </p>
          </div>

          {currentView === 'setup' && (
            <div className="space-y-6 sm:space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                    Add Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="Name"
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value)
                          setNameError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                        className="h-11 sm:h-12 text-base"
                      />
                      {nameError && (
                        <p className="text-red-500 text-sm mt-2">{nameError}</p>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="Email (optional)"
                        value={newEmail}
                        onChange={(e) => {
                          setNewEmail(e.target.value)
                          setEmailError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                        className="h-11 sm:h-12 text-base"
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-2">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={addParticipant}
                      disabled={!newName.trim()}
                      size="default"
                      className="w-full sm:w-auto h-11 sm:h-12 px-6"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {participants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">
                      Participants ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="font-medium text-base sm:text-lg truncate">
                              {participant.name}
                            </span>
                            {participant.email && (
                              <span className="text-gray-500 text-sm sm:text-base truncate">
                                ({participant.email})
                              </span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => removeParticipant(participant.id)}
                            className="flex-shrink-0 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={generateMatches}
                        disabled={participants.length < 2}
                        size="lg"
                        className="flex-1 w-full !text-base sm:!text-lg !font-semibold min-h-[3rem] sm:min-h-[3.5rem]"
                      >
                        <Shuffle className="h-5 w-5 mr-2 sm:mr-3" />
                        <span className="truncate">Generate Matches</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger className="flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-14 px-6 rounded-md border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap">
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Reset</span>
                          <span className="sm:hidden">Reset</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reset Everything?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove all participants and any
                              generated matches. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={resetAll}>
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {(currentView === 'matches' || currentView === 'reveal') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-xl sm:text-2xl">
                    Secret Santa Matches
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareMatches}
                      className="h-10 w-10 p-0"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportMatches}
                      className="h-10 w-10 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={toggleReveal}
                      className="flex-1 sm:flex-none h-11 px-4"
                    >
                      {isRevealed ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline ml-2">
                        {isRevealed ? 'Hide' : 'Reveal'}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        setCurrentView('setup')
                        updateURL(participants, matches, isRevealed, 'setup')
                      }}
                      className="flex-1 sm:flex-none h-11 px-4"
                    >
                      Back to Setup
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-lg transition-all duration-300 ${
                        isRevealed
                          ? 'bg-gradient-to-r from-green-50 to-red-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
                        <Badge
                          variant={isRevealed ? 'default' : 'secondary'}
                          className={
                            isRevealed
                              ? 'bg-gradient-to-r from-green-500 to-red-500 text-sm px-3 py-1'
                              : 'text-sm px-3 py-1'
                          }
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{match.giver.name}</span>
                        <span className="text-gray-500 text-lg">→</span>
                        {isRevealed ? (
                          <span className="font-medium text-green-600 animate-pulse">
                            {match.receiver.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic animate-pulse text-sm">
                            🎁 Secret 🎁
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="flex gap-3">
                  <Button
                    onClick={generateMatches}
                    variant="outline"
                    className="flex-1 sm:flex-none h-11 px-4"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Suspense>
  )
}
