import { useMemo } from 'react'

function generateJaggedPath(width, segments, variance) {
  const segW = width / segments
  let d = `M0,${30 + Math.random() * variance}`
  for (let i = 1; i <= segments; i++) {
    const x = i * segW
    const y = 25 + Math.random() * (variance + 15)
    const cp1x = x - segW * 0.6
    const cp1y = 18 + Math.random() * (variance + 20)
    const cp2x = x - segW * 0.25
    const cp2y = 20 + Math.random() * (variance + 18)
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`
  }
  d += ` L${width},90 L0,90 Z`
  return d
}

// upperColor = the section above (the paper being torn)
// lowerColor = the section below (what's revealed underneath)
export default function TornEdge({ upperColor = '#faf7f2', lowerColor = '#f0ece6' }) {
  const pathMain = useMemo(() => generateJaggedPath(1600, 20, 25), [])
  const pathShadow1 = useMemo(() => generateJaggedPath(1600, 16, 30), [])
  const pathShadow2 = useMemo(() => generateJaggedPath(1600, 24, 20), [])

  return (
    <div className="relative w-full overflow-hidden leading-[0]" style={{ marginTop: -1 }}>
      {/* Lower section background fills the space below the tear */}
      <div style={{ background: lowerColor }}>
        <svg
          viewBox="0 0 1600 90"
          preserveAspectRatio="none"
          className="w-full h-[40px] md:h-[60px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow layer 2 — deepest, darkest */}
          <path d={pathShadow2} fill={lowerColor} opacity="1" />
          <path
            d={pathShadow2}
            fill="rgba(0,0,0,0.06)"
            transform="translate(0, 3)"
          />
          {/* Shadow layer 1 — mid shadow */}
          <path d={pathShadow1} fill={lowerColor} opacity="1" transform="translate(0, 0)" />
          <path
            d={pathShadow1}
            fill="rgba(0,0,0,0.04)"
            transform="translate(0, 1.5)"
          />
          {/* Main torn paper edge — upper section color */}
          <path d={pathMain} fill={upperColor} />
          {/* Paper fiber edge */}
          <path
            d={pathMain}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.8"
          />
          {/* Highlight on torn edge for 3D depth */}
          <path
            d={pathMain}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.6"
            transform="translate(0, -0.5)"
          />
        </svg>
      </div>
    </div>
  )
}
