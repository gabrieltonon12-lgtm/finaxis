import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '')

export const PRICE_IDS = {
  starter_monthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTHLY ?? '',
  starter_yearly: import.meta.env.VITE_STRIPE_PRICE_STARTER_YEARLY ?? '',
  professional_monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY ?? '',
  professional_yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY ?? '',
  enterprise_monthly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY ?? '',
  enterprise_yearly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_YEARLY ?? '',
}

export const PLAN_PRICES = {
  starter: { monthly: 97, yearly: 78 },
  professional: { monthly: 247, yearly: 198 },
  enterprise: { monthly: 597, yearly: 478 },
}
