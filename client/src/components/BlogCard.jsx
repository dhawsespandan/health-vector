import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors = {
  Physical: '#06b6d4',
  Mental: '#a78bfa',
  Emotional: '#f59e0b',
  Holistic: '#10b981',
};

const BlogCard = ({ post }) => {
  const { title, slug, category, excerpt, author, readTime, coverImage, createdAt } = post;
  const color = categoryColors[category] || '#06b6d4';

  return (
    <article className="mac-panel hover:shadow-md transition-shadow" style={{ overflow: 'hidden' }}>
      {/* Cover image */}
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        <img
          src={coverImage || `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80`}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.7), transparent)' }} />
        <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 9999, background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 17, color: '#18181b', marginBottom: 10, lineHeight: 1.4 }}>
          <Link to={`/blog/${slug}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#06b6d4'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#18181b'}>
            {title}
          </Link>
        </h3>

        {excerpt && <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{excerpt}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#475569' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {readTime || 5} min read
            </span>
            {createdAt && <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>}
          </div>
          <Link to={`/blog/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#06b6d4', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'gap 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
            onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}>
            Read More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
