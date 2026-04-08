'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function ProtectedRoute({ children }) {
  const router = useRouter()

  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state._hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return

    if (!token) {
      router.replace('/login')
    }
  }, [token, hasHydrated, router])

  if (!hasHydrated) return null

  return children
}