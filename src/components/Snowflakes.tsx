import { useEffect, useState } from 'react'

const snowflakeChars = ['❄', '❅', '❆', '✦', '✧', '◆']

export function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<
    Array<{
      id: number
      char: string
      left: number
      duration: number
      delay: number
      size: number
    }>
  >([])

  useEffect(() => {
    const flakes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
      left: Math.random() * 100,
      duration: 15 + Math.random() * 15,
      delay: Math.random() * 10,
      size: 0.5 + Math.random() * 1,
    }))
    setSnowflakes(flakes)
  }, [])

  return (
    <>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}em`,
            opacity: flake.size / 1.5,
          }}
        >
          {flake.char}
        </div>
      ))}
    </>
  )
}
