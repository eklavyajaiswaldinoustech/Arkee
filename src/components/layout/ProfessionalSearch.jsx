import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProfessionalSearch = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingproduct, setTrendingproduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved.slice(0, 5));
  }, []);

  // Mock trending product - replace with API call
  useEffect(() => {
    const mockTrending = [
      {
            "_id": "6a192126f86de64345dc942d",
            "name": "Bind in gold",
            "slug": "htyhyth",
            "description": "<p>Like two waves meeting as one, these zircon-studded couple rings celebrate a love that flows endlessly. Gift a promise that shines through every tide.</p>\r\n\r\n<ul>\r\n\t<li>925 Silver with Gold Plating</li>\r\n\t<li>Perfect for sensitive skin</li>\r\n\t<li>Male Ring Diameter: 1.88 cm</li>\r\n\t<li>Ring size: Indian - 19</li>\r\n\t<li>Female Ring Diameter: 1.66 cm</li>\r\n\t<li>Ring size: Indian - 12</li>\r\n\t<li>Fixed Size</li>\r\n\t<li>Comes with the GIVA Jewellery kit and authenticity certificate</li>\r\n\t<li>Content: Rings</li>\r\n\t<li>Net Qty - 2&nbsp;Pair</li>\r\n</ul>\r\n",
            "images": [
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1780031782265-qg0lv4vo5q.jpeg",
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1780031782278-7l331ksg1nu.jpeg",
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1780031782315-ok34xc4k3ga.jpeg"
            ],
            "category": "antic",
            "subcategory": "traditional",
            "type": "silver",
            "gender": "Unisex",
            "stock": 7,
            "lowStockThreshold": 5,
            "price": 7000,
            "discountPrice": 0,
            "making_cost": 0,
            "gst_percentage": 5,
            "metal_type": "",
            "karat": 0,
            "gold_weight": 0,
            "gold_cost_per_gram": 0,
            "gold_cost": 0,
            "total_number_of_gem": 0,
            "diamond_quality": [],
            "height": 0,
            "width": 0,
            "Weight": "",
            "warranty_description": "GHNHNHJNHJ",
            "certificate_type": "YUYUU",
            "isActive": true,
            "isFeatured": false,
            "isDeleted": false,
            "createdAt": "2026-05-29T05:16:23.023Z",
            "updatedAt": "2026-06-16T07:23:03.483Z",
            "bestSellerSince": "2026-06-01T00:00:00.000Z",
            "isBestSeller": true,
            "isNewLaunch": false,
            "newLaunchExpiresAt": null,
            "occasion": [],
            "image": []
        },
        {
            "_id": "6a2bc0f7b2c7d6e4706fdb3f",
            "name": "Payal",
            "slug": "payal",
            "description": "<p>Enhance your traditional charm with this beautifully crafted Payal, designed to add elegance and grace to every step. Featuring intricate craftsmanship and a timeless design, this anklet complements both ethnic and contemporary outfits. Lightweight and comfortable to wear, it is perfect for daily use, festive occasions, weddings, and special celebrations. A symbol of beauty and tradition, this Payal makes a wonderful addition to your jewelry collection or a thoughtful gift for someone special.</p>\r\n",
            "images": [
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1781252343237-lfspnmwy98f.png"
            ],
            "category": "antic",
            "subcategory": "traditional",
            "type": "silver",
            "occasion": [
                "Traditional"
            ],
            "gender": "Female",
            "stock": 10,
            "lowStockThreshold": 5,
            "price": 12000,
            "discountPrice": 11599,
            "making_cost": 0,
            "gst_percentage": 6,
            "karat": 0,
            "gold_weight": 0,
            "gold_cost_per_gram": 0,
            "gold_cost": 0,
            "total_number_of_gem": 0,
            "diamond_quality": [],
            "height": 0,
            "width": 0,
            "warranty_description": "6 Month color faded",
            "certificate_type": "no",
            "isActive": true,
            "isFeatured": false,
            "isDeleted": false,
            "createdAt": "2026-06-12T08:19:03.707Z",
            "updatedAt": "2026-06-12T08:19:03.707Z",
            "image": []
        },
        {
            "_id": "6a30e2aa8222f5773b53ad73",
            "name": "wdqwqdq",
            "slug": "wdqwqdq",
            "description": "<p>drstsrstst ugxisax sxusaxisax cgadcahasxiusxsaiux</p>\r\n",
            "images": [
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1781588649699-dt6nawpmie.png",
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1781588649710-y63xfrs364.png",
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1781588649752-3y3zu5o4hmz.png",
                "https://riyaasa-images.s3.ap-south-1.amazonaws.com/uploads/1781588649759-fd87ddv12j.png"
            ],
            "category": "earrings",
            "subcategory": "gold",
            "type": "plastic",
            "occasion": [
                "Engagement",
                "Gift",
                "Traditional"
            ],
            "gender": "Female",
            "stock": 10,
            "lowStockThreshold": 5,
            "price": 10000,
            "discountPrice": 9000,
            "making_cost": 0,
            "gst_percentage": 1,
            "karat": 0,
            "gold_weight": 0,
            "gold_cost_per_gram": 0,
            "gold_cost": 0,
            "total_number_of_gem": 0,
            "diamond_quality": [],
            "height": 0,
            "width": 0,
            "warranty_description": "cewd",
            "certificate_type": "ewfcew",
            "isActive": true,
            "isFeatured": false,
            "isDeleted": false,
            "isNewLaunch": true,
            "newLaunchExpiresAt": "2026-07-08T00:00:00.000Z",
            "createdAt": "2026-06-16T05:44:10.336Z",
            "updatedAt": "2026-06-16T05:44:10.336Z",
            "image": []
        }
    ];
    setTrendingproduct(mockTrending);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      // Mock suggestions - replace with your API call
      const mockSuggestions = [
        `${searchQuery} rings`,
        `${searchQuery} earrings`,
        `${searchQuery} necklace`,
        `${searchQuery} bracelet`,
        `${searchQuery} pendant`,
      ].filter((s) => !recentSearches.includes(s));

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm = query) => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    // Save to recent searches
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    onSearch?.(searchTerm);
    navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
    onClose?.();
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
      setQuery('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSearch(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
        <div className="max-w-4xl mx-auto mt-24 mx-4">
          {/* Search Input Container */}
          <div
            ref={searchRef}
            className="relative bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Search Header */}
            <div className="relative flex items-center gap-3 px-6 py-4 border-b border-amber-50">
              {/* Icon */}
              <MagnifyingGlassIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />

              {/* Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search rings, earrings, necklaces…"
                className="flex-1 bg-transparent text-xl font-light text-gray-900 placeholder-gray-400 outline-none"
                autoFocus
              />

              {/* Clear Button */}
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    setActiveIndex(-1);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Suggestions Panel */}
            {(suggestions.length > 0 ||
              recentSearches.length > 0 ||
              trendingproduct.length > 0) && (
              <div className="bg-white max-h-[70vh] overflow-y-auto">
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="border-b border-amber-50">
                    <p className="text-xs uppercase tracking-widest font-semibold text-amber-700 px-6 pt-4 pb-3">
                      Search Suggestions
                    </p>
                    <ul className="pb-4">
                      {suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleSearch(suggestion)}
                          className={`px-6 py-3 cursor-pointer transition-all duration-150 flex items-center gap-3 group ${
                            activeIndex === idx
                              ? 'bg-amber-50 border-l-2 border-amber-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                          <span className="text-sm text-gray-700 group-hover:text-amber-900">
                            {suggestion}
                          </span>
                          <ArrowRightIcon className="w-4 h-4 text-gray-300 ml-auto group-hover:text-amber-600 transition-colors transform group-hover:translate-x-1" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && suggestions.length === 0 && (
                  <div className="border-b border-amber-50">
                    <p className="text-xs uppercase tracking-widest font-semibold text-amber-700 px-6 pt-4 pb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2 px-6 pb-4">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearch(search)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-amber-100 text-sm text-gray-700 hover:text-amber-900 rounded-full transition-colors duration-150 font-medium"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending product */}
                {trendingproduct.length > 0 && suggestions.length === 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-amber-700 px-6 pt-4 pb-3 flex items-center gap-2">
                      <FireIcon className="w-4 h-4" />
                      Trending Now
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-6 pb-6">
                      {trendingproduct.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => {
                            navigate(`/product/${product._id}`);
                            onClose?.();
                          }}
                          className="text-left group"
                        >
                          <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-3 aspect-square group-hover:shadow-lg transition-shadow">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{product.price?.toLocaleString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State with Quick Links */}
            {!loading && suggestions.length === 0 && (
              <div className="px-6 py-12 text-center">
                <SparklesIcon className="w-8 h-8 text-amber-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-6">
                  {query
                    ? 'No results found'
                    : 'Start typing to search or choose from below'}
                </p>

                {/* Quick Category Links */}
                {!query && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Rings', emoji: '💍' },
                      { label: 'Earrings', emoji: '✨' },
                      { label: 'Necklaces', emoji: '👑' },
                      { label: 'Bracelets', emoji: '✨' },
                    ].map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => {
                          navigate(`/product?category=${cat.label.toLowerCase()}`);
                          onClose?.();
                        }}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-xs font-medium text-amber-900 rounded-lg transition-colors"
                      >
                        <span className="mr-1">{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer Helper Text */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
              <span>Type to search • Use arrow keys to navigate</span>
              <kbd className="bg-white border border-gray-200 rounded px-2 py-1 font-mono text-gray-600">
                ESC
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default ProfessionalSearch;