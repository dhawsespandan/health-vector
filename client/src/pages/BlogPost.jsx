import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import BlogCard from '../components/BlogCard';
import { format } from 'date-fns';
import { Clock, ArrowLeft, User } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blog/${slug}`).then((res) => {
      setPost(res.data.post);
      setRelated(res.data.related);
      setLoading(false);
      window.scrollTo(0, 0);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div className="spinner" style={{ width: 50, height: 50 }} />
    </div>
  );

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '100px 0', color: '#71717a' }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>404</p>
      <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 12 }}>Article Not Found</h2>
      <Link to="/blog" className="mac-btn-primary justify-center">Back to Blog</Link>
    </div>
  );

  const catColors = { Physical: '#06b6d4', Mental: '#a78bfa', Emotional: '#f59e0b', Holistic: '#10b981' };
  const catColor = catColors[post.category] || '#06b6d4';

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <img src={post.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80'} alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,15,30,0.4) 0%, rgba(10,15,30,0.9) 100%)' }} />
        <div className="section-container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 48 }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', fontSize: 13, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 9999, background: `${catColor}20`, border: `1px solid ${catColor}40`, color: catColor, fontSize: 11, fontWeight: 700, marginBottom: 12, fontFamily: 'Inter' }}>
            {post.category}
          </span>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 36px)', color: 'white', lineHeight: 1.3, maxWidth: 800, marginBottom: 16 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={13} /> {post.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {post.readTime || 5} min read</span>
            {post.createdAt && <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, marginTop: 48 }}>
          <div>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>').replace(/#{3} (.*)/g, '<h3>$1</h3>').replace(/#{2} (.*)/g, '<h2>$1</h2>').replace(/#{1} (.*)/g, '<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

            {/* CTA */}
            <div style={{ marginTop: 48, padding: 32, background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(167,139,250,0.08))', borderRadius: 16, border: '1px solid rgba(6,182,212,0.15)', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 12 }}>
                Discover Your Wellness Score
              </h3>
              <p style={{ color: '#71717a', marginBottom: 24, fontSize: 14 }}>Take a free 8-minute assessment and get your personalised Wellness Index with actionable recommendations.</p>
              <Link to="/assessment" className="mac-btn-primary justify-center">Take Free Assessment</Link>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="mac-panel" style={{ padding: 24, position: 'sticky', top: 88 }}>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#18181b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Related Articles</h3>
              {related.length > 0 ? (
                related.map((r) => (
                  <Link key={r._id} to={`/blog/${r.slug}`} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}>
                    <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, lineHeight: 1.4, transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#06b6d4'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                      {r.title}
                    </p>
                    <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{r.readTime || 5} min read</p>
                  </Link>
                ))
              ) : (
                <p style={{ fontSize: 13, color: '#71717a' }}>No related articles</p>
              )}

              <div style={{ marginTop: 24, padding: 20, background: 'rgba(6,182,212,0.05)', borderRadius: 10, border: '1px solid rgba(6,182,212,0.1)' }}>
                <h4 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#18181b', marginBottom: 8 }}>Free Assessment</h4>
                <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12, lineHeight: 1.6 }}>Understand your unique wellness profile with our 35-question assessment.</p>
                <Link to="/assessment" className="mac-btn-primary justify-center" style={{ fontSize: 12, padding: '8px 16px', justifyContent: 'center', width: '100%' }}>
                  Start Free →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 24 }}>More {post.category} Articles</h2>
            <div className="card-grid-3">
              {related.map((r) => <BlogCard key={r._id} post={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
