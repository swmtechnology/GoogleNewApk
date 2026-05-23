/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, ChefHat, Truck, ArrowRight, Star, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onExploreMenu: () => void;
}

export default function OrdersView({ orders, onExploreMenu }: OrdersViewProps) {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [ratedOrders, setRatedOrders] = useState<Record<string, number>>({});

  // Simulate status progression for Received orders to make it super interactive
  useEffect(() => {
    setLocalOrders(orders);

    const interval = setInterval(() => {
      setLocalOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status === 'Received') {
            return { ...order, status: 'Preparing' };
          } else if (order.status === 'Preparing') {
            return { ...order, status: 'Out for Delivery' };
          } else if (order.status === 'Out for Delivery') {
            return { ...order, status: 'Delivered' };
          }
          return order;
        })
      );
    }, 12000); // Progress every 12 seconds

    return () => clearInterval(interval);
  }, [orders]);

  const handleRate = (orderId: string, rating: number) => {
    setRatedOrders(prev => ({ ...prev, [orderId]: rating }));
  };

  if (localOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-lg text-neutral-800">No active or past orders</h2>
        <p className="text-sm text-neutral-500 mt-2">
          Your hunger queries will appear here once you place a mouth-watering Handi order!
        </p>
        <button
          onClick={onExploreMenu}
          className="mt-6 bg-primary text-white font-semibold py-3 px-6 rounded-xl shadow-md cursor-pointer hover:bg-neutral-800 active:scale-95 transition-all w-full"
        >
          Check Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-20">
      <h2 className="font-display font-bold text-lg md:text-xl text-neutral-800 border-b pb-2 flex items-center gap-2">
        <ClipboardList className="w-5.5 h-5.5 text-primary" />
        Your Order History
      </h2>

      <div className="flex flex-col gap-5">
        {localOrders.map((order) => {
          const isDelivered = order.status === 'Delivered';
          const rating = ratedOrders[order.id] || 0;

          return (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Top info and status tag */}
              <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                <div>
                  <p className="font-display font-semibold text-xs text-neutral-500 uppercase tracking-widest">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold font-display ${
                  order.status === 'Delivered' 
                    ? 'bg-accent-green-light text-accent-green' 
                    : order.status === 'Out for Delivery'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-accent-saffron/15 text-accent-saffron-on'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Real-time Order Process bar (If not delivered yet) */}
              {!isDelivered && (
                <div className="py-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold px-1">
                    <span className={order.status === 'Received' ? 'text-primary font-bold' : ''}>Received</span>
                    <span className={order.status === 'Preparing' ? 'text-primary font-bold' : ''}>Preparing</span>
                    <span className={order.status === 'Out for Delivery' ? 'text-primary font-bold' : ''}>Out for Delivery</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden relative border">
                    <div 
                      className="bg-primary h-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: order.status === 'Received' ? '15%' 
                             : order.status === 'Preparing' ? '50%' 
                             : '85%' 
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Items summary */}
              <div className="flex flex-col gap-1.5 py-1">
                {order.items.map((item, idx) => {
                  const itemTitle = item.dish.name;
                  const itemPortion = item.selectedOption ? ` (${item.selectedOption.name})` : '';
                  return (
                    <div key={idx} className="flex justify-between items-center text-xs md:text-sm text-neutral-700">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-primary">{item.quantity}x</span>
                        <span className="font-medium text-neutral-800">{itemTitle}{itemPortion}</span>
                        {item.selectedAccompaniments.length > 0 && (
                          <span className="text-[11px] text-neutral-400">
                            (+ {item.selectedAccompaniments.map(a => a.name).join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-neutral-800">
                        ₹{((item.selectedOption ? item.selectedOption.price : item.dish.price) + item.selectedAccompaniments.reduce((s, a) => s + a.price, 0)) * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Payment and address */}
              <div className="bg-surface-organic/50 rounded-xl p-3 text-xs text-neutral-600 space-y-1 border border-neutral-100">
                <p><span className="font-semibold text-neutral-700">Payment:</span> {order.paymentMethod}</p>
                <p className="line-clamp-1"><span className="font-semibold text-neutral-700">Address:</span> {order.address}</p>
              </div>

              {/* Total payable and action */}
              <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-neutral-400">Total Paid</p>
                  <p className="text-base font-bold font-display text-primary">₹{order.totalPayable.toFixed(2)}</p>
                </div>

                {isDelivered ? (
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[10px] text-neutral-400 font-semibold">How was your meal?</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleRate(order.id, s)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${
                            rating >= s ? 'fill-accent-saffron text-accent-saffron' : 'text-neutral-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <span className="text-[10px] text-accent-green font-bold animate-pulse mt-0.5">
                        Thanks for reviewing!
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-accent-saffron-on bg-accent-saffron/10 px-3 py-1.5 rounded-lg border border-accent-saffron/20 font-medium">
                    <ChefHat className="w-4 h-4 shrink-0 animate-bounce" />
                    <span>Preparing with hand-ground spices...</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
