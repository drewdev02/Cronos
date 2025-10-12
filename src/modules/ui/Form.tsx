import React from 'react'

export function Label({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <label className={`block text-gray-300 text-sm mb-2 ${className}`}>{children}</label>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 mb-4 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className || ''}`}
    />
  )
}

export function Button({ children, className = '', ...props }: React.PropsWithChildren<{ className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  )
}
