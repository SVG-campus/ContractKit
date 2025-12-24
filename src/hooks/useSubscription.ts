import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface Subscription {
  id: string
  user_id: string
  status: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  trial_end: string | null
  current_period_end: string | null
  created_at: string
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  async function loadSubscription() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const isOnTrial = subscription?.status === 'trialing' && subscription?.trial_end
    ? new Date(subscription.trial_end) > new Date()
    : false

  const isActive = subscription?.status === 'active' || isOnTrial

  const trialDaysRemaining = subscription?.trial_end
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return {
    subscription,
    isOnTrial,
    isActive,
    trialDaysRemaining,
    loading,
    refresh: loadSubscription,
  }
}
