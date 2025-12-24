const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID

export async function createCheckoutSession(email: string) {
  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': STRIPE_PRICE_ID,
        'line_items[0][quantity]': '1',
        mode: 'subscription',
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
        customer_email: email,
        'subscription_data[trial_period_days]': '0',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create checkout session')
    }

    const session = await response.json()
    window.location.href = session.url
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
        return_url: `${window.location.origin}/settings`,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create portal session')
    }

    const session = await response.json()
    window.location.href = session.url
  } catch (error) {
    console.error('Stripe portal error:', error)
    throw error
  }
}
