import { getZoneLabel } from '../utils/scoreCalculator';

const BADGE = {
  Optimal:  { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Moderate: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  Critical: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
};

const TRACK_COLOR = {
  Optimal:  '#10b981',
  Moderate: '#f59e0b',
  Critical: '#ef4444',
};

const WellnessCard = ({ label, score, icon }) => {
  const zone  = getZoneLabel(score);
  const badge = BADGE[zone] || BADGE.Moderate;
  const fill  = TRACK_COLOR[zone] || TRACK_COLOR.Moderate;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      border: '1px solid #E4E4E7',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {/* Label + icon row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <p style={{
          fontSize: 11, fontWeight: 600, color: '#a1a1aa',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          lineHeight: 1.4,
        }}>
          {label}
        </p>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#f4f4f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#a1a1aa',
          }}>
            {icon}
          </div>
        )}
      </div>

      {/* Score number */}
      <p style={{
        fontSize: 32, fontWeight: 600, color: '#18181b',
        lineHeight: 1, marginBottom: 10,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {Math.round(score)}
      </p>

      {/* Status badge */}
      <span style={{
        display: 'inline-block',
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.border}`,
        borderRadius: 999,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        alignSelf: 'flex-start',
        marginBottom: 16,
      }}>
        {zone}
      </span>

      {/* Progress track */}
      <div style={{ height: 4, background: '#f4f4f5', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.round(score)}%`,
          background: fill,
          borderRadius: 999,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
};

export default WellnessCard;
