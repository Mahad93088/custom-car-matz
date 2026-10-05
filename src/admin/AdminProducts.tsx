import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Check, X, Search, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Product } from '../types/index.ts';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState('44.99');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('100');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [materialId, setMaterialId] = useState('mat_luxury');
  const [defaultColor, setDefaultColor] = useState('Graphite Black');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreating(false);
    setName(prod.name);
    setSku(prod.sku);
    setBasePrice(prod.basePrice.toString());
    setSalePrice(prod.salePrice ? prod.salePrice.toString() : '');
    setStock(prod.stock.toString());
    setIsPublished(prod.isPublished);
    setIsFeatured(prod.isFeatured);
    setMaterialId(prod.materialId);
    setDefaultColor(prod.defaultColor);
    setDescription(prod.description);
    setImageUrl(prod.images[0] || '');
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setName('');
    setSku('CCM-' + Math.floor(100 + Math.random() * 900));
    setBasePrice('39.99');
    setSalePrice('');
    setStock('250');
    setIsPublished(true);
    setIsFeatured(false);
    setMaterialId('mat_luxury');
    setDefaultColor('Black');
    setDescription('Precision engineered custom car mats with laser-cut dimensions.');
    setImageUrl('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      sku,
      basePrice: parseFloat(basePrice),
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      stock: parseInt(stock, 10),
      isPublished,
      isFeatured,
      materialId,
      defaultColor,
      description,
      images: [imageUrl],
      features: [
        '100% precision fit using 3D laser-mapped scans',
        'Includes front and rear tailored mats',
        'Factory retention clips pre-fitted',
        'Handcrafted in Great Britain'
      ],
      specifications: {
        'Origin': 'Made in West Midlands, UK',
        'Fixing System': 'OEM Stud Retainers Included',
        'Warranty': '2-Year Manufacturer Guarantee'
      }
    };

    try {
      if (editingProduct) {
        await api.admin.updateProduct(editingProduct.id, payload);
      } else {
        await api.admin.createProduct(payload);
      }
      setEditingProduct(null);
      setIsCreating(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Product CMS Management</h1>
          <p className="text-xs text-gray-500">
            Create, edit pricing, manage stock, and publish tailored car mat lines.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Line</span>
        </button>
      </div>

      {/* Editor Modal / Panel */}
      {(isCreating || editingProduct) && (
        <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-sm text-[#071A33]">
              {isCreating ? 'Create New Product' : `Edit: ${editingProduct?.name}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingProduct(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Base Price (£) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Sale Price (£, Optional)</label>
              <input
                type="number"
                step="0.01"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                placeholder="Leave blank if not on sale"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Material Specification</label>
              <select
                value={materialId}
                onChange={e => setMaterialId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              >
                <option value="mat_standard">Standard 650g Tufted Carpet</option>
                <option value="mat_luxury">Luxury 850g Deep Pile</option>
                <option value="mat_prestige">Prestige 1200g Executive Velour</option>
                <option value="mat_rubber">Heavy Duty 3mm All-Weather Rubber</option>
                <option value="mat_diamond">Diamond Quilted Faux Leather</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Inventory / Raw Stock Units</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Product Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Primary Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="font-bold">Published Live in Public Store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="font-bold">Featured on Homepage</span>
              </label>
            </div>

            <div className="sm:col-span-2 pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#071A33] text-amber-400 font-bold rounded-lg hover:bg-amber-400 hover:text-[#071A33]"
              >
                Save Product to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by title or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            />
          </div>
          <span className="text-xs text-gray-400 font-semibold">{filtered.length} products total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.defaultColor}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-gray-600 font-bold">{p.sku}</td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-[#071A33]">
                      £{(p.salePrice || p.basePrice).toFixed(2)}
                    </span>
                    {p.salePrice && (
                      <span className="text-[10px] text-gray-400 line-through block">
                        £{p.basePrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock < 50 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3.5">
                    {p.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 text-gray-600 hover:text-amber-600 bg-gray-100 rounded-lg"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
