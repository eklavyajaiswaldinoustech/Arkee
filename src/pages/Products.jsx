import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { productService } from '../api/services/productService';
import { categoryService } from '../api/services/categoryService';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Rated', value: 'rated' },
];

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 999999 },
];

// Collapsible Filter Block
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
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
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

  const PRODUCTS_PER_PAGE = 12;

  // Fetch categories
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

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const fetchSubs = async () => {
      try {
        const cat = categories.find(
          (c) => c.name?.toLowerCase() === selectedCategory.toLowerCase()
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

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
      };
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedSort) params.sort = selectedSort;
      if (selectedPriceRange) {
        params.minPrice = selectedPriceRange.min;
        params.maxPrice = selectedPriceRange.max;
      }

      const res = await productService.getAllProducts(params);
      const list =
        res?.data?.products ||
        res?.products ||
        res?.data ||
        [];
      const total =
        res?.data?.total || res?.total || list.length;
      const pages =
        res?.data?.totalPages ||
        res?.totalPages ||
        Math.ceil(total / PRODUCTS_PER_PAGE);

      setProducts(list);
      setTotalProducts(total);
      setTotalPages(pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    selectedType,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    selectedSort,
    selectedPriceRange,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (selectedType) params.type = selectedType;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedSubcategory, selectedType, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

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
    selectedType,
    selectedPriceRange,
    searchQuery,
  ].filter(Boolean).length;

  // Sidebar content
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
              className="input-field pr-10 text-sm py-2.5"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </FilterBlock>

      {/* Categories */}
      <FilterBlock title="Category">
        <div className="space-y-2">
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubcategory('');
              setCurrentPage(1);
            }}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory
                ? 'bg-rose-50 text-rose-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === cat.name?.toLowerCase()
                    ? ''
                    : cat.name?.toLowerCase()
                );
                setSelectedSubcategory('');
                setCurrentPage(1);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.name?.toLowerCase()
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterBlock>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <FilterBlock title="Subcategory">
          <div className="space-y-2">
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => {
                  setSelectedSubcategory(
                    selectedSubcategory === sub.name?.toLowerCase()
                      ? ''
                      : sub.name?.toLowerCase()
                  );
                  setCurrentPage(1);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSubcategory === sub.name?.toLowerCase()
                    ? 'bg-rose-50 text-rose-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </FilterBlock>
      )}

      {/* Price Range */}
      <FilterBlock title="Price Range">
        <div className="space-y-2">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedPriceRange(
                  selectedPriceRange?.label === range.label ? null : range
                );
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedPriceRange?.label === range.label
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
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

      {/* Type Filter */}
      <FilterBlock title="Collection Type">
        <div className="flex flex-wrap gap-2">
          {['oxidized', 'gold', 'silver', 'festive', 'bridal', 'casual'].map(
            (type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(selectedType === type ? '' : type);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedType === type
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          )}
        </div>
      </FilterBlock>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 rounded-xl border-2 border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
        >
          <XMarkIcon className="w-4 h-4" />
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-rose-50 via-blush-50 to-gold-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-rose-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Products</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-gray-800 font-medium capitalize">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">
            {selectedCategory
              ? `${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                } Collection`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {loading
              ? 'Loading...'
              : `${totalProducts} beautiful pieces found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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

              {/* Active Filters Pills */}
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedCategory && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('')}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedType && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    {selectedType}
                    <button onClick={() => setSelectedType('')}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    {selectedPriceRange.label}
                    <button onClick={() => setSelectedPriceRange(null)}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-200">
                    "{searchQuery}"
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchInput('');
                      }}
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white text-gray-700 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
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
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Found"
                description="Try adjusting your filters or search query to find what you're looking for."
                actionLabel="Clear All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div
                className={`grid gap-4 md:gap-5 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
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
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push('...');
                    }
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
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-rose-500" />
                Filters
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
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
                className="w-full btn-primary justify-center"
              >
                Apply Filters ({totalProducts} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;