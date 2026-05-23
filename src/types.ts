/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Accompaniment {
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  ratingsCount: string;
  deliveryTime: string;
  isVeg: boolean;
  image: string;
  accompaniments?: Accompaniment[];
  options?: {
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  cartId: string; // unique for identifying cart line item (dishId + accompaniments + size option)
  dish: Dish;
  quantity: number;
  selectedAccompaniments: Accompaniment[];
  selectedOption?: {
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxesAndCharges: number;
  couponApplied?: {
    code: string;
    discount: number;
  };
  totalPayable: number;
  address: string;
  paymentMethod: string;
  timestamp: string;
  status: 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  addressLine: string;
  deliveryTime: string;
}
