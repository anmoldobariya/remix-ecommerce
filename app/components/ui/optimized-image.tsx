import { useState } from 'react';
import { cn } from '~/utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loadingClassName?: string;
  errorClassName?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center',
  loadingClassName = 'bg-gray-200 animate-pulse',
  errorClassName = 'bg-gray-100 flex items-center justify-center text-gray-400',
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className={cn('absolute inset-0', loadingClassName)} />
      )}

      {/* Error state */}
      {hasError && (
        <div className={cn('absolute inset-0', errorClassName)}>
          <div className="text-center">
            <div className="text-4xl mb-2">👓</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
