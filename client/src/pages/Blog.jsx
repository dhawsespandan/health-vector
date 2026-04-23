import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import BlogCard from '../components/BlogCard';
import { Search, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Physical', 'Mental', 'Emotional', 'Holistic'];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    api.get(`/blog?${params.toString()}`).then((res) => {
      setPosts(res.data.posts);
      setTotal(res.data.total);
      setPages(res.data.pages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, page, search]);

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter('search', searchInput);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Wellness Knowledge Base</span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.05]">
            The Health Vector<br />
            <span className="text-zinc-400">Blog.</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Evidence-based wellness insights, Ayurvedic wisdom, and practical guides to help you live better.
          </p>
          <div className="flex justify-center">
            <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-md">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  className="mac-input pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button type="submit" className="mac-btn-primary">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20 bg-white border-y border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="flex gap-2 mb-10 flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFilter('category', cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === cat
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'
                  }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          {!loading && (
            <p className="text-sm text-zinc-400 mb-6 text-center">{total} article{total !== 1 ? 's' : ''} found</p>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner" style={{ width: 36, height: 36 }} />
            </div>
          ) : posts.length === 0 ? (
            <div className="mac-panel p-16 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight">No articles found</h3>
              <p className="text-zinc-500 text-sm mb-6">Try adjusting your search or removing filters.</p>
              <button
                onClick={() => { setSearchParams({}); setSearchInput(''); }}
                className="mac-btn-secondary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((post) => <BlogCard key={post._id} post={post} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setFilter('page', p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors border ${page === p
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                    }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
