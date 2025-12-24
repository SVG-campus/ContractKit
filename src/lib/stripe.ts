import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID

if (!stripePublishableKey) {
  console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY')
}

if (!stripePriceId) {
  console.error('Missing VITE_STRIPE_PRICE_ID')
}

export const stripePromise = loadStripe(stripePublishableKey!)

// Create Stripe Checkout Session via API
export async function createCheckoutSession(userEmail: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        priceId: stripePriceId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create checkout session')
    }

    const { url } = await response.json()
    
    // Redirect to Stripe Checkout
    window.location.href = url
  } catch (error: any) {
    console.error('Checkout error:', error)
    throw error
  }
}

// Get Stripe Customer Portal URL (for managing subscriptions)
export function getCustomerPortalUrl() {
  return 'https://billing.stripe.com/p/login/test_'
}
