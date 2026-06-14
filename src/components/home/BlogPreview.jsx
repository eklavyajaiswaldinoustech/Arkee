import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { miscService } from '../../api/services/miscService';

const fallbackBlogs = [
  { _id: '1', title: 'How to Style Oxidised Jewellery for Every Occasion', excerpt: 'From casual brunches to festive weddings, learn how to incorporate oxidised pieces into your everyday wardrobe.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop', date: '2025-06-15', category: 'Style Guide', readTime: '5 min read' },
  { _id: '2', title: 'Caring for Your Silver Jewellery: A Complete Guide', excerpt: 'Keep your silver pieces shining bright with these easy-to-follow care tips and maintenance routines.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop', date: '2025-06-10', category: 'Care Tips', readTime: '4 min read' },
  { _id: '3', title: 'Top Jewellery Trends for the Festive Season 2025', excerpt: 'Discover what\'s hot this festive season — from chunky gold to delicate layering styles.', image: 'https://images.unsplash.com/photo-1601821765780-754fa98637be?w=600&auto=format&fit=crop', date: '2025-06-05', category: 'Trends', readTime: '6 min read' },
];

const BlogPreview = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await miscService.getBlogs();
        const list = res?.data?.blogs || res?.blogs || res?.data || [];
        if (list.length > 0) setBlogs(list.slice(0, 3));
      } catch {
        // use fallback
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-rose-400 font-medium text-sm uppercase tracking-widest">Inspiration</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              From Our <span className="text-rose-500">Blog</span>
            </h2>
          </div>
          <Link to="/blogs" className="text-rose-500 text-sm font-semibold hover:text-rose-600 flex items-center gap-1.5">
            View All Articles <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <Link
              key={blog._id || i}
              to="/blogs"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.image || 'https://placehold.co/600x400/fce7f3/be185d?text=Arkee'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-400">{blog.readTime}</span>
                </div>
                <h3 className="font-serif font-semibold text-gray-800 text-base leading-snug mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CalendarDaysIcon className="w-3.5 h-3.5" />
                    {blog.date ? new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Jun 2025'}
                  </div>
                  <span className="text-rose-500 text-xs font-medium flex items-center gap-1">
                    Read More <ArrowRightIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;