import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
  trial_end: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscription()
    } else {
      setLoading(false)
    }
  }, [user])

  async function loadSubscription() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if user is on trial
  function isOnTrial() {
    if (!subscription) return false
    if (subscription.status !== 'trialing') return false
    if (!subscription.trial_end) return false
    return new Date(subscription.trial_end) > new Date()
  }

  // Check if subscription is active (including trial)
  function isActive() {
    if (!subscription) return false
    return ['active', 'trialing'].includes(subscription.status)
  }

  // Get days remaining in trial
  function getTrialDaysRemaining() {
    if (!subscription?.trial_end) return 0
    const now = new Date()
    const trialEnd = new Date(subscription.trial_end)
    const diff = trialEnd.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return {
    subscription,
    loading,
    isOnTrial: isOnTrial(),
    isActive: isActive(),
    trialDaysRemaining: getTrialDaysRemaining(),
    reload: loadSubscription
  }
}
