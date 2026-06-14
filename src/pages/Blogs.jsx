import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ArrowRightIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { miscService } from '../api/services/miscService';

const fallbackBlogs = [
  {
    _id: '1',
    title: 'How to Style Oxidised Jewellery for Every Occasion',
    excerpt: 'From casual brunches to festive weddings, learn how to incorporate oxidised pieces into your everyday wardrobe effortlessly.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
    date: '2025-06-15',
    category: 'Style Guide',
    readTime: '5 min read',
    author: 'Priya Sharma',
    authorAvatar: 'P',
    featured: true,
    tags: ['oxidised', 'styling', 'fashion'],
  },
  {
    _id: '2',
    title: 'Caring for Your Silver Jewellery: A Complete Guide',
    excerpt: 'Keep your silver pieces shining bright with these easy-to-follow care tips and maintenance routines.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop',
    date: '2025-06-10',
    category: 'Care Tips',
    readTime: '4 min read',
    author: 'Ananya Verma',
    authorAvatar: 'A',
    featured: false,
    tags: ['silver', 'care', 'maintenance'],
  },
  {
    _id: '3',
    title: 'Top Jewellery Trends for the Festive Season 2025',
    excerpt: 'Discover what\'s hot this festive season — from chunky gold to delicate layering styles.',
    image: 'https://images.unsplash.com/photo-1601821765780-754fa98637be?w=800&auto=format&fit=crop',
    date: '2025-06-05',
    category: 'Trends',
    readTime: '6 min read',
    author: 'Kavitha Nair',
    authorAvatar: 'K',
    featured: false,
    tags: ['trends', 'festive', 'gold'],
  },
  {
    _id: '4',
    title: 'The Art of Layering Necklaces: Do\'s and Don\'ts',
    excerpt: 'Mastering the art of necklace layering can transform any outfit. Here\'s your ultimate guide.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
    date: '2025-05-28',
    category: 'Style Guide',
    readTime: '7 min read',
    author: 'Meera Patel',
    authorAvatar: 'M',
    featured: false,
    tags: ['necklaces', 'layering', 'styling'],
  },
  {
    _id: '5',
    title: 'Bridal Jewellery: Choosing the Perfect Set',
    excerpt: 'Your wedding day deserves jewellery as special as the moment itself.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
    date: '2025-05-20',
    category: 'Bridal',
    readTime: '8 min read',
    author: 'Priya Sharma',
    authorAvatar: 'P',
    featured: false,
    tags: ['bridal', 'wedding', 'gold'],
  },
  {
    _id: '6',
    title: 'Understanding Jewellery Hallmarks and Certifications',
    excerpt: 'What do those tiny stamps on your jewellery mean? We break it all down.',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&auto=format&fit=crop',
    date: '2025-05-12',
    category: 'Education',
    readTime: '5 min read',
    author: 'Ananya Verma',
    authorAvatar: 'A',
    featured: false,
    tags: ['education', 'hallmarks', 'quality'],
  },
];

const categories = ['All', 'Style Guide', 'Care Tips', 'Trends', 'Bridal', 'Education'];

const BlogCard = ({ blog, featured = false }) => {
  if (featured) {
    return (
      <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 lg:grid lg:grid-cols-2">
        <div className="relative overflow-hidden aspect-video lg:aspect-auto">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FireIcon className="w-3 h-3" />
            Featured
          </span>
        </div>
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              {blog.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />{blog.readTime}
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-3">
            {blog.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags?.map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <TagIcon className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center text-white font-bold text-sm">
                {blog.authorAvatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <CalendarDaysIcon className="w-3 h-3" />
                  {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Link to="/blogs" className="flex items-center gap-1.5 text-rose-500 text-sm font-semibold hover:gap-2.5 transition-all">
              Read More <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold text-rose-500 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarDaysIcon className="w-3 h-3" />
            {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{blog.readTime}</span>
        </div>
        <h3 className="font-serif font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-rose-500 transition-colors line-clamp-2 flex-1">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {blog.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center text-white font-bold text-xs">
              {blog.authorAvatar}
            </div>
            <span className="text-xs font-medium text-gray-700">{blog.author}</span>
          </div>
          <Link to="/blogs" className="text-rose-500 text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Read <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await miscService.getBlogs();
        const list = res?.data?.blogs || res?.blogs || res?.data || [];
        if (list.length > 0) setBlogs(list);
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const filtered = blogs.filter((blog) => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = filtered.find((b) => b.featured) || filtered[0];
  const regularBlogs = filtered.filter((b) => b._id !== featuredBlog?._id);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-rose-900 to-blush-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-gold-300 font-medium text-sm uppercase tracking-widest mb-4">
            ✨ Arkee Journal
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Stories &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-rose-300">
              Inspiration
            </span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Style tips, care guides, trend reports and everything jewellery.
          </p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles, topics, tags..."
              className="w-full bg-white text-gray-800 pl-12 pr-32 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-lg"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearchQuery(''); setSearchInput(''); }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-serif font-bold text-gray-700 mb-2">No articles found</h3>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setSearchInput(''); }}
              className="btn-primary mt-4 text-sm"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {featuredBlog && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <FireIcon className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Featured Article</h2>
                </div>
                <BlogCard blog={featuredBlog} featured />
              </div>
            )}
            {regularBlogs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
                  More Articles ({regularBlogs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-br from-rose-500 via-blush-600 to-gold-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <span className="text-4xl mb-4 block">💌</span>
          <h2 className="font-display text-3xl font-bold mb-3">Never Miss a Story</h2>
          <p className="text-white/80 text-sm mb-8 max-w-md mx-auto">
            Subscribe to the Arkee Journal for weekly style tips and exclusive content.
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition-all"
            />
            <button className="bg-white text-rose-500 font-semibold px-5 py-3 rounded-xl text-sm hover:bg-rose-50 transition-colors whitespace-nowrap shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;