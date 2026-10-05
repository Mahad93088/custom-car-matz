import React, { useState, useEffect } from 'react';
import { Search, Filter, Car, ShieldCheck, ArrowUpDown, X, Tag, Heart, Zap } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Product, MaterialOption } from '../types/index.ts';
import { useVehicle } from '../context/VehicleContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

interface ShopPageProps {
  setCurrentTab: (tab: string, param?: string) => void;
}

export function ShopPage({ setCurrentTab }: ShopPageProps) {
  const { selectedVehicle, openSelectorModal, clearVehicle } = useVehicle();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem, openCheckout } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Buy: open checkout modal immediately with default car mat configuration for selected vehicle
  const handleQuickBuy = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const mat = materials.find(m => m.id === product.materialId);
    const materialName = mat?.name || product.material?.name || 'Tailored Luxury Carpet (850g/m²)';
    const stitchingName = product.stitchingOptions?.[0]?.name || 'Standard Edge Binding';
    const heelPadName = product.heelPadOptions?.[0]?.name || 'Driver Reinforced Heelpad';
    const price = product.salePrice || product.basePrice;

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
          model: 'Standard UK Right-Hand Drive Spec',
          year: 'Current',
          variant: 'Standard RHD'
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
        materialName,
        colorName: product.defaultColor || 'Graphite Black',
        stitchingName,
        heelPadName,
        vehicleDetails: vehicle,
        customEmbroidery: undefined
      },
      false
    );

    openCheckout();
  };

  // Filter States
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceRange, setPriceRange] = useState<number>(100);

  useEffect(() => {
    async function loadShopData() {
      try {
        setLoading(true);
        const [prodData, matData] = await Promise.all([
          api.getProducts({
            materialId: selectedMaterial !== 'all' ? selectedMaterial : undefined,
            search: searchQuery.trim() || undefined
          }),
          api.getMaterials()
        ]);
        setProducts(prodData);
        setMaterials(matData);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, [selectedMaterial, searchQuery]);

  // Client-side sorting & price filtering
  const filteredProducts = products
    .filter(p => (p.salePrice || p.basePrice) <= priceRange)
    .sort((a, b) => {
      const priceA = a.salePrice || a.basePrice;
      const priceB = b.salePrice || b.basePrice;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // recommended
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Shop Custom Tailored Car Mats | Premium UK Fitment"
        description="Browse our range of tailored car mats: luxury deep pile carpet, prestige velour, all-weather rubber, and boot liners with custom trim and OEM clips."
        canonicalPath="/shop"
      />

      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
            Precision Tailored Catalog
          </span>
          <h1 className="text-3xl font-extrabold text-[#071A33] tracking-tight mt-1">
            Shop Custom Car Mats
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Every set is precision laser-cut and supplied with factory-compatible floor anchors.
          </p>
        </div>

        {/* Selected Vehicle Indicator Card */}
        {selectedVehicle ? (
          <div className="bg-[#071A33] text-white rounded-xl p-3.5 border border-amber-400/40 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0D2A4A] flex items-center justify-center text-amber-400">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">
                  {selectedVehicle.makeName} {selectedVehicle.modelName} ({selectedVehicle.yearRange})
                </p>
                <p className="text-[11px] text-amber-300">
                  {selectedVehicle.clipType || 'OEM Matching Pegs Included'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={openSelectorModal}
                className="px-2.5 py-1 bg-[#0D2A4A] hover:bg-[#153B66] text-amber-300 text-[11px] font-bold rounded"
              >
                Change
              </button>
              <button
                onClick={clearVehicle}
                title="Remove vehicle filter"
                className="p-1 text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={openSelectorModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#071A33] hover:bg-[#0D2A4A] text-amber-400 border border-amber-400/40 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Car className="w-4 h-4" />
            <span>Select Your Vehicle To Verify Fitment</span>
          </button>
        )}
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#071A33] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                Refine Selection
              </h3>
              {(selectedMaterial !== 'all' || searchQuery || priceRange < 100) && (
                <button
                  onClick={() => {
                    setSelectedMaterial('all');
                    setSearchQuery('');
                    setPriceRange(100);
                  }}
                  className="text-[11px] text-amber-600 hover:underline font-bold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Velour, Rubber, 4-Piece..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Material Grade Filter */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                Material Grade
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    selectedMaterial === 'all'
                      ? 'bg-[#071A33] text-amber-400'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>All Materials</span>
                </button>
                {materials.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      selectedMaterial === mat.id
                        ? 'bg-[#071A33] text-amber-400'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{mat.name}</span>
                    <span className="text-[10px] text-gray-400">{mat.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Max Price (£{priceRange})
                </label>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                step="5"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>£25</span>
                <span>£100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-gray-500">
              Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> tailored options
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <p className="text-sm font-bold text-gray-800">No products match your current filters.</p>
              <p className="text-xs text-gray-500">Try adjusting your price slider or material grade selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-400 transition-all hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      className="relative aspect-4/3 bg-gray-900 overflow-hidden cursor-pointer"
                      onClick={() => setCurrentTab('product', product.slug)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {product.salePrice && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded shadow uppercase">
                            Sale
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-[#071A33]/90 text-amber-300 text-[10px] font-bold rounded">
                          Free OEM Clips
                        </span>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                          isWishlisted(product.id)
                            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                            : 'bg-[#071A33]/80 text-gray-300 hover:text-white hover:bg-[#071A33]'
                        }`}
                        title={isWishlisted(product.id) ? 'Remove from saved wishlist' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {product.sku}
                      </div>
                      <h3
                        onClick={() => setCurrentTab('product', product.slug)}
                        className="text-sm font-bold text-[#071A33] group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Tailored Vehicle Indicator */}
                      {selectedVehicle && (
                        <div className="pt-1">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold max-w-full">
                            <Car className="w-3 h-3 text-amber-600 flex-shrink-0" />
                            <span className="truncate">
                              For {selectedVehicle.makeName} {selectedVehicle.modelName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Price</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-extrabold text-[#071A33]">
                            £{(product.salePrice || product.basePrice).toFixed(2)}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-gray-400 line-through">
                              £{product.basePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentTab('product', product.slug)}
                          className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#071A33] text-xs font-bold rounded-lg transition-all"
                          title="Customise materials, stitching, heel pad & embroidery"
                        >
                          Customise
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickBuy(e, product)}
                          className="px-3 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] text-xs font-extrabold rounded-lg transition-all shadow-md flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          title={
                            selectedVehicle
                              ? `Quick Buy default configuration for ${selectedVehicle.makeName} ${selectedVehicle.modelName}`
                              : 'Quick Buy default configuration'
                          }
                        >
                          <Zap className="w-3.5 h-3.5 fill-current text-[#071A33]" />
                          <span>Quick Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
