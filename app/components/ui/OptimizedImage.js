import { useState } from 'react'

export default function OptimizedImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  ...props
}) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={`bg-[#1E293B] flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        {...props}
      >
        <svg
          className="w-12 h-12 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : { width, height }}
      onError={() => setError(true)}
      {...props}
    />
  )
}
