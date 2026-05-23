/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, AlertCircle, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Dish } from '../types';

interface AIPromptProps {
  cart: CartItem[];
  currentSelection?: Dish;
  onQuickAdd: (dish: Dish) => void;
  availableDishes: Dish[];
}

export default function AIPrompt({ cart, currentSelection, onQuickAdd, availableDishes }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { text: "Suggest spicy non-veg starters", emoji: "🌶️" },
    { text: "Help me choose a creamy veg dinner", emoji: "🍲" },
    { text: "What matches with Butter Chicken?", emoji: "🫓" },
    { text: "Is Traditional Biryani spicy?", emoji: "🍚" }
  ];

  const handleSuggest = async (customPrompt: string) => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          cart,
          currentSelection
        })
      });

      if (!res.ok) {
        throw new Error('Our chefs are currently busy. Please try again in a few moments.');
      }

      const data = await res.json();
      setResponse(data.text || 'I recommend checking out our Murgh Handi Lazeez or Paneer Handi Khas!');
    } catch (err: any) {
      setError(err?.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, loading]);

  // Helper function to link found dishes in AI text response and render nicely as horizontal clickable chips
  const extractAndMatchDishes = (text: string): Dish[] => {
    if (!text) return [];
    return availableDishes.filter(dish => 
      text.toLowerCase().includes(dish.name.toLowerCase())
    );
  };

  const matchedDishes = extractAndMatchDishes(response);

  return (
    <div className="bg-white/80 backdrop-blur border border-primary/30 rounded-2xl p-5 shadow-lg shadow-primary/5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary-container">
            <Sparkles className="w-5 h-5 fill-current animate-pulse text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm md:text-base text-neutral-800">
              Ask Chef AI Assistant
            </h3>
            <p className="text-xs text-neutral-400">Instant expert food pairings & customizations</p>
          </div>
        </div>
        {loading && (
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
        )}
      </div>

      {/* Suggested quick items */}
      {!response && !loading && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-neutral-400">Quick suggestions:</p>
          <div className="grid grid-cols-2 gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p.text}
                onClick={() => {
                  setPrompt(p.text);
                  handleSuggest(p.text);
                }}
                className="text-left text-xs bg-surface-organic hover:bg-neutral-100 border border-neutral-200 p-2.5 rounded-xl flex items-start gap-1.5 transition-all active:scale-98"
              >
                <span>{p.emoji}</span>
                <span className="text-neutral-300 font-medium line-clamp-1">{p.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI response content */}
      <AnimatePresence mode="wait">
        {(response || loading || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface-organic/80 border border-neutral-200/50 rounded-xl p-4 flex flex-col gap-3 min-h-[50px] relative overflow-hidden"
          >
            {error ? (
              <div className="flex items-start gap-2.5 text-primary text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <p className="font-medium leading-normal">{error}</p>
              </div>
            ) : loading ? (
              <div className="flex flex-col gap-2 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-neutral-400 font-display font-medium text-xs">AI is matching spices...</span>
                </div>
                <div className="h-1.5 bg-neutral-200 rounded overflow-hidden">
                  <div className="bg-primary h-full animate-[shimmer_1.5s_infinite]" style={{ width: '40%' }} />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans"
              >
                <Quote className="w-6 h-6 text-primary/10 absolute top-2 right-2 rotate-180" />
                
                {/* Parse key list structure in AI output for rendering visually */}
                <div className="space-y-1.5 whitespace-pre-line">
                  {response.split('\n').map((line, idx) => {
                    const cleanLine = line.trim();
                    if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 pl-2">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          <span>{cleanLine.substring(1).trim()}</span>
                        </div>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {/* matched interactive items preview */}
                {matchedDishes.length > 0 && (
                  <div className="mt-4 border-t border-neutral-200 pt-3">
                    <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                      Menu Items Mentioned:
                    </p>
                    <div className="flex flex-col gap-2">
                      {matchedDishes.map((dish) => (
                        <div key={dish.id} className="flex justify-between items-center bg-neutral-50 p-2 border border-neutral-200 rounded-xl shadow-xs">
                          <div className="flex items-center gap-2">
                            <img 
                              src={dish.image} 
                              alt={dish.name} 
                              className="w-10 h-10 object-cover rounded-lg shrink-0 border border-neutral-300"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-xs text-neutral-800 line-clamp-1">{dish.name}</p>
                              <p className="text-[10px] text-neutral-400">₹{dish.price} • {dish.deliveryTime}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onQuickAdd(dish)}
                            className="bg-primary hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
                          >
                            Quick Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <div ref={responseEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSuggest(prompt);
        }}
        className="relative flex items-center gap-1 bg-surface-organic rounded-full border border-neutral-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary pl-4 pr-1.5 py-1.5 shadow-xs transition-shadow"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Suggest mild vegetarian dishes..."
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-neutral-300 outline-none border-0 p-0 focus:ring-0 placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-primary active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
