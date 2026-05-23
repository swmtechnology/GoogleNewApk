import { Dish, Address } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'restaurant' },
  { id: 'specials', name: 'Handi Specials', icon: 'tapas' },
  { id: 'soups', name: 'Soups', icon: 'soup_kitchen' },
  { id: 'starters', name: 'Starters & Snacks', icon: 'local_pizza' },
  { id: 'main-course', name: 'Main Course', icon: 'dinner_dining' },
  { id: 'breads', name: 'Breads', icon: 'bakery_dining' }
];

export const DISHES: Dish[] = [
  {
    id: 'biryani-01',
    name: 'Authentic Handi Biryani',
    description: 'Slow-cooked to perfection over a low wood fire. Our signature heritage recipe uses long-grain basmati rice, tender marinated vegetables, and a secret blend of 21 whole spices, sealed with dough to trap the rich, aromatic steam.',
    category: 'specials',
    tags: ['Gluten-Free', 'Contains Dairy', 'Medium Spicy'],
    price: 450,
    rating: 4.8,
    ratingsCount: '1.2k Ratings',
    deliveryTime: '45-50 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlhI9XR7-Nm-rUM3lSXt75v2taTNGmo5nnCd2PtNZf3ZOxG3_TWb2xkMkHMm_0pxemuavyYo3Wcbx8ZsXBj1CpyYk9ZM_AX603JoDQCtHCXIk-pFIskIh0IfGHkGoA74oZVPwpKOAXNpJ3DmwhIAx1CYZ9p-FMCRNYFiizsK0qOvl5z0C480p7UCCNfTbfU0Vjd754cbMLFMrAclqIQtoghLKMOjlAs-51iq5bdZiCIyzS8sYdgFUgTvUapPAH-WIfa2CLLo6WPXc',
    accompaniments: [
      { name: 'Burrani Raita', price: 60 },
      { name: 'Mirchi Ka Salan', price: 45 }
    ]
  },
  {
    id: 'murgh-handi-lazeez',
    name: 'Murgh Handi Lazeez',
    description: 'Slow-cooked chicken in a rich, aromatic gravy infused with signature Handi spices.',
    category: 'specials',
    tags: ['Non-Veg', 'Signature', 'Spicy'],
    price: 340,
    rating: 4.8,
    ratingsCount: '890 Ratings',
    deliveryTime: '30-35 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXtEIBbaYy_MIfR-WszOlWrv5ttbhWIiM0rQ7n2DShz6oR5BIo-JXPNHBzmF2NPQTbvP87h9PUMPFy7VEujPKjAfYQiSA99LAhNfuisX0lN9NWAWAAyHBy3oMRtVAMDZo_H1zHqq-oEt8KFzCVLIYkaQ57TG99bUf2NGdjAUyApNMY31BMOZZLXFJ2aaXsbfIWrG_kYJpbw_M_S5_7J53qDnvZxt6LoBNu2-rXaX_-ayIG39Hmu7gSMhEPfauWUmoYG0P3LAZxlbI',
    accompaniments: [
      { name: 'Extra Butter Roti', price: 25 },
      { name: 'Sirka Onion', price: 15 }
    ]
  },
  {
    id: 'paneer-handi-khas',
    name: 'Paneer Handi Khas',
    description: 'Soft cottage cheese cubes in a creamy tomato-onion base, finished with fresh cream.',
    category: 'specials',
    tags: ['Veg', 'Creamy', 'Mild'],
    price: 280,
    rating: 4.5,
    ratingsCount: '1.5k Ratings',
    deliveryTime: '25-30 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrNOLOwYv4gVbbTTtZY2lElHTe_lAj07G_ypiMjfALNMB1802kX18sO3-YHAyoOQhQZk8t1Pw8SqTmyvdF2-TfPh3roAJYXnFDAnBbUQk5fFMC_YQOwIXJksv8P4F0HErj2u9jQ41tIW5-MaCsKKJk_W7E04PBJhvvZbVvqm_2QfA3OR4afc2fqSoV4XuPvbzsldnaKUGdGCvmKhylIgEG8AeLlVbzlbTxU86lj1D-I1mwxlkcrjq5ZLl8JJEXDy7wAGvMGKGZc04',
    accompaniments: [
      { name: 'Burrani Raita', price: 60 },
      { name: 'Laccha Paratha', price: 40 }
    ]
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    description: 'Our signature slow-cooked chicken in a rich, aromatic tomato and onion gravy, prepared traditionally in an earthen pot to seal in the flavors.',
    category: 'specials',
    tags: ['Non-Veg', 'Spicy'],
    price: 450,
    rating: 4.7,
    ratingsCount: '2.1k Ratings',
    deliveryTime: '35-40 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZabEV1VmM82EDUX1PHzcd1k8g9WVCypYOec5jMHMawCAwQ9j83QkXBKhFb7bpkE4JMpiEbLVUMlOQpPMGD0Ww5UnfNxCLJS7vRlaJU5qXeap3gSeoJ5R_iKGyHxAzpM61qdwAQ0oOXdIkqTse8OMBr_loF2kHAKlOZcp1VeP5csd7LJR0_klxwkhHihIbm837ADD-4oUbh5txWWscreoTFlmQF4YMLm6AMkYsFCZ4eb3C59Tfxj8-D1bORv3CCFdCsPFqRt9w5Yk',
    accompaniments: [
      { name: 'Sirka Onion', price: 15 },
      { name: 'Butter Naan', price: 60 }
    ]
  },
  {
    id: 'handi-paneer-tikka',
    name: 'Handi Paneer Tikka',
    description: 'Soft cottage cheese cubes simmered in a luscious, creamy cashew and tomato sauce, infused with whole Indian spices.',
    category: 'specials',
    tags: ['Veg', 'Creamy'],
    price: 380,
    rating: 4.6,
    ratingsCount: '950 Ratings',
    deliveryTime: '30 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2g92EKvHnNLiCBSTkntl0gPBK4MfEg80dfKiEBlPTgJQPrjvGObSRHCOSCNP8GhbaXnvgVG5b0HiQtoz1DtBDquvpIzPoWCWL4VtdLpb9F1e54wHELd8al0bYrcdinft0kx__XAY6rhSSbahDh5hU8GqB3GSvmFX-aadiqUtKkzXG9fXZBYlp3HpN3FtYR0cCAJrmTg-HWsmLbiMGSiTjSsDXgMQkue0_pRGRWChbcJ3Bv1FRDET2bhEg2uWYqo0Va_K775lGHfo',
    accompaniments: [
      { name: 'Mint Chutney Extra', price: 10 },
      { name: 'Laccha Paratha', price: 40 }
    ]
  },
  {
    id: 'mutton-rogan-josh',
    name: 'Mutton Rogan Josh',
    description: 'A classic Kashmiri delicacy. Tender mutton pieces slow-cooked with a blend of warming spices, Kashmiri red chilies, and yogurt, delivering a robust and deeply flavorful curry. Perfect with garlic naan.',
    category: 'specials',
    tags: ['Non-Veg', 'Medium Spicy'],
    price: 650, // default half
    rating: 4.9,
    ratingsCount: '3.1k Ratings',
    deliveryTime: '45-50 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvwoNYJxyE0WBHD3h_BKweXgJzAwqgd0G-b78J63_o700yo6s3MCewxH8wgoxdJYeIBs8QT0gI0hWYAJIu4so4fJwCo-P7aX7Ye4n9YrYYL1Lb30ZgoiB6-btsrlE1PgISl8IJwUX6xkZr_88FE6pmiqjFrHS_Xobj7KrOHEDtbG1jfT8IzYv78lGgSItd83nyfdEp-mgdcuRkN4Ddv74M2971dyMPMgSloI-dwCqjVOt_sTWK2oDNh3czZtnv13zS1uubSrWZor0',
    options: [
      { name: 'Quarter', price: 350 },
      { name: 'Half', price: 650 },
      { name: 'Full', price: 1200 }
    ]
  },
  {
    id: 'veg-manchow-soup',
    name: 'Veg Manchow Soup',
    description: 'A classic Indo-Chinese soup served with crispy fried noodles and fresh spring onions.',
    category: 'soups',
    tags: ['Veg', 'Chinese', 'Spicy'],
    price: 150,
    rating: 4.3,
    ratingsCount: '450 Ratings',
    deliveryTime: '15 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOgjQ5DyQaFi8I5Yxmzo-d85LSuT5wu2gNzEvAkCADDgGqjdytqaOpzJoWG-0GtkYc2JOPe_xDhMcGt9R82EV4ng6uhkxH982KguW8XesVo7o0Bu1rZi-WA4ksUMDMLMViuZHmC_SrtdhklFfDb41ogwItHA8ZbkSFlUUOPBuzaoIreWiz2fB3rx0DWX_cy3BO_YfcOcl06Mqzh-V_0HQk2td0SoKECcp0AgMMIITTZpu8utiLPDiN2zferurhJiE5Q669UC8Nqbg'
  },
  {
    id: 'chicken-sweet-corn-soup',
    name: 'Chicken Sweet Corn',
    description: 'Comforting, creamy sweet corn broth loaded with roasted shredded chicken and egg whites.',
    category: 'soups',
    tags: ['Non-Veg', 'Mild'],
    price: 180,
    rating: 4.4,
    ratingsCount: '380 Ratings',
    deliveryTime: '15 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UI0p0hY_8qf_adk0MrkkL8FWVsL5lrAqRi45L8hYEUf40mFh9-sQdTGwCEzQFOPdLUUXJuwUWYwf5_I2VhJ2eTdvJVbWeF1SFWTaLqIU_UX-bpTOjPsrPM3qtHcFusx-VVATEgPOIl7gSAqoyalwmADLrBp5H4kyXRTzRjVaUXUlYyF0q5AcXfGVzqOulT_XpQMFPi8k_YQBbyEjSJXJu-FmxNSoVjN_LyVbO37lKpVm6EMdsvUgugK-8ph_43PEH5Swe8FZEaU'
  },
  {
    id: 'chilli-chicken-dry',
    name: 'Chilli Chicken (Dry)',
    description: 'Spicy Indo-Chinese tossed chicken with crisp bell peppers, onions, and rich soya sauce.',
    category: 'starters',
    tags: ['Non-Veg', 'Indo-Chinese', 'Spicy'],
    price: 320,
    rating: 4.7,
    ratingsCount: '1.8k Ratings',
    deliveryTime: '20-25 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-QNbzh1ybaQ-ycTCblNwWpAWDsXyriVKYCu5vUleqTO1qR3D3EKCY8ZEvky78zS-kZB84S6K6ztoAsN5rDX3n12bWKi5vXUdwHmOuUibKMP3cuyalhLsaJnYnJYSejRJvykwERi45FrkWWce9RV2CeTfjwrC7mkiqJ6ugV6GMdC2lKzUO-p5iAXbDFV2HXnfFNi_dpCnprsoNdYCoZ0h70-eIYoRhgM6HZj5hqHiqOiAQhK-1Tej3h3p5gy-2VdQpfdtCdBxYCtk'
  },
  {
    id: 'hara-bhara-kebab',
    name: 'Hara Bhara Kebab',
    description: 'Healthy and delicious pan-fried patties made with spinach, green peas, and potatoes.',
    category: 'starters',
    tags: ['Veg', 'Healthy'],
    price: 260,
    rating: 4.4,
    ratingsCount: '1.1k Ratings',
    deliveryTime: '20 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhv5VKB0S8dGFrLakKW7rQnUF1Fnh9EsQGmNHkI1a1Qu70Ch2Vsxdi-be05R4FlYR8pX3OFEzaMFt381MqS0qJfpqxYabC65frEo_8hwBOK26YIhw3qfdPytsQWu4A-LoMvsGpAYwHcK-S_Wlf53FtU3erqLWaqgoIbaHf2N-TIlF-dsT9csAnaX7AmUi4yNWO9Duq4zjyVmKoI827M167i8S4gNI2QtGawzCt9w51vZuAm-36Aus_5As5peqjMU4FywXI0bmA9ng'
  },
  {
    id: 'butter-chicken',
    name: 'Murgh Makhani (Butter Chicken)',
    description: 'Tandoori chicken simmered in a smooth tomato and cream gravy with fenugreek.',
    category: 'main-course',
    tags: ['Non-Veg', 'Creamy', 'Classic'],
    price: 380, // default half
    rating: 4.8,
    ratingsCount: '4.2k Ratings',
    deliveryTime: '30 mins',
    isVeg: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbd-_ld7e8tbXruOnpzlFKYnE_mkVPYF1yMVtEUqinK6rBgftCVFQVXZ8_e45X8ngWJHSxr3jHPJnAdS_4cdpD_XtNC772-89hGX1S9XrXk4oePyoYmd68zz8_atXEfqFwmRH9lEfz3WehwmjnSnaVZO_SqjB5gDr3Owgx1PtSboTDEwU_QcYPJftLBX1qUqlwi0qqwyhQIcwRQo4xNREkZ1y_UagThMutQ7s23MRSfZPLWTwhiZfZWSU4ely1YHX7FDE-4U0PWks',
    options: [
      { name: 'Half', price: 380 },
      { name: 'Full', price: 720 }
    ]
  },
  {
    id: 'kadhai-paneer',
    name: 'Kadhai Paneer',
    description: 'Paneer cubes and bell peppers tossed in a spicy, freshly ground spice mix.',
    category: 'main-course',
    tags: ['Veg', 'Spicy'],
    price: 280, // default half
    rating: 4.6,
    ratingsCount: '1.9k Ratings',
    deliveryTime: '25-30 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUBbLfnTLeyWBntBxjsu-QEsP0X2PbLrNxhIO6aWXp2ImlBGnsIElPnNYywVsBfzmTisoNzyk6c91A4qF7dehalJbW0EF4v9oBmao-A1MidBjfD7FhNsXaewUL6CeTabY1_SmSoJICccneHxgihTOXVhje31TdwSgNN0Zg6V6INtTyEDsz5y1wgh3D9qpLwv77XJKTrp3h66Wy5Jf14qt7cbsYACEFRSEzOZ-293NnUoPcB336-4xmRjQaZpFZDSVcBdEe0AHDywg',
    options: [
      { name: 'Half', price: 280 },
      { name: 'Full', price: 520 }
    ]
  },
  {
    id: 'butter-naan',
    name: 'Butter Naan',
    description: 'Traditionally baked soft sourdough bread glazed with warm fresh butter.',
    category: 'breads',
    tags: ['Veg', 'Breads'],
    price: 60,
    rating: 4.7,
    ratingsCount: '5k Ratings',
    deliveryTime: '10 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlhI9XR7-Nm-rUM3lSXt75v2taTNGmo5nnCd2PtNZf3ZOxG3_TWb2xkMkHMm_0pxemuavyYo3Wcbx8ZsXBj1CpyYk9ZM_AX603JoDQCtHCXIk-pFIskIh0IfGHkGoA74oZVPwpKOAXNpJ3DmwhIAx1CYZ9p-FMCRNYFiizsK0qOvl5z0C480p7UCCNfTbfU0Vjd754cbMLFMrAclqIQtoghLKMOjlAs-51iq5bdZiCIyzS8sYdgFUgTvUapPAH-WIfa2CLLo6WPXc' // fallback/close enough naans are naans
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Naan',
    description: 'Freshly baked tandoori sourdough flatbread topped with garlic cloves and coriander.',
    category: 'breads',
    tags: ['Veg', 'Breads'],
    price: 80,
    rating: 4.8,
    ratingsCount: '4.5k Ratings',
    deliveryTime: '10 mins',
    isVeg: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlhI9XR7-Nm-rUM3lSXt75v2taTNGmo5nnCd2PtNZf3ZOxG3_TWb2xkMkHMm_0pxemuavyYo3Wcbx8ZsXBj1CpyYk9ZM_AX603JoDQCtHCXIk-pFIskIh0IfGHkGoA74oZVPwpKOAXNpJ3DmwhIAx1CYZ9p-FMCRNYFiizsK0qOvl5z0C480p7UCCNfTbfU0Vjd754cbMLFMrAclqIQtoghLKMOjlAs-51iq5bdZiCIyzS8sYdgFUgTvUapPAH-WIfa2CLLo6WPXc'
  }
];

export const ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    addressLine: 'A-45, Connaught Place Inner Circle, Near Regal Cinema, New Delhi, 110001',
    deliveryTime: '35-45 mins'
  },
  {
    id: 'addr-2',
    type: 'Work',
    addressLine: 'Vikas Minar, I.P. Estate, Near Pragati Maidan Metro, New Delhi, 110002',
    deliveryTime: '40-50 mins'
  }
];
