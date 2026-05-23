/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, MapPin, Mail, Sparkles, ChefHat, Plus, Trash2, Heart, ShieldAlert } from 'lucide-react';
import { Address } from '../types';

interface ProfileViewProps {
  addresses: Address[];
  onAddAddress: (type: 'Home' | 'Work' | 'Other', line: string, mins: string) => void;
  onDeleteAddress: (id: string) => void;
  userEmail: string;
}

export default function ProfileView({
  addresses,
  onAddAddress,
  onDeleteAddress,
  userEmail
}: ProfileViewProps) {
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newLine, setNewLine] = useState('');
  const [newMins, setNewMins] = useState('30-40 mins');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine.trim()) return;
    onAddAddress(newType, newLine, newMins);
    setNewLine('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-20 mt-4">
      
      {/* Profile Header Card */}
      <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/25 bg-neutral-100 flex items-center justify-center relative shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5hTMqx5c-Q6QMxhhCoNWsKXawTdg9oqVyv6-tD9G37WjIcYLLTv5-XYZlo-HHP4LFJP9_gbZ8zgSxG6Cz8pm9_VXS6C4ycYNETjCbzm-U2SAmLdPGr2reyRvhPNv8q_3CqRnLUoOJNCsTlAduvVP0bjOsFz9zQ09DB65hQXyLaIIiPnQBjXqGirdnIuD3ZWTicTVkZ42zd7SoaLdaivs5MHn-ERO6TTPwEG8rFqpyqBOIFTs64unFobyX3jNKbv-PWOYmkAHp4V0" 
            alt="User avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display font-bold text-xl text-neutral-800">
            Guest Epicurean
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-neutral-500 text-xs md:text-sm mt-1">
            <Mail className="w-4 h-4 shrink-0 text-primary/70" />
            <span>{userEmail || 'sawaimadhopur.help@gmail.com'}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 mt-3.5">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] md:text-xs font-bold rounded-full">
              Gold Tier Patron
            </span>
            <span className="px-3 py-1 bg-accent-saffron/15 text-accent-saffron-on text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-accent-saffron-on" />
              1350 Points
            </span>
          </div>
        </div>
      </section>

      {/* Address Management section */}
      <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="font-display font-bold text-base text-neutral-800 flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-primary" />
            Saved Addresses
          </h3>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-primary hover:text-neutral-800 font-bold text-xs md:text-sm flex items-center gap-1"
            >
              <Plus className="w-4.5 h-4.5" />
              Add New
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-surface-organic p-4 rounded-xl border border-neutral-200 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
              <span>Category</span>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)} 
                className="text-neutral-400 hover:text-primary"
              >
                Cancel
              </button>
            </div>

            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 text-center transition-all ${
                    newType === t 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Full Delivery Address</label>
              <input
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                placeholder="A-45, Connaught Place Inner Circle, Near Regal Cinema..."
                className="w-full text-xs p-3 rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Simulated Duration</label>
                <input
                  value={newMins}
                  onChange={(e) => setNewMins(e.target.value)}
                  placeholder="30-40 mins"
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 bg-white focus:border-primary outline-neutral-300"
                />
              </div>
              <button
                type="submit"
                className="self-end h-[38px] bg-primary text-white font-semibold rounded-lg text-xs hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* List of saved addresses */}
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              className="p-4 rounded-xl bg-surface-organic/40 border border-neutral-200/60 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5.5 h-5.5 text-neutral-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-neutral-800">{addr.type}</p>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{addr.addressLine}</p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-1">{addr.deliveryTime}</p>
                </div>
              </div>

              {/* Prevent deleting last address so checkout doesn't crash */}
              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteAddress(addr.id)}
                  className="text-neutral-400 hover:text-primary transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Culinary Info Card */}
      <section className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <ChefHat className="w-6 h-6 shrink-0" />
          <h3 className="font-display font-bold text-sm md:text-base">Modern Heritage Kitchen</h3>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed font-sans">
          Welcome to Handi Restaurant! We believe that the vessel is as important as the recipe. Every single one of our specials is slow-cooked individually in traditional hand-spun earthen clay pots (Handis), allowing natural flavors to breathe, circulate, and seal under raw dough lidding. Enjoy authentic culinary practices delivered hot to your doorstep.
        </p>
      </section>

    </div>
  );
}
