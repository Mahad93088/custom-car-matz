import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Car,
  Layers,
  ArrowRight,
  HelpCircle,
  Award,
  Heart
} from 'lucide-react';
import { VehicleSelector } from '../components/VehicleSelector.tsx';
import { api } from '../lib/api.ts';
import { Product, VehicleMake, Review } from '../types/index.ts';
import { useVehicle } from '../context/VehicleContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface HomePageProps {
  setCurrentTab: (tab: string, param?: string) => void;
}

export function HomePage({ setCurrentTab }: HomePageProps) {
  const { selectedVehicle, openSelectorModal } = useVehicle();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodData, makeData, revData] = await Promise.all([
          api.getProducts({ featured: 'true' }),
          api.getMakes(),
          api.getReviews({ featured: 'true' })
        ]);
        setProducts(prodData);
        setMakes(makeData);
        setReviews(revData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const faqs = [
    {
      q: 'How do you guarantee the mats will fit my exact car?',
      a: 'Every pattern in our database is generated via physical 3D optical laser digitisation of UK right-hand-drive vehicles. We map every floor contour, clutch clearance, and factory fixing stud location with 0.2mm precision.'
    },
    {
      q: 'Are OEM floor retention clips included?',
      a: 'Yes, absolutely. Front mats come with genuine-specification retaining clips (BMW twist-locks, Audi/VW snap-pins, Mercedes oval eyelets, etc.) pre-fitted to lock onto your floor studs.'
    },
    {
      q: 'What is your turnaround and delivery timeframe?',
      a: 'Because each set is tailored to your exact specification in the UK, production takes 1-2 working days. Standard Royal Mail 48 Tracked takes 2-3 working days (Free over £49). DPD Next Day Express is available at checkout.'
    },
    {
      q: 'Can I return them if they don’t fit?',
      a: 'Yes! We stand behind every set with our 100% Fitment Guarantee. If they do not fit your specified vehicle perfectly, we will re-tailor or issue a full refund with zero hassle.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      <SEOHead
        title="Custom Car Mats UK | Precision-Fit Tailored Car Floor Mats"
        description="Precision-fit custom car mats engineered for your vehicle. Handcrafted luxury carpet, heavy-duty rubber, tailored UK fitment with fast delivery."
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AutoPartsStore',
          'name': 'Custom Car Mats UK',
          'description': 'Specialist British manufacturer of tailored, precision laser-cut car floor mats for over 4,000 UK vehicle models.',
          'url': typeof window !== 'undefined' ? window.location.origin : 'https://customcarmats.co.uk',
          'telephone': '+44 800 488 0244',
          'priceRange': '££'
        }}
      />

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-[#071A33] via-[#0B2344] to-[#040D1A] text-white pt-12 pb-24 overflow-hidden border-b border-[#0D2A4A]">
        {/* Subtle automotive background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0D2A4A] text-amber-400 border border-amber-400/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Handcrafted in the United Kingdom</span>
                <span className="text-sm">🇬🇧</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Premium Custom Car Mats,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Made for Your Car.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Precision-fit car mats designed for your vehicle. Premium materials, stylish finishes and UK delivery.
                Individually CAD cut and tailored using 3D laser-mapped scans for over 4,000 UK vehicle models.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-1.5 bg-[#040D1A]/80 border border-[#1D3B63] px-3 py-1.5 rounded-lg">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white ml-1">4.9 / 5</span>
                  <span className="text-gray-400">(2,400+ UK Reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#040D1A]/80 border border-[#1D3B63] px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">100% Fitment Guarantee</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={openSelectorModal}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl hover:shadow-amber-400/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Car className="w-5 h-5" />
                  <span>Find Your Car</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('shop')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0D2A4A] hover:bg-[#153B66] text-white font-bold text-sm rounded-xl border border-amber-400/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Shop All Mats</span>
                </button>
              </div>
            </div>

            {/* Right Hero: Interactive Vehicle Selector Widget */}
            <div className="lg:col-span-5">
              <VehicleSelector onSelectComplete={() => setCurrentTab('shop')} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Custom Car Mats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">
            Unrivalled Quality & Craftsmanship
          </span>
          <h2 className="text-3xl font-extrabold text-[#071A33] tracking-tight">
            Why Choose Custom Car Mats?
          </h2>
          <p className="text-sm text-gray-600">
            Generic universal supermarket mats slip, bunch up, and wear through in weeks. Our bespoke mats are engineered to OEM standards and handcrafted in Britain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A33] text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071A33]">3D Laser CAD Precision</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every floor pattern is mapped using industrial LiDAR scanners on genuine UK RHD vehicles for millimetre-perfect pedal clearances.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A33] text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071A33]">British Master Trimmers</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hand-finished in our Coventry facility. Choice of twin sport contrast stitching, single overlocking, or supple nubuck leatherette perimeter piping.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A33] text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071A33]">OEM Clips Included Free</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Factory retaining clips pre-punched and fitted. Locks straight into your vehicle floor pegs to prevent dangerous mat slippage under pedals.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A33] text-amber-400 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071A33]">Fast UK Delivery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tailored to order in 1-2 days and dispatched via DPD Express or Royal Mail 48 Tracked. FREE on orders over £49.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">
                Tailored Perfection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A33]">
                Featured Tailored Car Mats
              </h2>
            </div>

            <button
              onClick={() => setCurrentTab('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071A33] hover:text-amber-600 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-[#F5F7FA] rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-400 transition-all hover:shadow-xl flex flex-col"
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setCurrentTab('product', product.slug)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.salePrice && (
                      <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-extrabold rounded-md shadow-md uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-[#071A33]/90 backdrop-blur-xs text-amber-400 text-[11px] font-bold rounded-md border border-amber-400/30">
                      OEM Clips Included
                    </span>
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                      isWishlisted(product.id)
                        ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                        : 'bg-[#071A33]/80 text-gray-300 hover:text-white hover:bg-[#071A33]'
                    }`}
                    title={isWishlisted(product.id) ? 'Remove from saved wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      {product.sku} • UK Tailored Set
                    </div>
                    <h3
                      onClick={() => setCurrentTab('product', product.slug)}
                      className="text-base font-bold text-[#071A33] group-hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-medium">From</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#071A33]">
                          £{(product.salePrice || product.basePrice).toFixed(2)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            £{product.basePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTab('product', product.slug)}
                      className="px-4 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      Tailor For My Car
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Vehicle Makes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">
            Broad Compatibility
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A33]">
            Select by Popular UK Vehicle Make
          </h2>
          <p className="text-xs text-gray-600">
            Click your vehicle manufacturer below to see tailored precision car mats.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {makes.map(make => (
            <button
              key={make.id}
              onClick={() => {
                openSelectorModal();
              }}
              className="bg-white border border-gray-200 hover:border-amber-400 rounded-xl p-4 text-center group hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F7FA] border border-gray-200 flex items-center justify-center group-hover:bg-[#071A33] group-hover:text-amber-400 transition-colors">
                <Car className="w-5 h-5 text-gray-700 group-hover:text-amber-400" />
              </div>
              <span className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                {make.name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Tailored Fits</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Material Options Preview */}
      <section className="bg-[#071A33] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Grade & Thickness
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Premium Material Specifications
            </h2>
            <p className="text-xs text-gray-300">
              From tough everyday commuter carpet to ultra-dense showroom velour and 100% waterproof all-weather rubber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard 650g */}
            <div className="bg-[#040D1A] border border-[#1D3B63] rounded-2xl p-6 space-y-4">
              <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded uppercase">
                650g/m² Tufted
              </span>
              <h3 className="text-lg font-bold text-white">Classic Standard Carpet</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ribbed automotive tufted pile with reinforced heelpad. Perfect for dependable daily commuter vehicles seeking factory-quality fitment at an affordable price point.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Durable tufted yarn with anti-slip backing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reinforced heel pad included</span>
                </li>
              </ul>
            </div>

            {/* Luxury 850g */}
            <div className="bg-[#0D2A4A] border-2 border-amber-400 rounded-2xl p-6 space-y-4 relative shadow-2xl">
              <div className="absolute -top-3 right-6 px-3 py-0.5 bg-amber-400 text-[#071A33] text-[10px] font-extrabold rounded-full tracking-wider uppercase">
                Most Popular UK Choice
              </div>
              <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded uppercase border border-amber-400/30">
                850g/m² Deep Twist Pile
              </span>
              <h3 className="text-lg font-bold text-white">Luxury Deep Pile</h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                Dense twist-pile woven with premium polyamid fibres. Provides exceptional foot comfort, acoustic dampening, and elegant aesthetics that exceed standard OEM showroom grade.
              </p>
              <ul className="text-xs text-gray-200 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Substantial acoustic road-noise deadening</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>3-Year manufacturer guarantee</span>
                </li>
              </ul>
            </div>

            {/* Prestige 1200g */}
            <div className="bg-[#040D1A] border border-[#1D3B63] rounded-2xl p-6 space-y-4">
              <span className="px-2.5 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded uppercase">
                1200g/m² Spun Velour
              </span>
              <h3 className="text-lg font-bold text-white">Prestige Executive Velour</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our flagship executive carpet. Ultra-dense velour with silk-like handfeel, acoustic underlay, and hand-stitched nubuck leatherette edge binding.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Showroom-grade executive luxury</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5-Year manufacturer guarantee</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-10">
            <button
              onClick={() => setCurrentTab('materials')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#071A33] text-xs font-bold rounded-xl transition-colors shadow-lg"
            >
              Explore Complete Materials & Trims Guide
            </button>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">
            Verified British Motorists
          </span>
          <h2 className="text-3xl font-extrabold text-[#071A33]">
            What UK Drivers Say About Custom Car Mats
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map(review => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {review.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Owner
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#071A33] leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">{review.authorName}</span>
                <span>{review.carMakeModel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => setCurrentTab('reviews')}
            className="text-xs font-bold text-[#071A33] hover:text-amber-600 underline"
          >
            Read All Customer Reviews & Submit Feedback →
          </button>
        </div>
      </section>

      {/* 7. How It Works */}
      <section className="bg-[#F5F7FA] py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-[#071A33]">
              How Your Custom Mats Are Made
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-[#071A33]">Select Your Vehicle</h4>
              <p className="text-xs text-gray-600">
                Choose your make, model, year, and body variant or enter your UK registration plate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-[#071A33]">Choose Material & Stitch</h4>
              <p className="text-xs text-gray-600">
                Select carpet grade, edge binding colours, heel pad style, and optional custom embroidery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-[#071A33]">Precision Laser Cutting</h4>
              <p className="text-xs text-gray-600">
                Our CNC oscillating blade tables cut your mats to the exact laser coordinates of your chassis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="text-sm font-bold text-[#071A33]">Dispatched to Your Door</h4>
              <p className="text-xs text-gray-600">
                Carefully boxed and dispatched via DPD or Royal Mail Tracked with factory retention clips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A33]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between text-sm font-bold text-[#071A33] hover:text-amber-600 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#071A33] via-[#0D2A4A] to-[#040D1A] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden border border-amber-400/30 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              Upgrade Your Footwell Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Protect Your Vehicle with British Craftsmanship?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Over 4,000 UK RHD vehicle patterns ready to cut. 100% precision fitment guarantee.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={openSelectorModal}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-lg"
              >
                Find Mats For My Car Now
              </button>
              <button
                onClick={() => setCurrentTab('shop')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0D2A4A] hover:bg-[#153B66] text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-600 transition-colors"
              >
                Browse All Options
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
