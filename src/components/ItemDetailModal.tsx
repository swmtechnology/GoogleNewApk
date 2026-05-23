/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Share2, Star, Check, Plus, Minus, Info, ClipboardList } from 'lucide-react';
import { Dish, Accompaniment } from '../types';

interface ItemDetailModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number, selectedAccompaniments: Accompaniment[], selectedOption?: { name: string; price: number }) => void;
}

export default function ItemDetailModal({ dish, isOpen, onClose, onAddToCart }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAccs, setSelectedAccs] = useState<Accompaniment[]>([]);
  const [selectedOption, setSelectedOption] = useState<typeof dish.options extends Array<infer U> ? U : undefined>(
    dish.options && dish.options.length > 0 ? dish.options[0] : undefined
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const basePrice = selectedOption ? selectedOption.price : dish.price;
  const accsPrice = selectedAccs.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = (basePrice + accsPrice) * quantity;

  const toggleAccompaniment = (acc: Accompaniment) => {
    if (selectedAccs.some(item => item.name === acc.name)) {
      setSelectedAccs(selectedAccs.filter(item => item.name !== acc.name));
    } else {
      setSelectedAccs([...selectedAccs, acc]);
    }
  };

  const shareItem = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
    if (navigator.share) {
      navigator.share({
        title: dish.name,
        text: dish.description,
        url: window.location.href
      }).catch(err => console.log(err));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4">
        {/* Background Overlay click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-surface-organic w-full max-w-2xl rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] md:max-h-[85dvh] flex flex-col z-10"
        >
          {/* Main Content Scroll Area */}
          <div className="flex-1 overflow-y-auto pb-32">
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 shadow-md flex items-center justify-center text-slate-300 hover:bg-neutral-200 transition-transform active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 rounded-full border shadow-md flex items-center justify-center transition-all active:scale-95 ${
                    isLiked ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-neutral-100 text-slate-300 border-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={shareItem}
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 shadow-md flex items-center justify-center text-slate-300 hover:bg-neutral-200 transition-transform active:scale-95 relative"
                >
                  <Share2 className="w-5 h-5" />
                  {isShared && (
                    <span className="absolute -top-8 right-0 bg-neutral-800 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-80 md:h-96 relative bg-neutral-200">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col gap-6">
              {/* Title & Core info */}
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight">
                    {dish.name}
                  </h1>
                  {/* Veg / Non-Veg badge */}
                  <div className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center p-0.5 shrink-0 mt-1.5 ${
                    dish.isVeg ? 'border-accent-green' : 'border-primary'
                  }`}>
                    {dish.isVeg ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                    ) : (
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-primary" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                  <span className="flex items-center gap-0.5 text-accent-saffron-on font-semibold">
                    <Star className="w-4 h-4 fill-accent-saffron text-accent-saffron shrink-0" />
                    {dish.rating}
                  </span>
                  <span>•</span>
                  <span>{dish.ratingsCount}</span>
                  <span>•</span>
                  <span>{dish.deliveryTime}</span>
                </div>

                <div className="text-xl font-display font-semibold text-neutral-800">
                  ₹{basePrice}
                </div>

                <p className="text-neutral-600 text-sm md:text-base leading-relaxed mt-3 border-l-4 border-primary/20 pl-3 italic bg-primary/5 py-2.5 rounded-r">
                  {dish.description}
                </p>
              </div>

              <hr className="border-t border-neutral-200" />

              {/* Sizes / Options (If any) */}
              {dish.options && dish.options.length > 0 && (
                <div>
                  <h2 className="font-display font-semibold text-lg text-neutral-800 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary shrink-0" />
                    Select Portion Size
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {dish.options.map(opt => (
                      <button
                        key={opt.name}
                        onClick={() => setSelectedOption(opt)}
                        className={`py-3 px-4 rounded-xl border-2 text-center transition-all ${
                          selectedOption?.name === opt.name 
                            ? 'border-primary bg-primary/5 text-primary font-semibold shadow-sm'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <div className="text-xs text-neutral-600">{opt.name}</div>
                        <div className="text-sm font-semibold text-neutral-800 mt-1">₹{opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Accompaniments checklist */}
              {dish.accompaniments && dish.accompaniments.length > 0 && (
                <div>
                  <h2 className="font-display font-semibold text-lg text-neutral-800 mb-3 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary shrink-0" />
                    Accompaniments
                  </h2>
                  <div className="flex flex-col gap-3">
                    {dish.accompaniments.map((acc) => {
                      const isSelected = selectedAccs.some(item => item.name === acc.name);
                      return (
                        <div
                          key={acc.name}
                          onClick={() => toggleAccompaniment(acc)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-accent-green rounded-sm flex items-center justify-center p-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-neutral-800">{acc.name}</p>
                              <p className="text-xs text-neutral-500">+₹{acc.price}</p>
                            </div>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-neutral-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dietary Tags list */}
              <div>
                <h2 className="font-display font-semibold text-sm text-neutral-800 mb-2.5 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  Dietary Info
                </h2>
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3.5 py-1 bg-surface-container text-neutral-400 text-xs font-semibold rounded-full border border-neutral-300/60 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-3.5 py-1 bg-emerald-500/10 text-accent-green text-xs font-semibold rounded-full border border-emerald-500/30 shadow-sm">
                    {dish.isVeg ? '100% Vegetarian' : 'Fresh Meat'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-neutral-100 hover:bg-neutral-100/95 border-t border-neutral-200 p-4 shadow-lg flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center bg-neutral-50 rounded-full h-12 px-2 border border-neutral-300">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-primary rounded-full hover:bg-neutral-200 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-display font-semibold text-primary w-8 text-center text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-primary rounded-full hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => {
                onAddToCart(dish, quantity, selectedAccs, selectedOption);
                onClose();
              }}
              className="flex-1 bg-primary text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-98 transition-all shadow-md shadow-primary/25"
            >
              <span>Add to Cart</span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <span>₹{totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
