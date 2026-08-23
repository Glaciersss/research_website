export default function SectionDivider({ position = 'bottom', variant = 'wave', color = '#F7F6F3' }) {
  const isTop = position === 'top'

  const wavePath = isTop
    ? 'M0,40 C150,0 250,40 400,20 C550,0 650,40 800,20 C950,0 1050,40 1200,20 C1350,0 1450,40 1600,20 L1600,0 L0,0 Z'
    : 'M0,0 C150,20 250,0 400,20 C550,40 650,0 800,20 C950,40 1050,0 1200,20 C1350,40 1450,0 1600,20 L1600,40 L0,40 Z'

  const curvePath = isTop
    ? 'M0,40 Q800,-60 1600,40 L1600,0 L0,0 Z'
    : 'M0,0 Q800,100 1600,0 L1600,40 L0,40 Z'

  return (
    <div className={`w-full ${isTop ? '-mt-[1px]' : '-mb-[1px]'} leading-[0] overflow-hidden`}
      style={{ transform: isTop ? 'rotate(180deg)' : 'none' }}>
      <svg
        viewBox="0 0 1600 40"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={variant === 'curve' ? curvePath : wavePath} fill={color} />
      </svg>
    </div>
  )
}
