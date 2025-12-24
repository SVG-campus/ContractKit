import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, priceId } = req.body

    if (!email || !priceId) {
      return res.status(400).json({ error: 'Missing email or priceId' })
    }

    // Get the base URL from the request
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const baseUrl = `${protocol}://${host}`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      subscription_data: {
        trial_period_days: 0, // No trial since they already have 14-day trial
      },
    })

    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    })
  }
}
