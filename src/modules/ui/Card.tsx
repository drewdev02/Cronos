import React from 'react'

type Props = React.PropsWithChildren<{
  className?: string
}>

export function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-gray-900 p-6 rounded-lg shadow ${className}`}>{children}</div>
  )
}

export function CardHeader({ children }: Props) {
  return <div className="mb-4">{children}</div>
}

export function CardTitle({ children }: Props) {
  return <h3 className="text-xl font-semibold mb-0 text-gray-100">{children}</h3>
}

export function CardContent({ children }: Props) {
  return <div>{children}</div>
}

export default Card
