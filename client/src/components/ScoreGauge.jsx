import { getZoneColor, getZoneLabel } from '../utils/scoreCalculator';

const VW = 220;
const VH = 150;
const CX = VW / 2;   // 110
const CY = 108;      // arc centre — keeps /100 and zone label within VH

const ScoreGauge = ({ score = 0, size = 180, showLabel = false }) => {
  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const dashArray = (progress / 100) * circumference;
  const color = getZoneColor(score);
  const zone  = getZoneLabel(score);

  const renderedHeight = size * (VH / VW);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size}
        height={renderedHeight}
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Background arc — very light grey track */}
        <path
          d={`M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`}
          fill="none"
          stroke="#E4E4E7"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Progress arc — clean, no glow */}
        <path
          d={`M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />

        {/* Score — zinc-900, clean typography */}
        <text
          x={CX} y={CY - 16}
          textAnchor="middle"
          fill="#18181b"
          fontSize="48"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {Math.round(progress)}
        </text>

        {/* /100 */}
        <text
          x={CX} y={CY + 10}
          textAnchor="middle"
          fill="#a1a1aa"
          fontSize="12"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>

        {/* Zone label */}
        <text
          x={CX} y={CY + 28}
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {zone}
        </text>
      </svg>

      {showLabel && (
        <p style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>
          Wellness Index
        </p>
      )}
    </div>
  );
};

export default ScoreGauge;
