import { Copy, Download, Eye, EyeOff, Share2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import type { SecretSantaMatch } from '../types/secret-santa'

interface MatchRevealProps {
  matches: Array<SecretSantaMatch>
  isRevealed: boolean
  onToggleReveal: () => void
  onShare: () => void
  onExport: () => void
}

export function MatchReveal({
  matches,
  isRevealed,
  onToggleReveal,
  onShare,
  onExport,
}: MatchRevealProps) {
  const copyToClipboard = () => {
    const text = matches
      .map(
        (match, index) =>
          `${index + 1}. ${match.giver.name} → ${isRevealed ? match.receiver.name : '???'}`,
      )
      .join('\n')

    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Secret Santa Matches
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-10 w-10 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="h-10 w-10 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-10 w-10 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={onToggleReveal}
              className="h-11 px-4"
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
          </div>
        </div>

        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-lg transition-all duration-300 ${
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
      </CardContent>
    </Card>
  )
}
