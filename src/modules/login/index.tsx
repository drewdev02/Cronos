import React from 'react'
import LoginForm from './components/LoginForm'
import useLogin from './hooks/useLogin'
import { Link } from 'react-router-dom'

export default function LoginRoute() {
  const { login } = useLogin()
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-6">
      <div>
        <LoginForm onSubmit={login} />
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-400 underline">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
