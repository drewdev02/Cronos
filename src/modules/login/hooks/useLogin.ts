import { useState } from 'react'
import authenticate from '../usecases/authenticate'

export default function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      await authenticate(email, password)
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Unknown error')
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
