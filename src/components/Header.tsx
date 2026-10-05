import React, { useState } from 'react';
import { Car, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, Phone, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useVehicle } from '../context/VehicleContext.tsx';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string, param?: string) => void;
}

export function Header({ currentTab, setCurrentTab }: HeaderProps) {
  const { user, logout } = useAuth();
  const { itemCount, openCartDrawer } = useCart();
  const { selectedVehicle, clearVehicle, openSelectorModal } = useVehicle();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Mats' },
    { id: 'selector', label: 'Find Your Car', onClick: () => openSelectorModal() },
    { id: 'track', label: 'Track Order' },
    { id: 'materials', label: 'Materials Guide' },
    { id: 'about', label: 'About Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'blog', label: 'Guides & Care' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071A33] border-b border-[#0D2A4A] shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#040D1A] text-xs text-gray-300 py-1.5 px-4 border-b border-[#0D2A4A]/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              FREE UK Delivery on Orders Over £49
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Precision Laser-Fit Guarantee
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setCurrentTab('track')}
              className="hidden sm:inline-flex items-center gap-1.5 text-amber-300/90 hover:text-amber-300 transition-colors cursor-pointer font-medium"
            >
              <span>Track My Order</span>
            </button>
            <span className="text-gray-500 hidden sm:inline">•</span>
            <a
              href="tel:08004880244"
              className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>0800 488 0244</span>
            </a>
            <span className="text-gray-500 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-medium tracking-wider text-gray-400">UK Made</span>
              <span className="text-sm">🇬🇧</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentTab('home')}
              className="text-left group flex items-center gap-3 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0D2A4A] to-[#040D1A] border border-amber-400/30 flex items-center justify-center shadow-inner group-hover:border-amber-400 transition-all">
                <Car className="w-6 h-6 text-amber-400 group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <span className="block text-xl font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  CUSTOM CAR MATS
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-400/90 -mt-0.5">
                  Tailored British Luxury
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick();
                    } else {
                      setCurrentTab(link.id);
                    }
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === link.id
                      ? 'text-amber-400 bg-[#0D2A4A]'
                      : 'text-gray-200 hover:text-white hover:bg-[#0D2A4A]/50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Active Vehicle Badge or Selector Trigger */}
            {selectedVehicle ? (
              <div className="hidden sm:flex items-center bg-[#0D2A4A] border border-amber-400/40 rounded-lg px-2.5 py-1 text-xs">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold text-white truncate max-w-[130px] lg:max-w-[180px]">
                    {selectedVehicle.makeName} {selectedVehicle.modelName}
                  </span>
                </div>
                <button
                  onClick={openSelectorModal}
                  className="text-amber-400 hover:text-amber-300 font-medium underline text-[11px] mr-1.5"
                >
                  Change
                </button>
                <button
                  onClick={clearVehicle}
                  title="Clear vehicle filter"
                  className="text-gray-400 hover:text-red-400 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openSelectorModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D2A4A] text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-[#071A33] transition-all"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Select Your Car</span>
              </button>
            )}

            {/* Account Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:text-white hover:bg-[#0D2A4A] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline text-xs font-medium text-gray-200 truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0D2A4A] border border-[#1D3B63] rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#1D3B63]">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          setCurrentTab('account');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-[#071A33] hover:text-amber-400 transition-colors"
                      >
                        My Orders & Profile
                      </button>
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#071A33] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCurrentTab('auth')}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-gray-200 hover:text-white hover:bg-[#0D2A4A] transition-colors text-xs font-medium"
                >
                  <UserIcon className="w-4 h-4 text-gray-300" />
                  <span className="hidden md:inline">Account</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-lg bg-amber-400 text-[#071A33] hover:bg-amber-300 transition-all font-semibold shadow-sm flex items-center justify-center"
              aria-label="View shopping basket"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#071A33]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#0D2A4A] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071A33] border-t border-[#0D2A4A] px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Vehicle Button */}
          <div className="pb-3 border-b border-[#0D2A4A]">
            {selectedVehicle ? (
              <div className="flex items-center justify-between p-2.5 bg-[#0D2A4A] rounded-lg border border-amber-400/30">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-white font-semibold">
                    {selectedVehicle.makeName} {selectedVehicle.modelName} ({selectedVehicle.yearRange})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSelectorModal();
                  }}
                  className="text-xs text-amber-400 font-bold"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSelectorModal();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-[#071A33] font-bold rounded-lg text-xs flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                Select Your Vehicle Make & Model
              </button>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-1 pt-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.onClick) {
                    link.onClick();
                  } else {
                    setCurrentTab(link.id);
                  }
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentTab === link.id
                    ? 'text-amber-400 bg-[#0D2A4A]'
                    : 'text-gray-300 hover:text-white hover:bg-[#0D2A4A]/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#0D2A4A] flex justify-between items-center text-xs text-gray-400">
            <span>Customer Service: 0800 488 0244</span>
            <span>🇬🇧 UK Made</span>
          </div>
        </div>
      )}
    </header>
  );
}
