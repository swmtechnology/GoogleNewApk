/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, ShoppingBag, CreditCard, PlusCircle, Trash2, ArrowLeft, ArrowRight, Tag, Milestone, Landmark } from 'lucide-react';
import { CartItem, Address, Accompaniment } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  addresses: Address[];
  currentAddress: Address;
  onChangeAddress: (addr: Address) => void;
  onUpdateCartItemQty: (cartId: string, quantity: number) => void;
  onRemoveCartItem: (cartId: string) => void;
  onAddMoreItems: () => void;
  onPlaceOrder: (paymentMethod: string, appliedCoupon: boolean) => void;
}

export default function CheckoutView({
  cart,
  addresses,
  currentAddress,
  onChangeAddress,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onAddMoreItems,
  onPlaceOrder
}: CheckoutViewProps) {
  const [selectedPayment, setSelectedPayment] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [couponApplied, setCouponApplied] = useState(true);
  const [isChangingAddr, setIsChangingAddr] = useState(false);

  // Helper calculated totals
  const itemTotal = cart.reduce((total, item) => {
    const basePrice = item.selectedOption ? item.selectedOption.price : item.dish.price;
    const accsPrice = item.selectedAccompaniments.reduce((sum, acc) => sum + acc.price, 0);
    return total + (basePrice + accsPrice) * item.quantity;
  }, 0);

  const deliveryFee = 45;
  const taxesAndCharges = parseFloat((itemTotal * 0.05).toFixed(2));
  const couponDiscount = couponApplied ? 50 : 0;
  const totalPayable = Math.max(0, itemTotal + deliveryFee + taxesAndCharges - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-lg text-neutral-800">Your order is empty</h2>
        <p className="text-sm text-neutral-500 mt-2">
          Head back to our menu to discover clay-pot Handi specialties!
        </p>
        <button
          onClick={onAddMoreItems}
          className="mt-6 bg-primary text-white font-semibold py-3 px-6 rounded-xl shadow-md cursor-pointer hover:bg-neutral-800 active:scale-95 transition-all w-full"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4 pb-20">
      {/* Left Column: Address, Order, Payment */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Delivery Address Section */}
        <section className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-base md:text-lg text-neutral-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Address
            </h2>
            <button
              onClick={() => setIsChangingAddr(!isChangingAddr)}
              className="text-primary hover:text-neutral-800 text-xs md:text-sm font-bold transition-colors"
            >
              {isChangingAddr ? 'Cancel' : 'Change'}
            </button>
          </div>

          {!isChangingAddr ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-organic/60 border border-neutral-100">
              <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm text-neutral-800">{currentAddress.type}</p>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{currentAddress.addressLine}</p>
                <p className="text-[11px] font-semibold text-neutral-500 mt-2">Delivery in {currentAddress.deliveryTime}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    onChangeAddress(addr);
                    setIsChangingAddr(false);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    currentAddress.id === addr.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-bold text-sm text-neutral-800">{addr.type}</p>
                  <p className="text-xs text-neutral-600 mt-1">{addr.addressLine}</p>
                  <p className="text-[10px] text-neutral-500 mt-1">{addr.deliveryTime}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cart Item list */}
        <section className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200">
          <h2 className="font-display font-bold text-base md:text-lg text-neutral-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Order
          </h2>

          <div className="flex flex-col divide-y divide-neutral-100">
            {cart.map((item) => {
              const basePrice = item.selectedOption ? item.selectedOption.price : item.dish.price;
              const accsPrice = item.selectedAccompaniments.reduce((sum, acc) => sum + acc.price, 0);
              const singleItemPrice = basePrice + accsPrice;

              return (
                <div key={item.cartId} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3 justify-between">
                  <div className="flex gap-2.5 items-start">
                    {/* Badge */}
                    <div className={`w-4 h-4 border-2 rounded-[2px] flex items-center justify-center p-0.5 shrink-0 mt-0.5 ${
                      item.dish.isVeg ? 'border-accent-green' : 'border-primary'
                    }`}>
                      {item.dish.isVeg ? (
                        <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                      ) : (
                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-800">{item.dish.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.selectedOption ? `${item.selectedOption.name} • ` : ''}
                        {item.selectedAccompaniments.length > 0
                          ? item.selectedAccompaniments.map(acc => acc.name).join(', ')
                          : 'Standard preparation'}
                      </p>
                      <p className="text-sm font-bold text-primary mt-2">
                        ₹{singleItemPrice} <span className="text-xs text-neutral-400 font-normal">x{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity selectors */}
                    <div className="flex items-center bg-surface-organic rounded-full border border-neutral-300 px-1.5 py-0.5">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateCartItemQty(item.cartId, item.quantity - 1);
                          } else {
                            onRemoveCartItem(item.cartId);
                          }
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-neutral-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-display px-2 w-5 text-center text-neutral-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCartItemQty(item.cartId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-neutral-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveCartItem(item.cartId)}
                      className="text-neutral-400 hover:text-primary transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onAddMoreItems}
            className="flex items-center gap-2 text-primary font-bold text-sm mt-5 hover:text-neutral-800 transition-colors w-fit p-1"
          >
            <PlusCircle className="w-5 h-5" />
            Add more items
          </button>
        </section>

        {/* Payment Methods selector */}
        <section className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200">
          <h2 className="font-display font-bold text-base md:text-lg text-neutral-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Method
          </h2>

          <div className="flex flex-col gap-3">
            {/* UPI Option */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === 'UPI' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary shrink-0">
                  <Landmark className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-800">UPI</p>
                  <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'UPI'}
                onChange={() => setSelectedPayment('UPI')}
                className="text-primary focus:ring-primary w-4 h-4"
              />
            </label>

            {/* Credit / Debit Card option */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === 'Card' ? 'border-primary bg-primary/5' : 'border-neutral-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-800">Credit / Debit Card</p>
                  <p className="text-[11px] text-neutral-500">Visa, Mastercard, RuPay, Amex</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'Card'}
                onChange={() => setSelectedPayment('Card')}
                className="text-primary focus:ring-primary w-4 h-4"
              />
            </label>

            {/* COD Option */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === 'COD' ? 'border-primary bg-primary/5' : 'border-neutral-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                  <Milestone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-800">Cash on Delivery</p>
                  <p className="text-[11px] text-neutral-500">Please keep exact change handy</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'COD'}
                onChange={() => setSelectedPayment('COD')}
                className="text-primary focus:ring-primary w-4 h-4"
              />
            </label>
          </div>
        </section>
      </div>

      {/* Right Column: Calculations & Submit */}
      <div className="w-full md:w-80 lg:w-96 shrink-0">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-lg shadow-neutral-700/5 sticky top-24">
          <h2 className="font-display font-bold text-base md:text-lg text-neutral-800 mb-4 pb-2 border-b">
            Bill Details
          </h2>

          <div className="flex flex-col gap-3 font-medium text-xs md:text-sm text-neutral-600 mb-6">
            <div className="flex justify-between items-center">
              <span>Item Total</span>
              <span className="font-semibold text-neutral-800">₹{itemTotal}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Delivery Fee (2.5 km)</span>
              <span className="font-semibold text-neutral-800">₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Taxes & Charges (5% GST)</span>
              <span className="font-semibold text-neutral-800">₹{taxesAndCharges}</span>
            </div>

            {/* Coupon field */}
            <div 
              onClick={() => setCouponApplied(!couponApplied)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                couponApplied 
                  ? 'bg-accent-green-light/40 border-accent-green/30 text-accent-green-container' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {couponApplied ? 'HANDI50 Applied' : 'Apply HANDI50'}
                </span>
              </div>
              <span className="font-bold text-xs">
                {couponApplied ? '-₹50' : 'Tap to apply'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mb-6">
            <span className="font-display font-bold text-base text-neutral-800">To Pay</span>
            <span className="font-display font-bold text-lg md:text-xl text-primary font-semibold">
              ₹{totalPayable.toFixed(2)}
            </span>
          </div>

          {/* Place order CTA */}
          <button 
            onClick={() => onPlaceOrder(selectedPayment, couponApplied)}
            className="w-full bg-primary hover:bg-neutral-800 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md shadow-primary/25 cursor-pointer text-sm"
          >
            <span>Place Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[10px] text-center text-neutral-400 mt-4 leading-normal">
            By placing this order, you agree to our Terms &amp; Conditions and safe packing protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
