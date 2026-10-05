import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle2,
  Clock,
  Car,
  Layers,
  ArrowRight,
  HelpCircle,
  Award,
  Heart,
  Zap,
  Check,
  SlidersHorizontal,
  Compass,
  Maximize2
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

// Luxury car interior showcases featuring 3D laser-fitted mats
const LUXURY_SHOWCASE = [
  {
    id: 'bmw',
    make: 'BMW',
    model: 'M Sport 3 & 4 Series (G20/G22)',
    headline: 'Laser-Scanned Bavarian Precision',
    description: 'Ultra-dense 1200g/m² spun velour with M-Sport tri-colour contrast edge binding, precision throttle clearance, and dual factory twist-lock fixings.',
    tag: '3D CAD Mapped • RHD Coventry Tailored',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&auto=format&fit=crop&q=85',
    matType: 'Executive Velour Set',
    clipType: 'BMW OEM Twist-Lock Grommets'
  },
  {
    id: 'mercedes',
    make: 'Mercedes-Benz',
    model: 'AMG Line C & E-Class (W206/W213)',
    headline: 'Executive Footwell Architecture',
    description: 'Double diamond quilted heelpad with supple charcoal nubuck perimeter piping and factory Mercedes oval anchor eyelets.',
    tag: 'LiDAR Digitised • 0.2mm Tolerance',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&auto=format&fit=crop&q=85',
    matType: 'Diamond Quilted Prestige',
    clipType: 'Mercedes Oval Eyelet Anchors'
  },
  {
    id: 'audi',
    make: 'Audi',
    model: 'RS & S-Line A3 / A4 / RS3 (8Y/B9)',
    headline: 'High-Performance Cabin Shield',
    description: 'Heavy-duty laser-etched chevron tire-tread rubber combined with crimson double-stitch sport edging and factory snap-lock floor posts.',
    tag: 'OEM Retention Studs • All-Weather',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1600&auto=format&fit=crop&q=85',
    matType: 'All-Weather Rubber / Velour Hybrid',
    clipType: 'Audi Snap-Pin Retainers'
  }
];

export function HomePage({ setCurrentTab }: HomePageProps) {
  const { selectedVehicle, openSelectorModal } = useVehicle();
  const { addItem, openCheckout } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance showcase every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % LUXURY_SHOWCASE.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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

  // Quick Buy handler: adds default tailored configuration and directly opens checkout modal
  const handleQuickBuy = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    const price = product.salePrice || product.basePrice;
    const vehicle = selectedVehicle
      ? {
          make: selectedVehicle.makeName,
          model: selectedVehicle.modelName,
          year: selectedVehicle.yearRange,
          variant: selectedVehicle.variantName
        }
      : {
          make: 'Universal / Standard',
          model: 'UK Right-Hand Drive',
          year: 'Current',
          variant: 'Standard Cabin Set'
        };

    addItem(
      {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice: price,
        quantity: 1,
        imageUrl:
          product.images[0] ||
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
        materialName: 'Luxury 850g Twist Pile Carpet',
        colorName: 'Graphite Matte Black',
        stitchingName: 'Contrast Sport Gold Stitching',
        heelPadName: 'Reinforced Twin-Rib Pad',
        vehicleDetails: vehicle,
        customEmbroidery: undefined
      },
      false
    );

    openCheckout();
  };

  const faqs = [
    {
      q: 'How do you guarantee the mats will fit my exact car?',
      a: 'Every pattern in our British database is created via physical 3D optical laser digitisation of UK right-hand-drive vehicles. We map every floor contour, clutch clearance, and factory fixing stud location with 0.2mm precision.'
    },
    {
      q: 'Are OEM floor retention clips included free?',
      a: 'Yes, absolutely. Front mats come with genuine-specification retaining clips (BMW twist-locks, Audi/VW snap-pins, Mercedes oval eyelets, etc.) pre-fitted to lock onto your floor studs with zero slippage.'
    },
    {
      q: 'What is your turnaround and delivery timeframe?',
      a: 'Because each set is tailored to your exact specification in our Coventry facility, tailoring takes 1-2 working days. Tracked delivery via Royal Mail 48 Tracked or DPD Express takes 2-3 working days (Free on orders over £49).'
    },
    {
      q: 'Can I return them if they don’t fit?',
      a: 'Yes! We stand behind every set with our 100% Fitment Guarantee. If they do not fit your specified vehicle perfectly, we will re-tailor or issue a full refund with zero hassle.'
    }
  ];

  const currentShowcase = LUXURY_SHOWCASE[activeSlide];

  return (
    <div className="bg-[#0B0F17] text-white min-h-screen selection:bg-amber-400 selection:text-black">
      <SEOHead
        title="Custom Car Mats UK | Precision-Engineered Luxury Floor Mats"
        description="Precision-engineered luxury floor mats for your vehicle. 3D laser-scanned fitment, hand-tailored British craftsmanship, OEM retention clips, and fast UK delivery."
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AutoPartsStore',
          name: 'Custom Car Mats UK',
          description:
            'Specialist British manufacturer of tailored, precision laser-cut car floor mats for over 4,000 UK vehicle models.',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://customcarmats.co.uk',
          telephone: '+44 800 488 0244',
          priceRange: '££'
        }}
      />

      {/* 1. HERO SECTION: DARK LUXURY SHOWCASE & 3D LASER FIT */}
      <section className="relative pt-8 pb-20 overflow-hidden border-b border-white/[0.08]">
        {/* Subtle Charcoal & Gold Radial Glow Background */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            
            {/* Left Column: Headlines & Showcase Slider Preview */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Floating Laser-Fit Guarantee Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#141C2B]/90 text-amber-400 border border-amber-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <span className="tracking-wide">Laser-Fit Guarantee • 3D CAD Scanned</span>
                <span className="text-gray-400 font-normal">|</span>
                <span className="text-gray-300">🇬🇧 Made in the UK</span>
              </div>

              {/* Punchy Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Precision-Engineered{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.3)]">
                  Luxury Floor Mats
                </span>{' '}
                for Your Vehicle.
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light">
                Individually tailored in our British workshop using 3D laser coordinate scans of over 4,000 UK models.
                Showroom velour, reinforced heelpads, and factory retention clips pre-fitted to prevent any slippage.
              </p>

              {/* Vehicle Interior Showcase / Slider */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#101726]/60 backdrop-blur-md p-4 space-y-3.5 shadow-2xl">
                <div className="relative aspect-21/9 sm:aspect-21/8 rounded-xl overflow-hidden group">
                  <img
                    src={currentShowcase.image}
                    alt={currentShowcase.model}
                    className="w-full h-full object-cover object-center transition-all duration-700 brightness-90 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
                  
                  {/* Floating CAD HUD Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#090D14]/85 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      {currentShowcase.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">
                        {currentShowcase.make} Showcase
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-white">
                        {currentShowcase.model}
                      </div>
                      <div className="text-[11px] text-gray-300 hidden sm:block">
                        {currentShowcase.matType} • {currentShowcase.clipType}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#090D14]/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                      <button
                        onClick={() => setActiveSlide(prev => (prev - 1 + LUXURY_SHOWCASE.length) % LUXURY_SHOWCASE.length)}
                        className="p-1 hover:text-amber-400 transition-colors cursor-pointer text-gray-300"
                        title="Previous vehicle showcase"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-mono font-bold px-1 text-gray-300">
                        0{activeSlide + 1} / 0{LUXURY_SHOWCASE.length}
                      </span>
                      <button
                        onClick={() => setActiveSlide(prev => (prev + 1) % LUXURY_SHOWCASE.length)}
                        className="p-1 hover:text-amber-400 transition-colors cursor-pointer text-gray-300"
                        title="Next vehicle showcase"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Showcase Switcher Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {LUXURY_SHOWCASE.map((showcase, index) => (
                    <button
                      key={showcase.id}
                      onClick={() => setActiveSlide(index)}
                      className={`text-left px-3 py-2 rounded-xl transition-all border text-xs cursor-pointer ${
                        activeSlide === index
                          ? 'bg-[#152136] border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'bg-[#090E1A]/50 border-white/[0.05] text-gray-400 hover:text-gray-200 hover:bg-[#121B2C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-[11px] ${activeSlide === index ? 'text-amber-400' : 'text-gray-300'}`}>
                          {showcase.make}
                        </span>
                        {activeSlide === index && <Check className="w-3 h-3 text-amber-400" />}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">
                        {showcase.model.split('(')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={openSelectorModal}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#090D14] font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Car className="w-5 h-5" />
                  <span>Find Your Car</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('shop')}
                  className="w-full sm:w-auto px-7 py-4 bg-[#141C2B] hover:bg-[#1C273B] text-white font-bold text-sm rounded-xl border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Browse Catalog</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sleek Prominent Find Your Car Selector Widget */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Glow ring around selector */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-transparent to-cyan-500/20 blur-xl opacity-75 pointer-events-none" />
                <VehicleSelector onSelectComplete={() => setCurrentTab('shop')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUBTLE TRUST BAR SECTION */}
      <section className="bg-[#0E1420]/80 backdrop-blur-md border-b border-white/[0.08] py-4.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
            
            {/* Trustpilot 4.9 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-xl bg-[#00B67A]/15 border border-[#00B67A]/30 flex items-center justify-center flex-shrink-0 text-[#00B67A]">
                <Star className="w-5 h-5 fill-[#00B67A]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-white text-xs">Trustpilot</span>
                  <span className="text-[11px] font-bold text-[#00B67A] bg-[#00B67A]/10 px-1.5 py-0.2 rounded">4.9 ★</span>
                </div>
                <div className="text-[10px] text-gray-400">2,400+ Verified UK Reviews</div>
              </div>
            </div>

            {/* Free UK Shipping */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-white text-xs">Free UK Shipping</div>
                <div className="text-[10px] text-gray-400">On all orders over £49</div>
              </div>
            </div>

            {/* Made in the UK */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-base">
                🇬🇧
              </div>
              <div className="text-left">
                <div className="font-extrabold text-white text-xs">Made in the UK</div>
                <div className="text-[10px] text-gray-400">Handcrafted in Coventry</div>
              </div>
            </div>

            {/* 100% Fitment Guarantee */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-white text-xs">100% Fit Guarantee</div>
                <div className="text-[10px] text-gray-400">OEM Floor Clips Pre-Fitted</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID (DARK LUXURY GLASSMORPHISM) */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Tailored Perfection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Featured Tailored Floor Mats
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                Bespoke sets CAD cut to your vehicle contour. Choose standard everyday carpet, executive plush velour, or all-weather waterproof diamond rubber.
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('shop')}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors group cursor-pointer bg-white/[0.03] px-4 py-2 rounded-xl border border-white/10 hover:border-amber-400/40"
            >
              <span>Explore All 4,000+ Models</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-3xl h-96 animate-pulse" />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-white/[0.02] rounded-3xl border border-white/[0.08]">
                <p className="text-gray-400 text-sm">Loading tailored mats...</p>
              </div>
            ) : (
              products.map(product => (
                <div
                  key={product.id}
                  className="group bg-[#101726]/80 hover:bg-[#131E33]/90 rounded-3xl border border-white/[0.08] hover:border-amber-400/40 overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.12)] flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div
                      className="relative aspect-4/3 bg-black/40 overflow-hidden cursor-pointer"
                      onClick={() => setCurrentTab('product', product.slug)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101726] via-transparent to-transparent opacity-80" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.salePrice && (
                          <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md shadow-md uppercase tracking-wider">
                            Special Offer
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 bg-[#090D14]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-md border border-amber-400/30">
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
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg z-10 cursor-pointer ${
                          isWishlisted(product.id)
                            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                            : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/80'
                        }`}
                        title={isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{product.sku}</span>
                        <span className="text-amber-400/90 font-mono">Coventry Crafted</span>
                      </div>

                      <h3
                        onClick={() => setCurrentTab('product', product.slug)}
                        className="text-base font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Tailored Vehicle Tag if selected */}
                      {selectedVehicle && (
                        <div className="pt-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold">
                            <Car className="w-3 h-3 text-amber-400" />
                            <span>Precision Fit for {selectedVehicle.makeName} {selectedVehicle.modelName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Tailored Set</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-white">
                            £{(product.salePrice || product.basePrice).toFixed(2)}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-gray-500 line-through">
                              £{product.basePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCurrentTab('product', product.slug)}
                          className="px-3 py-2.5 bg-white/[0.06] hover:bg-white/10 text-gray-200 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/10 cursor-pointer"
                          title="Customise materials, stitching, heel pad & embroidery"
                        >
                          Tailor Set
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickBuy(e, product)}
                          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#090D14] text-xs font-black rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          title={
                            selectedVehicle
                              ? `Quick Buy default configuration for ${selectedVehicle.makeName} ${selectedVehicle.modelName}`
                              : 'Quick Buy default configuration'
                          }
                        >
                          <Zap className="w-3.5 h-3.5 fill-current text-[#090D14]" />
                          <span>Quick Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE CUSTOM CAR MATS (CRAFTSMANSHIP PILLARS) */}
      <section className="py-20 bg-[#0E1422]/60 border-y border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Unrivalled Engineering Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Custom Car Mats Outperform Universal Alternatives
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Generic supermarket mats slip dangerously under pedals and wear out within months. Our custom mats are manufactured in Britain to strict OEM tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#121929]/80 rounded-2xl p-6 border border-white/[0.08] hover:border-amber-400/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3D Laser CAD Precision</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every chassis floor plan is scanned using industrial optical LiDAR scanners on genuine UK RHD vehicles for 0.2mm precision.
              </p>
            </div>

            <div className="bg-[#121929]/80 rounded-2xl p-6 border border-white/[0.08] hover:border-amber-400/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Coventry Master Trimmers</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hand-finished in our West Midlands facility. Choose twin contrast stitching, sport overlocking, or supple nubuck leatherette edges.
              </p>
            </div>

            <div className="bg-[#121929]/80 rounded-2xl p-6 border border-white/[0.08] hover:border-amber-400/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">OEM Clips Included Free</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Factory retention clips pre-punched and fitted. Locks straight into your vehicle floor pegs to prevent dangerous mat slip.
              </p>
            </div>

            <div className="bg-[#121929]/80 rounded-2xl p-6 border border-white/[0.08] hover:border-amber-400/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Fast UK Tracked Delivery</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tailored in 1-2 working days and dispatched via DPD Express or Royal Mail 48 Tracked. Free on orders over £49.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR UK VEHICLE MAKES SELECTOR */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Over 4,000 Models Supported
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Select by Popular Vehicle Manufacturer
          </h2>
          <p className="text-xs text-gray-400">
            Select your car manufacturer to browse guaranteed compatible custom floor mats.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {makes.map(make => (
            <button
              key={make.id}
              onClick={openSelectorModal}
              className="bg-[#111726]/60 border border-white/[0.08] hover:border-amber-400/50 rounded-2xl p-5 text-center group hover:bg-[#162035] transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-amber-400/15 group-hover:border-amber-400/40 transition-colors">
                <Car className="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                {make.name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Laser-Fit CAD</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. MATERIAL GRADES & THICKNESS SPECIFICATION */}
      <section className="py-20 bg-[#0E1422]/70 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Grade & Thickness
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Premium Material Specifications
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Engineered for extreme wear resistance, foot comfort, and acoustic floor dampening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard 650g */}
            <div className="bg-[#111827]/80 border border-white/[0.08] rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-white/[0.06] text-gray-300 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-white/10">
                  650g/m² Tufted Pile
                </span>
                <h3 className="text-lg font-extrabold text-white">Classic Standard Carpet</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ribbed automotive tufted pile with reinforced heelpad. Perfect for dependable daily commuter vehicles seeking factory-quality fitment at an affordable price point.
                </p>
                <ul className="text-xs text-gray-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Durable tufted yarn with anti-slip backing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Reinforced heel pad included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Luxury 850g (Highlight) */}
            <div className="bg-[#141F33] border-2 border-amber-400/80 rounded-3xl p-6 space-y-4 relative shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-[#090D14] text-[10px] font-black rounded-full tracking-wider uppercase shadow-md">
                Most Popular UK Choice
              </div>
              <div className="space-y-4">
                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-amber-400/30">
                  850g/m² Deep Twist Pile
                </span>
                <h3 className="text-lg font-extrabold text-white">Luxury Deep Pile</h3>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Dense twist-pile woven with premium polyamid fibres. Provides exceptional foot comfort, acoustic dampening, and elegant aesthetics that exceed standard OEM showroom grade.
                </p>
                <ul className="text-xs text-gray-200 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Substantial acoustic road-noise deadening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>3-Year manufacturer guarantee</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prestige 1200g */}
            <div className="bg-[#111827]/80 border border-white/[0.08] rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-white/[0.06] text-gray-300 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-white/10">
                  1200g/m² Spun Velour
                </span>
                <h3 className="text-lg font-extrabold text-white">Prestige Executive Velour</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Our flagship executive carpet. Ultra-dense velour with silk-like handfeel, acoustic underlay, and hand-stitched nubuck leatherette edge binding.
                </p>
                <ul className="text-xs text-gray-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Showroom-grade executive luxury</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>5-Year manufacturer guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center pt-10">
            <button
              onClick={() => setCurrentTab('materials')}
              className="px-6 py-3 bg-white/[0.06] hover:bg-white/10 text-amber-400 text-xs font-bold rounded-xl transition-colors border border-amber-400/30 cursor-pointer shadow-lg"
            >
              Explore Complete Materials & Trims Guide →
            </button>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (DARK LUXURY CARDS WITH VERIFIED BADGES) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Verified British Motorists
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What UK Drivers Say About Custom Car Mats
          </h2>
          <p className="text-xs text-gray-400">
            Real feedback from verified car owners across England, Scotland, Wales and Northern Ireland.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map(review => (
            <div
              key={review.id}
              className="bg-[#101726]/80 border border-white/[0.08] hover:border-amber-400/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:bg-[#131D31]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {review.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Verified Owner
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h4>

                <p className="text-xs text-gray-300 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-gray-400">
                <span className="font-extrabold text-white">{review.authorName}</span>
                <span className="text-amber-400/90 font-mono text-[11px]">{review.carMakeModel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <button
            onClick={() => setCurrentTab('reviews')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            Read All Customer Reviews & Submit Feedback →
          </button>
        </div>
      </section>

      {/* 8. FAQ ACCORDION (DARK LUXURY) */}
      <section className="py-20 bg-[#0E1422]/60 border-y border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Clear Answers
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[#111827]/80 shadow-md"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-amber-400 text-lg font-mono ml-4">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/[0.05] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HIGH-CONVERTING BOTTOM CALL TO ACTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111A2B] via-[#162238] to-[#101726] rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden border border-amber-400/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Laser-Fit Guarantee • 3D CAD Scanned</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Vehicle with British Tailored Craftsmanship?
            </h2>

            <p className="text-xs sm:text-sm text-gray-300">
              Over 4,000 UK RHD vehicle patterns ready to laser-cut. 100% precision fitment guarantee with OEM clips included.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={openSelectorModal}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#090D14] font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
              >
                Find Mats For My Car Now
              </button>
              <button
                onClick={() => setCurrentTab('shop')}
                className="w-full sm:w-auto px-8 py-4 bg-white/[0.08] hover:bg-white/15 text-white font-bold text-sm rounded-xl border border-white/10 transition-colors cursor-pointer"
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
