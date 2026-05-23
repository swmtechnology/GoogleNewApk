/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  User, 
  Search, 
  Star, 
  ShoppingBag, 
  ChevronRight, 
  Plus, 
  Minus, 
  Utensils, 
  Receipt,
  Heart,
  ChevronLeft,
  Sparkles,
  Info
} from 'lucide-react';

import { DISHES, CATEGORIES, ADDRESSES } from './data';
import { Dish, CartItem, Order, Address, Accompaniment } from './types';
import ItemDetailModal from './components/ItemDetailModal';
import AIPrompt from './components/AIPrompt';
import CheckoutView from './components/CheckoutView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';

export default function App() {
  // Navigation & Page tabs: 'home' | 'menu' | 'checkout' | 'orders' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'checkout' | 'orders' | 'profile'>('home');
  
  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg'>('all');

  // Business state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<Address>(ADDRESSES[0]);

  // Modals & Focus states
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<Dish | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');

  // Auto-scroll or search focus triggers
  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('menu');
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActiveTab('menu');
    }
  };

  // Add Item to Cart (handling custom selected accompaniments and sizes nicely)
  const handleAddToCart = (
    dish: Dish,
    quantity: number,
    selectedAccompaniments: Accompaniment[],
    selectedOption?: { name: string; price: number }
  ) => {
    // Generate a unique card identifier
    const accompanimentsKey = selectedAccompaniments
      .map(a => a.name)
      .sort()
      .join('|');
    const optionKey = selectedOption ? selectedOption.name : 'standard';
    const cartId = `${dish.id}-${optionKey}-${accompanimentsKey}`;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.cartId === cartId);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartId,
            dish,
            quantity,
            selectedAccompaniments,
            selectedOption
          }
        ];
      }
    });
  };

  const updateCartQty = (cartId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => item.cartId === cartId ? { ...item, quantity } : item)
    );
  };

  // Immediate simple add from cards (defaults to standard size & no accompaniments)
  const handleQuickAdd = (dish: Dish) => {
    const defaultOption = dish.options && dish.options.length > 0 ? dish.options[0] : undefined;
    handleAddToCart(dish, 1, [], defaultOption);
  };

  const removeCartItem = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  // Placing continuous order
  const handlePlaceOrder = (paymentMethod: string, appliedCoupon: boolean) => {
    const orderId = `HND-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cart.reduce((total, item) => {
      const basePrice = item.selectedOption ? item.selectedOption.price : item.dish.price;
      const accsPrice = item.selectedAccompaniments.reduce((s, a) => s + a.price, 0);
      return total + (basePrice + accsPrice) * item.quantity;
    }, 0);

    const taxesAndCharges = parseFloat((subtotal * 0.05).toFixed(2));
    const deliveryFee = 45;
    const discount = appliedCoupon ? 50 : 0;
    const totalPayable = subtotal + deliveryFee + taxesAndCharges - discount;

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      subtotal,
      deliveryFee,
      taxesAndCharges,
      couponApplied: appliedCoupon ? { code: 'HANDI50', discount: 50 } : undefined,
      totalPayable,
      address: currentAddress.addressLine,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'Received'
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestOrderId(orderId);
    setCart([]);
    setShowOrderSuccess(true);
    
    // Automatically dismiss success and shift focus to Orders progression!
    setTimeout(() => {
      setShowOrderSuccess(false);
      setActiveTab('orders');
    }, 4000);
  };

  // Interactive Saved addresses addition/removal
  const handleAddAddress = (type: 'Home' | 'Work' | 'Other', line: string, mins: string) => {
    const nextId = `addr-${Date.now()}`;
    const newAddr: Address = { id: nextId, type, addressLine: line, deliveryTime: mins };
    setAddresses(prev => [...prev, newAddr]);
    setCurrentAddress(newAddr);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (currentAddress.id === id) {
        setCurrentAddress(filtered[0]);
      }
      return filtered;
    });
  };

  // Filtered dishes array for Menu catalog page
  const filteredDishes = DISHES.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;

    const matchesDiet = dietaryFilter === 'all' || 
                        (dietaryFilter === 'veg' && dish.isVeg) || 
                        (dietaryFilter === 'nonveg' && !dish.isVeg);

    return matchesSearch && matchesCategory && matchesDiet;
  });

  return (
    <div className="min-h-screen bg-surface-organic font-sans pb-24 md:pb-8 flex flex-col relative">

      {/* Global Header */}
      <header className="sticky top-0 left-0 w-full z-40 bg-surface-organic/95 backdrop-blur-md border-b border-surface-container h-16 md:h-20 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Header Back Button only if in detailed modal subviews */}
          {activeTab !== 'home' && (
            <button 
              onClick={() => setActiveTab('home')}
              className="md:hidden text-primary p-1.5 rounded-full hover:bg-neutral-200 transition-colors mr-1 cursor-pointer"
            >
              <ChevronLeft className="w-5.5 h-5.5" />
            </button>
          )}

          <div 
            onClick={() => {
              // Clicking location cycles addresses as a cool interaction!
              const nextIdx = (addresses.findIndex(a => a.id === currentAddress.id) + 1) % addresses.length;
              setCurrentAddress(addresses[nextIdx]);
            }}
            className="flex items-center gap-2 cursor-pointer group select-none"
            title="Click to cycle saved addresses!"
          >
            <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-display font-bold text-sm md:text-base text-neutral-800 line-clamp-1">
                {currentAddress.addressLine.split(',')[0]}
              </span>
              <p className="text-[10px] text-neutral-400 font-medium md:group-hover:text-primary transition-colors">
                Delivering to {currentAddress.type} ({currentAddress.deliveryTime})
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Header Navigation bar */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 items-center px-4">
          <button 
            onClick={() => setActiveTab('home')}
            className={`font-display font-semibold text-sm transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-primary' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`font-display font-semibold text-sm transition-colors cursor-pointer ${
              activeTab === 'menu' ? 'text-primary' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            Search Menu
          </button>
          <button 
            onClick={() => setActiveTab('checkout')}
            className={`font-display font-semibold text-sm transition-colors cursor-pointer relative ${
              activeTab === 'checkout' ? 'text-primary' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            Checkout
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-4 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-display font-semibold text-sm transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'text-primary' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            Orders Tracker
          </button>
        </nav>

        {/* Profile Avatar Trigger Button */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer select-none ${
            activeTab === 'profile' ? 'border-primary' : 'border-neutral-200 hover:border-primary/55'
          }`}
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5hTMqx5c-Q6QMxhhCoNWsKXawTdg9oqVyv6-tD9G37WjIcYLLTv5-XYZlo-HHP4LFJP9_gbZ8zgSxG6Cz8pm9_VXS6C4ycYNETjCbzm-U2SAmLdPGr2reyRvhPNv8q_3CqRnLUoOJNCsTlAduvVP0bjOsFz9zQ09DB65hQXyLaIIiPnQBjXqGirdnIuD3ZWTicTVkZ42zd7SoaLdaivs5MHn-ERO6TTPwEG8rFqpyqBOIFTs64unFobyX3jNKbv-PWOYmkAHp4V0" 
            alt="User avatar" 
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </button>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-4 md:pt-6">
        <AnimatePresence mode="wait">
          
          {/* HOME SCREEN TABS */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              {/* Promotional Header Info & Search banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="font-display font-extrabold text-3xl md:text-5xl text-primary leading-tight tracking-tight">
                    Handi Restaurant
                  </h1>
                  <p className="text-sm md:text-base text-neutral-500 mt-1">
                    Authentic slow-cooked Indian specials, individually prepared in earthen clay pots.
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search for Handi specialties..."
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-neutral-200 outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm text-sm"
                  />
                </div>
              </div>

              {/* Core Hero Banner container */}
              <div 
                onClick={() => handleCategoryClick('specials')}
                className="relative rounded-2xl overflow-hidden shadow-lg h-52 md:h-72 bg-neutral-200 cursor-pointer group"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrLvCHgLrRJgdTuCUGdC5sELFkiIXH_WIFh2tOFj8G-IifoqB8Fp3xYAfyoSveNoBaOLhuWm7LL9bm3Ee-P5VdF8ulUJpIrKFq-Xzs0l9XueIKC7BA3MVEUg_g3dW2vpcELkDcY-mPZaxTSUkf3PWH8nSAlvYlljG14u9mKqg4HNjkXUN4dfE0hcQeZXJHF_9nrSAvT-piay9AsA63qlV-5_hpCdx_bR65sRVqbiHdV-flKpQ0ApYERSe5agAFTZWvxDI0ZXmUWGU" 
                  alt="Special handi biryani"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent p-6 flex flex-col justify-center select-none" />
                <div className="absolute inset-x-0 bottom-0 top-0 p-6 flex flex-col justify-center z-10 select-none">
                  <span className="inline-block px-3 py-1 bg-accent-saffron text-accent-saffron-on font-semibold text-xs rounded-full mb-3 w-max">
                    Offer of the Day
                  </span>
                  <h2 className="font-display font-extrabold text-white text-2xl md:text-4xl mb-2 max-w-[80%] leading-tight">
                    50% Off on First Order
                  </h2>
                  <p className="text-white/85 text-xs md:text-sm max-w-[70%] font-medium">
                    Experience the true magic of Heritage cooking. Use automatic coupon code <strong className="text-accent-saffron">HANDI50</strong> during check out.
                  </p>
                </div>
              </div>

              {/* Magic AI Helper Assistant widget right on home! */}
              <AIPrompt 
                cart={cart} 
                onQuickAdd={(dish) => {
                  setSelectedDishForDetail(dish);
                }} 
                availableDishes={DISHES}
              />

              {/* Horizontal Category circles */}
              <section className="mt-2">
                <h3 className="font-display font-bold text-lg text-neutral-800 mb-4">
                  Categories
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
                  {CATEGORIES.map((cat) => {
                    const sampleImg = cat.id === 'specials' 
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrLvCHgLrRJgdTuCUGdC5sELFkiIXH_WIFh2tOFj8G-IifoqB8Fp3xYAfyoSveNoBaOLhuWm7LL9bm3Ee-P5VdF8ulUJpIrKFq-Xzs0l9XueIKC7BA3MVEUg_g3dW2vpcELkDcY-mPZaxTSUkf3PWH8nSAlvYlljG14u9mKqg4HNjkXUN4dfE0hcQeZXJHF_9nrSAvT-piay9AsA63qlV-5_hpCdx_bR65sRVqbiHdV-flKpQ0ApYERSe5agAFTZWvxDI0ZXmUWGU'
                      : cat.id === 'soups'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOgjQ5DyQaFi8I5Yxmzo-d85LSuT5wu2gNzEvAkCADDgGqjdytqaOpzJoWG-0GtkYc2JOPe_xDhMcGt9R82EV4ng6uhkxH982KguW8XesVo7o0Bu1rZi-WA4ksUMDMLMViuZHmC_SrtdhklFfDb41ogwItHA8ZbkSFlUUOPBuzaoIreWiz2fB3rx0DWX_cy3BO_YfcOcl06Mqzh-V_0HQk2td0SoKECcp0AgMMIITTZpu8utiLPDiN2zferurhJiE5Q669UC8Nqbg'
                      : cat.id === 'starters'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-QNbzh1ybaQ-ycTCblNwWpAWDsXyriVKYCu5vUleqTO1qR3D3EKCY8ZEvky78zS-kZB84S6K6ztoAsN5rDX3n12bWKi5vXUdwHmOuUibKMP3cuyalhLsaJnYnJYSejRJvykwERi45FrkWWce9RV2CeTfjwrC7mkiqJ6ugV6GMdC2lKzUO-p5iAXbDFV2HXnfFNi_dpCnprsoNdYCoZ0h70-eIYoRhgM6HZj5hqHiqOiAQhK-1Tej3h3p5gy-2VdQpfdtCdBxYCtk'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbd-_ld7e8tbXruOnpzlFKYnE_mkVPYF1yMVtEUqinK6rBgftCVFQVXZ8_e45X8ngWJHSxr3jHPJnAdS_4cdpD_XtNC772-89hGX1S9XrXk4oePyoYmd68zz8_atXEfqFwmRH9lEfz3WehwmjnSnaVZO_SqjB5gDr3Owgx1PtSboTDEwU_QcYPJftLBX1qUqlwi0qqwyhQIcwRQo4xNREkZ1y_UagThMutQ7s23MRSfZPLWTwhiZfZWSU4ely1YHX7FDE-4U0PWks';

                    return (
                      <div 
                        key={cat.id} 
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
                      >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xs border hover:border-primary transition-all relative overflow-hidden p-0.5">
                          <img 
                            src={sampleImg} 
                            alt={cat.name} 
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-semibold text-neutral-700 text-center select-none group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Must Try Specials list */}
              <section className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-display font-bold text-lg text-neutral-800">
                    Must Try Handi Specials
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveTab('menu');
                    }}
                    className="text-xs font-semibold text-primary hover:underline hover:text-neutral-800 cursor-pointer"
                  >
                    View All Menu
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DISHES.slice(0, 3).map((dish) => {
                    const isVeg = dish.isVeg;
                    return (
                      <div 
                        key={dish.id} 
                        className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-lg hover:border-neutral-300 transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Image box with overlay */}
                          <div className="h-48 bg-neutral-100 relative cursor-pointer" onClick={() => setSelectedDishForDetail(dish)}>
                            <img 
                              src={dish.image} 
                              alt={dish.name}
                              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Star rating label overlay */}
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-neutral-100 font-semibold select-none">
                              <Star className="w-3.5 h-3.5 fill-accent-saffron text-accent-saffron shrink-0" />
                              <span className="text-[10px] text-neutral-800">{dish.rating}</span>
                            </div>
                          </div>

                          <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 
                                onClick={() => setSelectedDishForDetail(dish)}
                                className="font-display font-bold text-base text-neutral-800 line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                              >
                                {dish.name}
                              </h4>
                              {/* Square Veg/Non-Veg Badge */}
                              <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center p-[2px] shrink-0 mt-1 ${isVeg ? 'border-accent-green' : 'border-primary'}`}>
                                {isVeg ? (
                                  <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                                ) : (
                                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-primary" />
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        {/* Price & Add Button bar */}
                        <div className="p-4 pt-0 flex justify-between items-center bg-white">
                          <span className="font-display font-bold text-primary text-lg">
                            ₹{dish.price}
                          </span>
                          <button 
                            onClick={() => setSelectedDishForDetail(dish)}
                            className="bg-primary hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2 rounded-full shadow-xs hover:shadow-md cursor-pointer transition-all active:scale-95"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

            </motion.div>
          )}

          {/* CATALOG / SEARCH MENU TAB */}
          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              {/* Filter Row */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                {/* Embedded query bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Handi specialities..."
                    className="w-full h-12 pl-12 pr-4 rounded-full border border-neutral-200 outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-xs text-sm bg-white"
                  />
                </div>

                {/* Tag Button Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
                  <button 
                    onClick={() => setDietaryFilter('all')}
                    className={`h-11 px-5 rounded-full border-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      dietaryFilter === 'all' 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    All Items
                  </button>
                  <button 
                    onClick={() => setDietaryFilter('veg')}
                    className={`h-11 px-5 rounded-full border-2 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      dietaryFilter === 'veg' 
                        ? 'bg-accent-green-container border-accent-green-container text-white shadow-md' 
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-accent-green'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 bg-accent-green border border-white rounded-full" />
                    Veg Only
                  </button>
                  <button 
                    onClick={() => setDietaryFilter('nonveg')}
                    className={`h-11 px-5 rounded-full border-2 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      dietaryFilter === 'nonveg' 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-md' 
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary'
                    }`}
                  >
                    <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-primary mt-0.5" />
                    Non-Veg Only
                  </button>
                </div>
              </div>

              {/* Bento layout (Left Sidebar on desktop, main list on right) */}
              <div className="grid grid-cols-4 md:grid-cols-12 gap-8 items-start mt-2">
                
                {/* Grid Category Navigation Sidebar */}
                <aside className="hidden md:block md:col-span-3 sticky top-24 max-h-[calc(100vh-8rem)]">
                  <div className="font-display font-extrabold text-neutral-800 text-sm tracking-wider uppercase mb-3 px-1">
                    Menu Categories
                  </div>
                  <nav className="flex flex-col gap-2 bg-white p-3 rounded-2xl border">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left py-3 px-4 rounded-xl font-semibold text-xs md:text-sm transition-all select-none cursor-pointer flex items-center justify-between border-l-4 ${
                          selectedCategory === cat.id 
                            ? 'bg-surface-organic text-primary border-primary font-bold shadow-xs' 
                            : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === cat.id && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Main scrollable dishes grid */}
                <div className="col-span-4 md:col-span-9 flex flex-col gap-8">
                  {CATEGORIES.filter(cat => selectedCategory === 'all' || cat.id === selectedCategory).map((cat) => {
                    const categoryDishes = filteredDishes.filter(dish => dish.category === cat.id);
                    if (categoryDishes.length === 0) return null;

                    return (
                      <section key={cat.id} className="flex flex-col gap-4">
                        <h2 className="font-display font-extrabold text-xl text-neutral-800 flex items-center gap-3">
                          <span>{cat.name}</span>
                          <span className="h-px bg-neutral-200 flex-1" />
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {categoryDishes.map((dish) => {
                            const isVeg = dish.isVeg;
                            return (
                              <div 
                                key={dish.id} 
                                className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all overflow-hidden flex flex-col justify-between"
                              >
                                <div>
                                  {/* Dish Image overlay */}
                                  <div 
                                    className="h-44 relative bg-neutral-100 cursor-pointer overflow-hidden"
                                    onClick={() => setSelectedDishForDetail(dish)}
                                  >
                                    <img 
                                      src={dish.image} 
                                      alt={dish.name}
                                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Star rating overlay */}
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-neutral-100 font-semibold text-xs select-none">
                                      <Star className="w-3.5 h-3.5 fill-accent-saffron text-accent-saffron shrink-0" />
                                      <span>{dish.rating}</span>
                                    </div>
                                  </div>

                                  <div className="p-4 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start gap-2">
                                      <h3 
                                        onClick={() => setSelectedDishForDetail(dish)}
                                        className="font-display font-bold text-base text-neutral-800 line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                                      >
                                        {dish.name}
                                      </h3>
                                      {/* Badge */}
                                      <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center p-[2px] shrink-0 mt-0.5 ${isVeg ? 'border-accent-green' : 'border-primary'}`}>
                                        {isVeg ? (
                                          <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                                        ) : (
                                          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-primary" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Tag elements */}
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      {dish.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>

                                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                                      {dish.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Bottom Price / Portion sizes action bar */}
                                <div className="p-4 pt-0 flex justify-between items-center bg-white">
                                  <div className="flex flex-col">
                                    <span className="font-display font-bold text-primary text-base">
                                      ₹{dish.price}
                                    </span>
                                    {dish.options && (
                                      <span className="text-[10px] text-neutral-400 font-medium">Multiple portions</span>
                                    )}
                                  </div>
                                  
                                  <button 
                                    onClick={() => setSelectedDishForDetail(dish)}
                                    className="bg-primary hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-xs active:scale-95 cursor-pointer transition-transform"
                                  >
                                    Add
                                  </button>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}

                  {/* Empty search feedback */}
                  {filteredDishes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                      <Utensils className="w-12 h-12 text-neutral-300 animate-pulse mb-3" />
                      <p className="font-bold text-base text-neutral-700">No matching dishes found</p>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                        Try modifying your query or filters to discover amazing Indian specialties.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* CHECKOUT TAB */}
          {activeTab === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CheckoutView
                cart={cart}
                addresses={addresses}
                currentAddress={currentAddress}
                onChangeAddress={setCurrentAddress}
                onUpdateCartItemQty={updateCartQty}
                onRemoveCartItem={removeCartItem}
                onAddMoreItems={() => setActiveTab('menu')}
                onPlaceOrder={handlePlaceOrder}
              />
            </motion.div>
          )}

          {/* ORDERS TRACKER TAB */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <OrdersView
                orders={orders}
                onExploreMenu={() => setActiveTab('menu')}
              />
            </motion.div>
          )}

          {/* PROFILE MANAGEMENT TAB */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ProfileView
                addresses={addresses}
                onAddAddress={handleAddAddress}
                onDeleteAddress={handleDeleteAddress}
                userEmail="sawaimadhopur.help@gmail.com"
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation (Simulating Native shell for mob / tabs) */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 h-20 md:hidden flex justify-around items-center px-4 pb-safe shadow-xl select-none">
        
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' 
              ? 'text-primary bg-primary/10 font-bold scale-102 font-serif' 
              : 'text-neutral-500 hover:text-primary'
          }`}
        >
          <Utensils className="w-5.5 h-5.5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        <button 
          onClick={() => {
            setSelectedCategory('all');
            setActiveTab('menu');
          }}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'menu' 
              ? 'text-primary bg-primary/10 font-bold scale-102' 
              : 'text-neutral-500 hover:text-primary'
          }`}
        >
          <Search className="w-5.5 h-5.5" />
          <span className="text-[10px] font-semibold mt-1">Menu</span>
        </button>

        <button 
          onClick={() => setActiveTab('checkout')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'checkout' 
              ? 'text-primary bg-primary/10 font-bold scale-102' 
              : 'text-neutral-500 hover:text-primary'
          }`}
        >
          <ShoppingBag className="w-5.5 h-5.5" />
          <span className="text-[10px] font-semibold mt-1">Cart</span>
          {cart.length > 0 && (
            <span className="absolute top-1.5 right-2 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders' 
              ? 'text-primary bg-primary/10 font-bold scale-102' 
              : 'text-neutral-500 hover:text-primary'
          }`}
        >
          <Receipt className="w-5.5 h-5.5" />
          <span className="text-[10px] font-semibold mt-1">Orders</span>
          {orders.length > 0 && orders.some(o => o.status !== 'Delivered') && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-accent-saffron" />
          )}
        </button>

      </nav>

      {/* Global Customizable Item detail drawer / Modal overlays */}
      <ItemDetailModal
        dish={selectedDishForDetail!}
        isOpen={!!selectedDishForDetail}
        onClose={() => setSelectedDishForDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Modern Order placed celebration Overlay modal */}
      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-50 overflow-hidden select-none"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center gap-4 max-w-sm"
            >
              <div className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center shadow-lg relative mt-2 text-center">
                <Sparkles className="w-10 h-10 animate-bounce fill-current text-primary" />
              </div>
              
              <h2 className="font-display font-black text-3xl text-white tracking-tight mt-2">
                Order Confirmed!
              </h2>
              
              <p className="text-white/80 text-sm leading-relaxed">
                Your order <strong className="text-accent-saffron">#{latestOrderId}</strong> has been received by our traditional clay-pot master master cooks.
              </p>
              
              <p className="text-xs text-accent-saffron font-bold animate-pulse uppercase tracking-wider mt-2.5">
                Switching to Real-Time Tracker...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
