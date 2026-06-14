import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  CameraIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import { authService } from '../api/services/authService';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import ProfileDetails from '../components/profile/ProfileDetails';
import AddressBook from '../components/profile/AddressBook';
import toast from 'react-hot-toast';

const sidebarLinks = [
  {
    icon: UserCircleIcon,
    label: 'My Profile',
    path: '/profile',
    exact: true,
  },
  {
    icon: ShoppingBagIcon,
    label: 'My Orders',
    path: '/my-orders',
  },
  {
    icon: HeartIcon,
    label: 'My Wishlist',
    path: '/wishlist',
  },
  {
    icon: MapPinIcon,
    label: 'Address Book',
    path: '/profile/addresses',
  },
  {
    icon: ShieldCheckIcon,
    label: 'Security',
    path: '/profile/security',
  },
];

const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authService.getProfile();
      const data = res?.data?.user || res?.user || res?.data || {};
      setProfileData(data);
      updateUser(data);
    } catch {
      setProfileData(user || {});
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const displayUser = profileData || user || {};
  const fullName =
    `${displayUser.firstname || ''} ${displayUser.lastname || ''}`.trim() ||
    'My Account';
  const initials =
    `${displayUser.firstname?.charAt(0) || ''}${
      displayUser.lastname?.charAt(0) || ''
    }`.toUpperCase() || 'U';

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-rose-500 transition-colors">
            Home
          </Link>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-gray-800 font-medium">My Account</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Avatar Header */}
              <div className="bg-gradient-to-br from-rose-400 via-blush-500 to-gold-400 p-6 text-center relative">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl font-serif border-4 border-white/50 mx-auto">
                    {displayUser.avatar ? (
                      <img
                        src={displayUser.avatar}
                        alt={fullName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white text-rose-500 p-1.5 rounded-full shadow-md hover:bg-rose-50 transition-colors">
                    <CameraIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mt-3 text-base">
                  {fullName}
                </h3>
                <p className="text-white/80 text-xs mt-0.5 truncate px-2">
                  {displayUser.email || ''}
                </p>
                {displayUser.mobile && (
                  <p className="text-white/70 text-xs mt-0.5">
                    +91 {displayUser.mobile}
                  </p>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
                  { label: 'Orders', value: displayUser.totalOrders || 0 },
                  {
                    label: 'Wishlist',
                    value: displayUser.totalWishlist || 0,
                  },
                  { label: 'Reviews', value: displayUser.totalReviews || 0 },
                ].map((stat) => (
                  <div key={stat.label} className="text-center py-3 px-2">
                    <p className="text-lg font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Navigation Links */}
              <nav className="p-3">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path, link.exact);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                        active
                          ? 'bg-rose-50 text-rose-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-rose-500' : 'text-gray-400'
                        }`}
                      />
                      {link.label}
                      <ChevronRightIcon
                        className={`w-3.5 h-3.5 ml-auto transition-opacity ${
                          active
                            ? 'text-rose-400 opacity-100'
                            : 'text-gray-300 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </Link>
                  );
                })}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full mt-2 border-t border-gray-100 pt-4"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>

            {/* Member Badge */}
            <div className="mt-4 bg-gradient-to-br from-gold-50 to-rose-50 rounded-2xl p-4 border border-gold-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👑</span>
                <span className="text-sm font-semibold text-gold-700">
                  Arkee Member
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enjoy exclusive discounts, early access and personalised recommendations.
              </p>
            </div>
          </aside>

          {/* ── Main Content Area ── */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <ProfileSkeleton />
              </div>
            ) : (
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
                <Route
                  path="addresses"
                  element={<AddressBook />}
                />
                <Route
                  path="security"
                  element={<SecuritySection user={displayUser} />}
                />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ── Security Section ── */
const SecuritySection = ({ user }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
    <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">
      Security Settings
    </h2>
    <div className="space-y-4">
      {[
        {
          title: 'Change Password',
          desc: 'Update your account password',
          icon: '🔒',
          action: () => (window.location.href = '/forgot-password'),
          btnLabel: 'Change',
        },
        {
          title: 'Email Address',
          desc: user?.email || 'Not set',
          icon: '📧',
          action: null,
          btnLabel: 'Verified ✓',
          btnClass: 'text-green-500 bg-green-50 border-green-200',
        },
        {
          title: 'Mobile Number',
          desc: user?.mobile
            ? `+91 ${user.mobile}`
            : 'Not linked',
          icon: '📱',
          action: null,
          btnLabel: user?.mobile ? 'Linked ✓' : 'Link Now',
          btnClass: user?.mobile
            ? 'text-green-500 bg-green-50 border-green-200'
            : '',
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <button
            onClick={item.action}
            className={`text-xs font-medium px-4 py-2 rounded-xl border transition-all ${
              item.btnClass ||
              'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {item.btnLabel}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default Profile;