import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card'
import { Label, Input, Button } from '../../ui/Form'

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ onSubmit }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error && <div className="text-red-400 mb-2">{error}</div>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
