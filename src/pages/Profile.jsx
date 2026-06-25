// Profile.jsx - Complete Professional Rewrite
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  CameraIcon,
  BellIcon,
  StarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckSolid } from '@heroicons/react/24/solid';
import useAuthStore from '../store/authStore';
import { authService } from '../api/services/authService';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import ProfileDetails from '../components/profile/ProfileDetails';
import AddressBook from '../components/profile/AddressBook';
import toast from 'react-hot-toast';

// ── Sidebar navigation config ──────────────────────────────────────────────
const sidebarLinks = [
  { icon: UserCircleIcon,   label: 'My Profile',   path: '/profile',            exact: true },
  { icon: ShoppingBagIcon,  label: 'My Orders',    path: '/my-orders' },
  { icon: HeartIcon,        label: 'My Wishlist',  path: '/wishlist' },
  { icon: MapPinIcon,       label: 'Address Book', path: '/profile/addresses' },
  { icon: ShieldCheckIcon,  label: 'Security',     path: '/profile/security' },
];

// ── Animation variants ──────────────────────────────────────────────────────
const fadeSlideUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariant = {
  hidden:  { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ── Avatar with initials fallback ───────────────────────────────────────────
const UserAvatar = ({ user, size = 'lg', className = '' }) => {
  const sizes = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
  };

  // Derive initials safely every render from the freshest user object
  const firstName  = (user?.firstname  || user?.first_name  || '').trim();
  const lastName   = (user?.lastname   || user?.last_name   || '').trim();
  const username   = (user?.username   || user?.name        || '').trim();
  const email      = (user?.email      || '').trim();

  let initials = '';
  if (firstName && lastName) {
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    initials = firstName.charAt(0).toUpperCase();
  } else if (username) {
    const parts = username.split(' ');
    initials = parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
      : username.charAt(0).toUpperCase();
  } else if (email) {
    initials = email.charAt(0).toUpperCase();
  } else {
    initials = 'U';
  }

  if (user?.avatar || user?.profile_picture) {
    return (
      <img
        src={user.avatar || user.profile_picture}
        alt="avatar"
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  // Deterministic gradient based on initials
  const gradients = [
    'from-rose-400 to-pink-600',
    'from-violet-400 to-purple-600',
    'from-amber-400 to-orange-600',
    'from-teal-400 to-cyan-600',
    'from-blue-400 to-indigo-600',
  ];
  const gradientIndex = initials.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient}
        flex items-center justify-center font-bold text-white font-serif
        select-none ${className}`}
    >
      {initials}
    </div>
  );
};

// ── Helper: resolve display name ───────────────────────────────────────────
const resolveDisplayName = (user) => {
  const first = (user?.firstname || user?.first_name || '').trim();
  const last  = (user?.lastname  || user?.last_name  || '').trim();
  if (first || last) return `${first} ${last}`.trim();
  if (user?.username || user?.name) return (user.username || user.name).trim();
  if (user?.email) return user.email.split('@')[0];
  return 'My Account';
};

// ── Stat Badge ─────────────────────────────────────────────────────────────
const StatBadge = ({ label, value, icon: Icon, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex flex-col items-center py-3 px-2 hover:bg-white/20 rounded-xl transition-colors w-full"
  >
    <span className="text-xl font-bold text-white leading-none">{value}</span>
    <span className="text-[11px] text-white/75 mt-0.5 font-medium">{label}</span>
  </motion.button>
);

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PROFILE PAGE
// ══════════════════════════════════════════════════════════════════════════════
const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef   = useRef(null);
  const location  = useLocation();
  const navigate  = useNavigate();

  // ── fetch profile on mount ────────────────────────────────────────────────
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res  = await authService.getProfile();
      // handle multiple response shapes
      const data =
        res?.data?.user   ??
        res?.data?.data   ??
        res?.data         ??
        res?.user         ??
        res               ??
        {};
      setProfileData(data);
      updateUser(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      // fall back to whatever is in the auth store
      setProfileData(user || {});
    } finally {
      setLoading(false);
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully 👋');
    navigate('/');
  };

  // ── avatar upload (optional wiring) ──────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      // Replace with your actual upload call
      // const form = new FormData(); form.append('avatar', file);
      // await authService.uploadAvatar(form);
      toast.success('Avatar updated!');
      fetchProfile();
    } catch {
      toast.error('Upload failed, please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ── derived values ────────────────────────────────────────────────────────
  // Always prefer freshly fetched profileData, then fall back to store user
  const displayUser = { ...(user || {}), ...(profileData || {}) };
  const fullName    = resolveDisplayName(displayUser);

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-blush-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 text-xs text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-rose-500 transition-colors font-medium">
            Home
          </Link>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">My Account</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* ─────────────── SIDEBAR ─────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* ── Hero gradient header ── */}
              <div className="relative bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 p-6 pb-5 text-center overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                {/* Avatar */}
                <div className="relative inline-block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full border-4 border-white/60 mx-auto overflow-hidden shadow-lg">
                      {avatarUploading ? (
                        <div className="w-full h-full bg-white/30 flex items-center justify-center animate-pulse">
                          <CameraIcon className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <UserAvatar user={displayUser} size="lg" />
                      )}
                    </div>

                    {/* Camera button */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-white text-rose-500
                        p-1.5 rounded-full shadow-lg hover:bg-rose-50 transition-colors border border-rose-100"
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                    </motion.button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </motion.div>
                </div>

                {/* Name & email */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h3 className="text-white font-bold mt-3 text-base tracking-tight">
                    {fullName}
                  </h3>
                  <p className="text-white/75 text-xs mt-0.5 truncate px-2">
                    {displayUser.email || ''}
                  </p>
                  {displayUser.mobile && (
                    <p className="text-white/65 text-xs mt-0.5">
                      +91 {displayUser.mobile}
                    </p>
                  )}
                </motion.div>

                {/* Verified badge */}
                {displayUser.email && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm
                    px-3 py-1 rounded-full text-white text-[10px] font-semibold">
                    <ShieldCheckSolid className="w-3 h-3 text-green-300" />
                    Verified Account
                  </div>
                )}
              </div>

              {/* ── Stats Row ── */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gradient-to-r
                from-rose-500 via-pink-500 to-orange-400">
                <StatBadge label="Orders"   value={displayUser.totalOrders   ?? displayUser.orders_count   ?? 0} />
                <StatBadge label="Wishlist" value={displayUser.totalWishlist ?? displayUser.wishlist_count ?? 0} />
                <StatBadge label="Reviews"  value={displayUser.totalReviews  ?? displayUser.reviews_count  ?? 0} />
              </div>

              {/* ── Navigation Links ── */}
              <nav className="p-3">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0.5"
                >
                  {sidebarLinks.map((link) => {
                    const Icon   = link.icon;
                    const active = isActive(link.path, link.exact);
                    return (
                      <motion.div key={link.path} variants={itemVariant}>
                        <Link
                          to={link.path}
                          className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                            font-medium transition-all duration-200 ${
                            active
                              ? 'bg-rose-50 text-rose-600 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className={`p-1 rounded-lg transition-colors ${
                            active ? 'bg-rose-100' : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <Icon className={`w-4 h-4 ${active ? 'text-rose-500' : 'text-gray-500'}`} />
                          </span>
                          {link.label}
                          <ChevronRightIcon
                            className={`w-3.5 h-3.5 ml-auto transition-all duration-200 ${
                              active
                                ? 'text-rose-400 translate-x-0.5'
                                : 'text-gray-300 opacity-0 group-hover:opacity-100'
                            }`}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Logout */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                      font-medium text-red-500 hover:bg-red-50 hover:text-red-600
                      transition-all w-full group"
                  >
                    <span className="p-1 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                      <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-400" />
                    </span>
                    Sign Out
                  </motion.button>
                </div>
              </nav>
            </div>

            {/* ── Member Badge ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50
                rounded-2xl p-4 border border-amber-100/80 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👑</span>
                <span className="text-sm font-bold text-amber-700">Arkee Member</span>
                <span className="ml-auto">
                  <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enjoy exclusive discounts, early access & personalised recommendations.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] text-amber-600 font-semibold ml-1">Premium</span>
              </div>
            </motion.div>
          </motion.aside>

          {/* ─────────────── MAIN CONTENT ─────────────── */}
          <main className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  variants={fadeSlideUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <ProfileSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key={location.pathname}
                  variants={fadeSlideUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Routes>
                    <Route
                      index
                      element={
                        <ProfileDetails
                          user={displayUser}
                          onUpdate={fetchProfile}
                        />
                      }
                    />
                    <Route path="addresses" element={<AddressBook />} />
                    <Route
                      path="security"
                      element={<SecuritySection user={displayUser} />}
                    />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  SECURITY SECTION
// ══════════════════════════════════════════════════════════════════════════════
const SecuritySection = ({ user }) => {
  const navigate = useNavigate();

  const items = [
    {
      icon: '🔒',
      title: 'Change Password',
      desc: 'Keep your account secure with a strong password',
      btnLabel: 'Update',
      btnClass: 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100',
      action: () => navigate('/forgot-password'),
    },
    {
      icon: '📧',
      title: 'Email Address',
      desc: user?.email || 'Not set',
      btnLabel: user?.email ? 'Verified ✓' : 'Add Email',
      btnClass: user?.email
        ? 'text-green-600 bg-green-50 border-green-200 cursor-default'
        : 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100',
      action: null,
    },
    {
      icon: '📱',
      title: 'Mobile Number',
      desc: user?.mobile ? `+91 ${user.mobile}` : 'Not linked yet',
      btnLabel: user?.mobile ? 'Linked ✓' : 'Link Now',
      btnClass: user?.mobile
        ? 'text-green-600 bg-green-50 border-green-200 cursor-default'
        : 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100',
      action: null,
    },
    {
      icon: '🔔',
      title: 'Notifications',
      desc: 'Manage email & push notification preferences',
      btnLabel: 'Manage',
      btnClass: 'text-violet-500 bg-violet-50 border-violet-200 hover:bg-violet-100',
      action: null,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-xl">
            <ShieldCheckIcon className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl">Security Settings</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your account security and linked details
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-6 space-y-3">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariant}
              whileHover={{ scale: 1.005, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              className="flex items-center justify-between p-5 bg-gray-50
                rounded-2xl border border-gray-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.action || undefined}
                className={`text-xs font-semibold px-4 py-2 rounded-xl border
                  transition-all ${item.btnClass}`}
              >
                {item.btnLabel}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;