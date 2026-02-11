interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
  
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-150 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  )
}
