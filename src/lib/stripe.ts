import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripePromise = loadStripe(stripePublishableKey)

export const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID

// Create checkout session
export async function createCheckoutSession(email: string) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      priceId: STRIPE_PRICE_ID,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return await response.json()
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string) {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  })

  if (!response.ok) {
    throw new Error('Failed to create portal session')
  }

  return await response.json()
}
