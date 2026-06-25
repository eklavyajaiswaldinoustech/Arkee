import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  ChevronDownIcon,
  SparklesIcon,
  FireIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import {
  SparklesIcon as SparklesSolid,
  FireIcon as FireSolid,
  RectangleStackIcon as RectangleStackSolid,
} from '@heroicons/react/24/solid';
import { productService } from '../api/services/productService';
import { categoryService } from '../api/services/categoryService';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

// ── CONSTANTS ──
const PRODUCTS_PER_PAGE = 12;

const TABS = [
  {
    key: 'all',
    label: 'All Products',
    icon: RectangleStackIcon,
    iconSolid: RectangleStackSolid,
    description: 'Browse our entire collection',
  },
  {
    key: 'newArrivals',
    label: 'New Arrivals',
    icon: SparklesIcon,
    iconSolid: SparklesSolid,
    description: 'Fresh & latest designs',
  },
  {
    key: 'bestSellers',
    label: 'Bestsellers',
    icon: FireIcon,
    iconSolid: FireSolid,
    description: 'Most loved by our customers',
  },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Rated', value: 'rated' },
];

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 999999 },
];

// ── HELPERS ──
const text = (value) => (value ?? '').toString().trim().toLowerCase();
const getPrice = (product) =>
  Number(product?.discountPrice || product?.price || product?.current_price || 0);

// ── FILTER BLOCK ──
const FilterBlock = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-4"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Tab State ──
  const initialTab = () => {
    const filter = searchParams.get('filter');
    if (filter === 'newLaunch') return 'newArrivals';
    if (filter === 'bestSeller') return 'bestSellers';
    return searchParams.get('tab') || 'all';
  };
  const [activeTab, setActiveTab] = useState(initialTab);

  // ── Data State ──
  const [allProducts, setAllProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [collectionTypes, setCollectionTypes] = useState([]);

  // ── Loading States (per tab) ──
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingBest, setLoadingBest] = useState(true);

  // ── UI State ──
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filters ──
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    searchParams.get('subcategory') || ''
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') || ''
  );
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );

  // ── Sync URL → State on URL change ──
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedSubcategory(searchParams.get('subcategory') || '');
    setSelectedType(searchParams.get('type') || '');
    setSearchQuery(searchParams.get('search') || '');
    setSearchInput(searchParams.get('search') || '');

    const filter = searchParams.get('filter');
    if (filter === 'newLaunch') setActiveTab('newArrivals');
    else if (filter === 'bestSeller') setActiveTab('bestSellers');
    else if (searchParams.get('tab')) setActiveTab(searchParams.get('tab'));
  }, [searchParams]);

  // ── Fetch Categories ──
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res?.data || res?.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCats();
  }, []);

  // ── Fetch Collection Types ──
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await productService.getTypeAndCategory();
        const meta = Array.isArray(res?.data) ? res.data : [];
        const types = meta.map((item) => item?.type || item?.name).filter(Boolean);
        if (types.length > 0) setCollectionTypes(types);
      } catch {
        // endpoint may not exist yet
      }
    };
    fetchMeta();
  }, []);

  // ── Fetch Subcategories when Category changes ──
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const fetchSubs = async () => {
      try {
        const cat = categories.find(
          (c) => text(c.name || c.type) === text(selectedCategory)
        );
        if (cat?._id) {
          const res = await categoryService.getAllSubcategories(cat._id);
          setSubcategories(res?.data || res?.subcategories || []);
        }
      } catch {
        setSubcategories([]);
      }
    };
    fetchSubs();
  }, [selectedCategory, categories]);

  // ══════════════════════════════════════
  //  DATA FETCHING — ALL 3 TABS
  // ══════════════════════════════════════

  // Tab 1: All Products
  const fetchAllProducts = useCallback(async () => {
    setLoadingAll(true);
    try {
      const params = { page: 1, limit: 200 };
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedPriceRange) {
        params.minPrice = selectedPriceRange.min;
        params.maxPrice = selectedPriceRange.max;
      }
      const res = await productService.getAllProducts(params);
      setAllProducts(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setAllProducts([]);
    } finally {
      setLoadingAll(false);
    }
  }, [selectedType, selectedCategory, selectedSubcategory, searchQuery, selectedPriceRange]);

  // Tab 2: New Arrivals
  const fetchNewArrivals = useCallback(async () => {
    setLoadingNew(true);
    try {
      const res = await productService.getNewLaunchProducts();
      setNewArrivals(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setNewArrivals([]);
    } finally {
      setLoadingNew(false);
    }
  }, []);

  // Tab 3: Bestsellers
  const fetchBestSellers = useCallback(async () => {
    setLoadingBest(true);
    try {
      const res = await productService.getBestSellerProducts();
      setBestSellers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setBestSellers([]);
    } finally {
      setLoadingBest(false);
    }
  }, []);

  // Fetch all on mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  // ══════════════════════════════════════
  //  FILTER + SORT + PAGINATE
  // ══════════════════════════════════════

  // Get raw products based on active tab
  const rawProducts = useMemo(() => {
    switch (activeTab) {
      case 'newArrivals':
        return [...newArrivals];
      case 'bestSellers':
        return [...bestSellers];
      default:
        return [...allProducts];
    }
  }, [activeTab, allProducts, newArrivals, bestSellers]);

  // Apply client-side filters
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // Category filter
    if (selectedCategory) {
      list = list.filter(
        (p) =>
          text(p?.category || p?.type) === text(selectedCategory)
      );
    }

    // Subcategory filter
    if (selectedSubcategory) {
      list = list.filter(
        (p) => text(p?.subcategory) === text(selectedSubcategory)
      );
    }

    // Type filter
    if (selectedType) {
      list = list.filter((p) => text(p?.type) === text(selectedType));
    }

    // Search
    if (searchQuery) {
      const q = text(searchQuery);
      list = list.filter((p) =>
        [p?.name, p?.category, p?.subcategory, p?.type, p?.description]
          .filter(Boolean)
          .some((field) => text(field).includes(q))
      );
    }

    // Price range
    if (selectedPriceRange) {
      list = list.filter((p) => {
        const price = getPrice(p);
        return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
      });
    }

    // Sort
    list.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      switch (selectedSort) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'popular':
          return (b?.totalSold || 0) - (a?.totalSold || 0);
        case 'rated':
          return (b?.rating || 0) - (a?.rating || 0);
        case 'newest':
        default:
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      }
    });

    return list;
  }, [
    rawProducts,
    selectedCategory,
    selectedSubcategory,
    selectedType,
    searchQuery,
    selectedPriceRange,
    selectedSort,
  ]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const isLoading =
    activeTab === 'all'
      ? loadingAll
      : activeTab === 'newArrivals'
      ? loadingNew
      : loadingBest;

  // Reset page on filter/tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    selectedCategory,
    selectedSubcategory,
    selectedType,
    selectedPriceRange,
    searchQuery,
    selectedSort,
  ]);

  // ── Sync State → URL ──
  useEffect(() => {
    const params = {};
    if (activeTab !== 'all') params.tab = activeTab;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (selectedType) params.type = selectedType;
    if (searchQuery) params.search = searchQuery;

    // Map tab back to filter param for backward compat
    if (activeTab === 'newArrivals') params.filter = 'newLaunch';
    else if (activeTab === 'bestSellers') params.filter = 'bestSeller';

    const occasion = searchParams.get('occasion');
    if (occasion) params.occasion = occasion;

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedCategory, selectedSubcategory, selectedType, searchQuery]);

  // ── Tab Switch Handler ──
  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Search Handler ──
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // ── Clear Filters ──
  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedType('');
    setSelectedPriceRange(null);
    setSearchQuery('');
    setSearchInput('');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedCategory,
    selectedSubcategory,
    selectedType,
    selectedPriceRange,
    searchQuery,
  ].filter(Boolean).length;

  // ── Tab counts ──
  const tabCounts = useMemo(
    () => ({
      all: allProducts.length,
      newArrivals: newArrivals.length,
      bestSellers: bestSellers.length,
    }),
    [allProducts, newArrivals, bestSellers]
  );

  // ── Page Title ──
  const pageTitle = useMemo(() => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (selectedCategory) {
      const cap = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      switch (activeTab) {
        case 'newArrivals':
          return `New ${cap}`;
        case 'bestSellers':
          return `Best Selling ${cap}`;
        default:
          return `${cap} Collection`;
      }
    }
    switch (activeTab) {
      case 'newArrivals':
        return 'New Arrivals';
      case 'bestSellers':
        return 'Bestsellers';
      default:
        return 'All Products';
    }
  }, [activeTab, selectedCategory, searchQuery]);

  const pageDescription = useMemo(() => {
    const currentTabData = TABS.find((t) => t.key === activeTab);
    if (isLoading) return 'Loading...';
    return `${totalProducts} pieces · ${currentTabData?.description || ''}`;
  }, [activeTab, totalProducts, isLoading]);

  // ══════════════════════════════════════
  //  SIDEBAR CONTENT (shared)
  // ══════════════════════════════════════
  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Search */}
      <FilterBlock title="Search">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </FilterBlock>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterBlock title="Category">
          <div className="space-y-1">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const catName = text(cat.name || cat.type);
              return (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === catName ? '' : catName);
                    setSelectedSubcategory('');
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCategory === catName
                      ? 'bg-rose-50 text-rose-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name || cat.type}
                </button>
              );
            })}
          </div>
        </FilterBlock>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <FilterBlock title="Subcategory">
          <div className="space-y-1">
            {subcategories.map((sub) => {
              const subName = sub.name?.toLowerCase();
              return (
                <button
                  key={sub._id}
                  onClick={() =>
                    setSelectedSubcategory(
                      selectedSubcategory === subName ? '' : subName
                    )
                  }
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedSubcategory === subName
                      ? 'bg-rose-50 text-rose-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </FilterBlock>
      )}

      {/* Price Ranges */}
      <FilterBlock title="Price Range">
        <div className="space-y-1">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() =>
                setSelectedPriceRange(
                  selectedPriceRange?.label === range.label ? null : range
                )
              }
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedPriceRange?.label === range.label
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedPriceRange?.label === range.label
                    ? 'border-rose-500 bg-rose-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPriceRange?.label === range.label && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              {range.label}
            </button>
          ))}
        </div>
      </FilterBlock>

      {/* Collection Types */}
      {collectionTypes.length > 0 && (
        <FilterBlock title="Collection Type">
          <div className="flex flex-wrap gap-2">
            {collectionTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedType(selectedType === type ? '' : type)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedType === type
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </FilterBlock>
      )}

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 rounded-xl border-2 border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <XMarkIcon className="w-4 h-4" />
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  // ══════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ═══ Page Header ═══ */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50/30 to-amber-50/30 border-b border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link
              to="/"
              className="hover:text-rose-500 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium">Products</span>
            {selectedCategory && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-medium capitalize">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            {pageTitle}
          </h1>
          <p className="text-gray-500 text-sm">{pageDescription}</p>

          {/* ═══ TABS ═══ */}
          <div className="mt-6 -mb-px">
            <div className="flex gap-1 sm:gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl border border-rose-100/50 shadow-sm w-fit">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = isActive ? tab.iconSolid : tab.icon;
                const count = tabCounts[tab.key] || 0;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`
                      relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium
                      transition-all duration-300 ease-out
                      ${
                        isActive
                          ? 'bg-white text-rose-600 shadow-md shadow-rose-100/50 scale-[1.02]'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-rose-500' : 'text-gray-400'
                      }`}
                    />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">
                      {tab.key === 'all'
                        ? 'All'
                        : tab.key === 'newArrivals'
                        ? 'New'
                        : 'Best'}
                    </span>
                    {!isLoading && count > 0 && (
                      <span
                        className={`
                          text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center
                          transition-colors
                          ${
                            isActive
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-gray-100 text-gray-500'
                          }
                        `}
                      >
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                    {/* Active indicator line */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-rose-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FunnelIcon className="w-4 h-4 text-rose-500" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Main Column ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:border-rose-300 hover:text-rose-500 transition-all"
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedCategory && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200 capitalize">
                    {selectedCategory}
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedSubcategory('');
                      }}
                      className="hover:text-rose-800 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200 capitalize">
                    {selectedSubcategory}
                    <button
                      onClick={() => setSelectedSubcategory('')}
                      className="hover:text-rose-800 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedType && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200 capitalize">
                    {selectedType}
                    <button
                      onClick={() => setSelectedType('')}
                      className="hover:text-rose-800 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    {selectedPriceRange.label}
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      className="hover:text-rose-800 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchInput('');
                      }}
                      className="hover:text-rose-800 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort + View */}
              <div className="flex items-center gap-3 ml-auto">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white text-gray-700 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ Products Grid ═══ */}
            {isLoading ? (
              <div
                className={`grid gap-4 md:gap-5 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <EmptyState
                title={
                  activeTab === 'newArrivals'
                    ? 'No New Arrivals Yet'
                    : activeTab === 'bestSellers'
                    ? 'No Bestsellers Yet'
                    : 'No Products Found'
                }
                description={
                  activeFilterCount > 0
                    ? 'Try adjusting your filters or search query to find what you\'re looking for.'
                    : activeTab === 'newArrivals'
                    ? 'Check back soon for fresh new designs!'
                    : activeTab === 'bestSellers'
                    ? 'Our most popular items will appear here.'
                    : 'No products available at the moment.'
                }
                actionLabel={activeFilterCount > 0 ? 'Clear All Filters' : undefined}
                onAction={activeFilterCount > 0 ? clearAllFilters : undefined}
              />
            ) : (
              <div
                className={`grid gap-4 md:gap-5 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* ═══ Pagination ═══ */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-rose-300 hover:text-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 2
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          currentPage === item
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                            : 'border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-rose-300 hover:text-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results summary */}
            {!isLoading && totalProducts > 0 && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                {Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} of{' '}
                {totalProducts} products
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Mobile Sidebar Drawer ═══ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto transition-transform duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-rose-500" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <SidebarContent />
            </div>
            <div className="sticky bottom-0 p-5 bg-white border-t border-gray-100">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-rose-200"
              >
                Show Results ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;