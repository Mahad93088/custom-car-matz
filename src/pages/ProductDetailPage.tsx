import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Car,
  ShoppingBag,
  ArrowRight,
  Star,
  Layers,
  ChevronLeft,
  Heart
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { Product, StitchingOption, HeelPadOption } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useVehicle } from '../context/VehicleContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ProductDetailPageProps {
  slug: string;
  setCurrentTab: (tab: string, param?: string) => void;
}

export function ProductDetailPage({ slug, setCurrentTab }: ProductDetailPageProps) {
  const { addItem, openCheckout } = useCart();
  const { selectedVehicle, openSelectorModal } = useVehicle();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Customization Options
  const [selectedStitching, setSelectedStitching] = useState<StitchingOption | null>(null);
  const [selectedHeelPad, setSelectedHeelPad] = useState<HeelPadOption | null>(null);
  const [customEmbroidery, setCustomEmbroidery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'delivery' | 'reviews'>('features');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await api.getProduct(slug);
        setProduct(data);
        if (data.stitchingOptions?.length) {
          setSelectedStitching(data.stitchingOptions[0]);
        }
        if (data.heelPadOptions?.length) {
          setSelectedHeelPad(data.heelPadOptions[0]);
        }
        // Load reviews
        const revs = await api.getReviews({ productId: data.id });
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6" />
        <div className="h-96 bg-gray-200 rounded-2xl max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-600">The requested car mat option is unavailable.</p>
        <button
          onClick={() => setCurrentTab('shop')}
          className="px-6 py-2.5 bg-[#071A33] text-white text-xs font-bold rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Calculate dynamic configured price
  const basePrice = product.salePrice || product.basePrice;
  const stitchingModifier = selectedStitching?.priceModifier || 0;
  const heelPadModifier = selectedHeelPad?.priceModifier || 0;
  const embroideryModifier = customEmbroidery.trim() ? 9.99 : 0;
  const calculatedPrice = Number((basePrice + stitchingModifier + heelPadModifier + embroideryModifier).toFixed(2));

  const handleAddToCart = () => {
    const vehicle = selectedVehicle
      ? {
          make: selectedVehicle.makeName,
          model: selectedVehicle.modelName,
          year: selectedVehicle.yearRange,
          variant: selectedVehicle.variantName,
          regNumber: selectedVehicle.regNumber,
          clipType: selectedVehicle.clipType
        }
      : {
          make: 'Universal / Specify on Checkout',
          model: 'Standard Right-Hand Drive',
          year: 'Current',
          variant: 'Standard'
        };

    addItem({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      unitPrice: calculatedPrice,
      quantity: 1,
      imageUrl: product.images[selectedImageIdx] || product.images[0],
      materialName: product.material?.name || 'Luxury Carpet',
      colorName: product.defaultColor,
      stitchingName: selectedStitching?.name || 'Standard Edge',
      heelPadName: selectedHeelPad?.name || 'Standard Heelpad',
      vehicleDetails: vehicle,
      customEmbroidery: customEmbroidery.trim() || undefined
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEOHead
        title={`${product.name} | Custom Tailored Car Mats`}
        description={product.description.slice(0, 155)}
        canonicalPath={`/product/${product.slug}`}
        ogType="product"
        ogImage={product.images[0]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': product.name,
          'image': product.images,
          'description': product.description,
          'sku': product.sku,
          'brand': {
            '@type': 'Brand',
            'name': 'Custom Car Mats UK'
          },
          'offers': {
            '@type': 'Offer',
            'url': typeof window !== 'undefined' ? window.location.href : '',
            'priceCurrency': 'GBP',
            'price': product.salePrice || product.basePrice,
            'availability': 'https://schema.org/InStock',
            'itemCondition': 'https://schema.org/NewCondition'
          }
        }}
      />

      {/* Breadcrumb / Back button */}
      <div>
        <button
          onClick={() => setCurrentTab('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-amber-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-lg relative">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="px-2.5 py-1 bg-[#071A33]/90 backdrop-blur-xs text-amber-400 text-xs font-bold rounded-lg border border-amber-400/40">
                100% British Craftsmanship 🇬🇧
              </span>
            </div>

            {/* Gallery Wishlist Heart Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                isWishlisted(product.id)
                  ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                  : 'bg-[#071A33]/80 text-gray-300 hover:text-white hover:bg-[#071A33]'
              }`}
              title={isWishlisted(product.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIdx === idx ? 'border-amber-400 scale-95' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Fitment Guarantee Banner */}
          <div className="bg-[#071A33] text-white rounded-2xl p-5 border border-amber-400/30 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#0D2A4A] flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="text-xs">
              <h4 className="font-extrabold text-white text-sm">Ironclad 100% Fitment Guarantee</h4>
              <p className="text-gray-300 mt-0.5">
                Laser mapped to your vehicle chassis. If our mats do not snap into your factory floor studs or fit your footwell to the millimetre, we replace or refund them instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer & Ordering */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
                {product.sku}
              </span>
              {product.material && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                  {product.material.badge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">4.9 Star Rating</span>
              <span className="text-xs text-gray-400">• Verified UK Owners</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold block">Configured Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#071A33]">
                  £{calculatedPrice.toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    £{(product.basePrice + stitchingModifier + heelPadModifier).toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500">Includes UK VAT & Factory Retention Clips</span>
            </div>

            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              In Stock & Ready to Cut
            </span>
          </div>

          {/* Vehicle Match Confirmation */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-xs space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
              Tailored For Vehicle:
            </label>
            {selectedVehicle ? (
              <div className="flex items-center justify-between bg-[#F5F7FA] p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-[#071A33]">
                    {selectedVehicle.makeName} {selectedVehicle.modelName} ({selectedVehicle.yearRange}) - {selectedVehicle.variantName}
                  </span>
                </div>
                <button
                  onClick={openSelectorModal}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-900 font-medium">
                  No car chosen yet. You can confirm your make and model now or at checkout.
                </span>
                <button
                  onClick={openSelectorModal}
                  className="px-3 py-1.5 bg-[#071A33] text-amber-400 rounded-lg text-xs font-bold hover:bg-[#0D2A4A]"
                >
                  Select Car
                </button>
              </div>
            )}
          </div>

          {/* Stitching / Edge Trim Selection */}
          {product.stitchingOptions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Edge Stitching / Binding Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.stitchingOptions.map(stitch => (
                  <button
                    key={stitch.id}
                    onClick={() => setSelectedStitching(stitch)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      selectedStitching?.id === stitch.id
                        ? 'border-[#071A33] bg-[#071A33] text-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-800'
                    }`}
                  >
                    <div className="font-bold">{stitch.name}</div>
                    <div className={`text-[11px] mt-0.5 ${selectedStitching?.id === stitch.id ? 'text-amber-300' : 'text-gray-500'}`}>
                      {stitch.priceModifier === 0 ? 'Included' : `+£${stitch.priceModifier.toFixed(2)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Driver Heel Pad Selection */}
          {product.heelPadOptions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Driver Wear Heel Pad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.heelPadOptions.map(pad => (
                  <button
                    key={pad.id}
                    onClick={() => setSelectedHeelPad(pad)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      selectedHeelPad?.id === pad.id
                        ? 'border-[#071A33] bg-[#071A33] text-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-800'
                    }`}
                  >
                    <div className="font-bold leading-tight">{pad.name}</div>
                    <div className={`text-[11px] mt-1 ${selectedHeelPad?.id === pad.id ? 'text-amber-300' : 'text-gray-500'}`}>
                      {pad.priceModifier === 0 ? 'Included' : `+£${pad.priceModifier.toFixed(2)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Bespoke Embroidery */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                Custom Embroidery (+£9.99)
              </label>
              <span className="text-[11px] text-gray-400">Optional</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Driver Initials or Model Name"
              maxLength={18}
              value={customEmbroidery}
              onChange={e => setCustomEmbroidery(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions: Add to Cart & Buy Now */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full sm:flex-1 py-4 px-6 bg-[#071A33] hover:bg-[#0D2A4A] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Add to Basket</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full sm:flex-1 py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buy Now with Stripe</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-4 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                isWishlisted(product.id)
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                  : 'bg-white border-gray-300 text-gray-500 hover:text-rose-600 hover:border-rose-300'
              }`}
              title={isWishlisted(product.id) ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-600" />
              Free UK Delivery Over £49
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              30-Day Returns Policy
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Features, Specs, Delivery, Reviews */}
      <div className="pt-10 border-t border-gray-200">
        <div className="flex border-b border-gray-200 gap-8 overflow-x-auto text-sm font-bold">
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 transition-colors ${
              activeTab === 'features' ? 'border-b-2 border-[#071A33] text-[#071A33]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Features & CAD Precision
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors ${
              activeTab === 'specs' ? 'border-b-2 border-[#071A33] text-[#071A33]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 transition-colors ${
              activeTab === 'delivery' ? 'border-b-2 border-[#071A33] text-[#071A33]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            UK Delivery & Returns
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors ${
              activeTab === 'reviews' ? 'border-b-2 border-[#071A33] text-[#071A33]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700 leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-2xl">
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3.5 font-bold text-gray-700 border-r border-gray-200 w-1/2">{key}</td>
                      <td className="p-3.5 text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-2xl text-xs text-gray-600 space-y-4 leading-relaxed bg-white p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-[#071A33] text-sm">Dispatched from West Midlands, UK</h4>
              <p>
                Each mat set is custom made to your order. We cut and finish your set within 1-2 working days.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Royal Mail 48 Tracked:</strong> 2-3 working days (£3.99, or FREE on orders over £49.00)</li>
                <li><strong>DPD Express Next Day Tracked:</strong> 1 working day with 1-hour delivery slot (£6.99)</li>
                <li><strong>30-Day Hassle-Free Returns:</strong> Return unsoiled mats in original packaging if you change your mind.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500">No verified reviews yet for this specific model.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-400">{rev.authorLocation}</span>
                    </div>
                    <h5 className="font-bold text-xs text-gray-900">&ldquo;{rev.title}&rdquo;</h5>
                    <p className="text-xs text-gray-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                    <p className="text-[10px] text-gray-400 font-medium">— {rev.authorName}, {rev.carMakeModel}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
