const typeColors = {
  Exercise: '#06b6d4',
  Diet: '#10b981',
  Lifestyle: '#a78bfa',
  Mindfulness: '#f59e0b',
};

const basisColors = {
  'Evidence-based': '#22d3ee',
  Ayurvedic: '#fbbf24',
};

const RecommendationCard = ({ rec }) => {
  const {
    title, description, timeRequired, difficulty, type, basis, tags, isFocusArea, dimension,
  } = rec;

  const typeColor = typeColors[type] || '#71717a';
  const dimLabel = dimension ? dimension.charAt(0).toUpperCase() + dimension.slice(1) : '';

  return (
    <div className="mac-panel hover:shadow-md transition-shadow" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      {isFocusArea && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #f59e0b, #f97316)', padding: '4px 12px', borderRadius: '0 16px 0 12px', fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'Inter' }}>
          FOCUS AREA
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: '#18181b', lineHeight: 1.3 }}>{title}</h3>
        <div style={{ padding: '3px 10px', borderRadius: 9999, background: `${typeColor}18`, border: `1px solid ${typeColor}30`, color: typeColor, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {type}
        </div>
      </div>

      <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <span style={{ padding: '4px 10px', borderRadius: 9999, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', fontSize: 12, color: '#94a3b8' }}>
          ⏱ {timeRequired}
        </span>
        <span style={{ padding: '4px 10px', borderRadius: 9999, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', fontSize: 12, color: '#94a3b8' }}>
          {difficulty === 'Easy' ? '' : ''} {difficulty}
        </span>
        {basis && (
          <span style={{ padding: '4px 10px', borderRadius: 9999, background: `${basisColors[basis] || '#71717a'}15`, border: `1px solid ${basisColors[basis] || '#71717a'}30`, fontSize: 12, color: basisColors[basis] || '#94a3b8' }}>
            {basis === 'Ayurvedic' ? '' : ''} {basis}
          </span>
        )}
      </div>

      {tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((tag) => (
            <span key={tag} style={{ fontSize: 11, color: '#475569', background: 'rgba(0,0,0,0.03)', padding: '2px 8px', borderRadius: 4 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
