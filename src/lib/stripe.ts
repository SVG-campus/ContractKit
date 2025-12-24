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

// Create Stripe Checkout Session (client-side redirect)
export async function createCheckoutSession(userEmail: string) {
  const stripe = await stripePromise
  
  if (!stripe) {
    throw new Error('Stripe not loaded')
  }

  // Get current URL for success/cancel redirects
  const baseUrl = window.location.origin
  
  // Redirect to Stripe Checkout using client-side method
  const { error } = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: stripePriceId!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}/cancel`,
    customerEmail: userEmail,
    clientReferenceId: userEmail,
  })

  if (error) {
    throw error
  }
}

// Get Stripe Customer Portal URL (for managing subscriptions)
export function getCustomerPortalUrl() {
  // For now, direct users to Stripe billing portal
  // Later we can build a backend API to generate portal sessions
  return 'https://billing.stripe.com/p/login/test_' // This will be replaced with proper portal
}
