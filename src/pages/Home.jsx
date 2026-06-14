import React, { Suspense, lazy } from 'react';

const HeroSection = lazy(() => import('../components/home/HeroSection'));
const OffersStrip = lazy(() => import('../components/home/OffersStrip'));
const CategorySection = lazy(() => import('../components/home/CategorySection'));
const FeaturedProducts = lazy(() => import('../components/home/FeaturedProducts'));
const WhyChooseUs = lazy(() => import('../components/home/WhyChooseUs'));
const LatestProducts = lazy(() => import('../components/home/LatestProducts'));
const MaterialSection = lazy(() => import('../components/home/MaterialSection'));
const BestByUs = lazy(() => import('../components/home/BestByUs'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const BlogPreview = lazy(() => import('../components/home/BlogPreview'));

const SectionLoader = () => (
  <div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl my-4" />
);

const Home = () => {
  return (
    <div className="animate-fade-in">
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <OffersStrip />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <LatestProducts />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <MaterialSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BestByUs />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BlogPreview />
      </Suspense>
    </div>
  );
};

export default Home;