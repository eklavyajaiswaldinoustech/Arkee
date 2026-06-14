import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems: cartItems } = useCartStore();
  const { totalItems: wishlistItems } = useWishlistStore();

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/products' },
    { label: 'Collections', path: '/products?type=collection' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Offers', path: '/offers' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-500 via-blush-500 to-gold-400 text-white text-center py-2 text-sm font-medium tracking-wide">
        ✨ Free shipping on orders above ₹999 · Use code{' '}
        <span className="font-bold">ARKEE10</span> for 10% off ✨
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-gold-400 flex items-center justify-center shadow-md group-hover:shadow-rose-200 transition-shadow">
                <span className="text-white font-serif font-bold text-lg">A</span>
              </div>
              <div>
                <span className="text-2xl font-display font-bold tracking-wider text-gray-800">
                  Ark<span className="text-rose-500">ee</span>
                </span>
                <p className="text-xs text-gray-400 font-medium tracking-widest -mt-1 hidden sm:block">
                  FINE JEWELLERY
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-500"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-500"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-rose-50 transition-colors text-gray-600 hover:text-rose-500"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {cartItems}
                  </span>
                )}
              </Link>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDownIcon
                      className={`w-3 h-3 text-gray-500 transition-transform hidden md:block ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-down z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.firstname} {user?.lastname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      {[
                        { label: 'My Profile', path: '/profile' },
                        { label: 'My Orders', path: '/my-orders' },
                        { label: 'Wishlist', path: '/wishlist' },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
                >
                  <UserIcon className="w-4 h-4" />
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 animate-slide-down">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jewellery, earrings, necklaces..."
                  className="input-field pr-12"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center btn-primary justify-center py-2.5 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center btn-secondary justify-center py-2.5 text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;