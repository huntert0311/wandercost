import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    posts_per_month: 3,
    dms: false,
    analytics: false,
    feed_boost: 1,
    follow_limit: 50,
  },
  explorer: {
    name: "Explorer",
    price: 9,
    priceId: process.env.STRIPE_EXPLORER_PRICE_ID,
    posts_per_month: Infinity,
    dms: true,
    analytics: true,
    feed_boost: 2,
    follow_limit: Infinity,
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    posts_per_month: Infinity,
    dms: true,
    analytics: true,
    feed_boost: 2,
    follow_limit: Infinity,
    monetize: true,
    api_access: true,
    custom_url: true,
  },
} as const;
