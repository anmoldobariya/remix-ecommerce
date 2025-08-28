import { cn } from "~/utils/cn";
import { ReactNode } from "react";

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)}>
      {children}
    </div>
  );
}

// Skeleton Container for grouping multiple skeletons
interface SkeletonContainerProps {
  className?: string;
  children: ReactNode;
}

export function SkeletonContainer({ className, children }: SkeletonContainerProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {children}
    </div>
  );
}

// Common skeleton shapes
export const SkeletonLine = ({ className }: { className?: string }) => (
  <Skeleton className={cn('h-4 w-full', className)} />
);

export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLine key={i} className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonBox = ({ className }: { className?: string }) => (
  <Skeleton className={cn('w-full h-32', className)} />
);

export const SkeletonCircle = ({ className }: { className?: string }) => (
  <Skeleton className={cn('w-10 h-10 rounded-full', className)} />
);

export const SkeletonButton = ({ className }: { className?: string }) => (
  <Skeleton className={cn('h-10 w-24', className)} />
);

// Loading Spinner (keep this as is)
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size], className)} />
  );
}

// Composable skeleton components using the base Skeleton
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <SkeletonContainer className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className)}>
      <SkeletonBox className="aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonLine className="w-1/2" />
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </SkeletonContainer>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonLine key={i} />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonLine key={colIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonForm({ fields = 6 }: { fields?: number }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <SkeletonLine className="w-1/4 h-6" />
        <SkeletonLine className="w-1/2" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLine className="w-1/6" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="flex space-x-4 pt-4">
        <SkeletonButton />
        <SkeletonButton className="w-20" />
      </div>
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonContainer key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <SkeletonCircle className="w-12 h-12" />
            <div className="ml-4 flex-1 space-y-2">
              <SkeletonLine className="w-3/4" />
              <SkeletonLine className="h-6 w-1/2" />
            </div>
          </div>
        </SkeletonContainer>
      ))}
    </div>
  );
}

export function SkeletonFilters() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Skeleton className="h-10 w-full" />
        </div>
        <SkeletonButton className="w-32" />
        <SkeletonButton className="w-28" />
        <SkeletonButton />
      </div>
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <SkeletonLine className="w-32 h-6" />
            <div className="flex space-x-4">
              <SkeletonButton />
              <SkeletonButton className="w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <SkeletonBox className="aspect-square" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <SkeletonLine className="w-20" />
              <SkeletonLine className="h-8 w-3/4" />
              <SkeletonLine className="h-6 w-1/2" />
            </div>

            <SkeletonText lines={3} />

            <div className="space-y-3">
              <SkeletonLine className="w-24 h-5" />
              <SkeletonText lines={4} className="space-y-1" />
            </div>

            <div className="flex space-x-4">
              <SkeletonButton className="w-32 h-12" />
              <SkeletonButton className="w-28 h-12" />
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16">
          <SkeletonLine className="w-48 h-6 mb-6" />
          <SkeletonGrid count={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}

// Route-Aware Skeleton Component
interface RouteAwareSkeletonProps {
  destinationPath?: string;
  currentPath: string;
  fallback?: ReactNode;
}

export function RouteAwareSkeleton({ destinationPath, currentPath, fallback }: RouteAwareSkeletonProps) {
  const targetPath = destinationPath || currentPath;

  // Determine which skeleton to show based on the destination route
  if (targetPath === '/') {
    return <SkeletonHomePage />;
  }

  if (targetPath.startsWith('/products/') && targetPath !== '/products') {
    return <SkeletonProductDetail />;
  }

  if (targetPath === '/products') {
    return <SkeletonProductsPage />;
  }

  if (targetPath === '/admin' || targetPath === '/admin/') {
    return <SkeletonAdminDashboard />;
  }

  if (targetPath.startsWith('/admin/products')) {
    if (targetPath.includes('/new') || targetPath.match(/\/admin\/products\/[^\/]+$/)) {
      return <SkeletonAdminForm />;
    }
    return <SkeletonAdminTable />;
  }

  if (targetPath.startsWith('/admin/users')) {
    if (targetPath.includes('/new') || targetPath.match(/\/admin\/users\/[^\/]+$/)) {
      return <SkeletonAdminForm />;
    }
    return <SkeletonAdminTable />;
  }

  if (targetPath.startsWith('/admin/banners')) {
    if (targetPath.includes('/new') || targetPath.match(/\/admin\/banners\/[^\/]+$/)) {
      return <SkeletonAdminForm />;
    }
    return <SkeletonAdminTable />;
  }

  if (targetPath.startsWith('/admin/categories')) {
    return <SkeletonAdminCategories />;
  }

  if (targetPath === '/login') {
    return <SkeletonLoginPage />;
  }

  if (targetPath === '/register') {
    return <SkeletonRegisterPage />;
  }

  // Return fallback or generic page skeleton
  return fallback || <SkeletonPage />;
}

// Specific page skeletons
function SkeletonHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <SkeletonLine className="w-32 h-6" />
            <div className="flex space-x-4">
              <SkeletonButton />
              <SkeletonButton className="w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <LoadingBanner />

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Featured Products */}
        <div>
          <SkeletonLine className="w-48 h-8 mb-6" />
          <SkeletonGrid count={8} />
        </div>

        {/* Category Sections */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <SkeletonLine className="w-40 h-6 mb-6" />
            <SkeletonGrid count={4} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <SkeletonLine className="w-32 h-6" />
            <div className="flex space-x-4">
              <SkeletonButton />
              <SkeletonButton className="w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <SkeletonLine className="h-10 w-64 mx-auto mb-4" />
        <SkeletonLine className="h-6 w-96 mx-auto" />
      </div>

      {/* Filters Skeleton */}
      <SkeletonFilters />

      {/* Products Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SkeletonGrid count={12} />

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <SkeletonLine className="h-10 w-48" />
        </div>
      </div>
    </div>
  );
}

function SkeletonAdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <SkeletonLine className="h-8 w-64 mb-2" />
        <SkeletonLine className="h-4 w-96" />
      </div>
      <SkeletonStats />
      <div className="mt-8 space-y-6">
        <SkeletonLine className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonContainer key={i} className="bg-white rounded-lg shadow p-6">
              <SkeletonLine className="w-3/4 mb-3" />
              <SkeletonLine className="h-3 w-1/2" />
              <SkeletonButton className="w-32 h-8 mt-4" />
            </SkeletonContainer>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonAdminTable() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <SkeletonLine className="h-8 w-32 mb-2" />
          <SkeletonLine className="h-4 w-48" />
        </div>
        <SkeletonButton className="w-32" />
      </div>
      <SkeletonFilters />
      <SkeletonTable rows={10} columns={6} />
      <div className="flex justify-center mt-6">
        <SkeletonLine className="h-10 w-64" />
      </div>
    </div>
  );
}

function SkeletonAdminForm() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <SkeletonLine className="h-8 w-48 mb-2" />
        <SkeletonLine className="h-4 w-64" />
      </div>
      <SkeletonForm />
    </div>
  );
}

function SkeletonAdminCategories() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <SkeletonLine className="h-8 w-64 mb-2" />
          <SkeletonLine className="h-4 w-80" />
        </div>
      </div>
      <SkeletonForm />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonTable rows={3} columns={3} />
        <SkeletonTable rows={5} columns={3} />
      </div>
    </div>
  );
}

function SkeletonLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <SkeletonLine className="h-9 w-32" />
          </div>
          <div className="mt-6 flex justify-center">
            <SkeletonLine className="h-9 w-48" />
          </div>
        </div>
        <SkeletonForm />
      </div>
    </div>
  );
}

function SkeletonRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <SkeletonLine className="h-9 w-32" />
          </div>
          <div className="mt-6 flex justify-center">
            <SkeletonLine className="h-9 w-40" />
          </div>
          <div className="mt-2 flex justify-center">
            <SkeletonLine className="h-4 w-64" />
          </div>
        </div>
        <SkeletonForm fields={8} />
      </div>
    </div>
  );
}

// Legacy exports for backward compatibility (can be removed after migration)
export const LoadingCard = SkeletonCard;
export const LoadingTable = SkeletonTable;
export const LoadingProductGrid = SkeletonGrid;
export const LoadingProductDetail = SkeletonProductDetail;
export const LoadingStats = SkeletonStats;
export const LoadingForm = SkeletonForm;
export const LoadingFilters = SkeletonFilters;
export const LoadingPage = SkeletonPage;
export const LoadingAvatar = SkeletonCircle;
export const LoadingBanner = ({ className }: { className?: string }) => (
  <SkeletonContainer className={cn('bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden', className)}>
    <SkeletonBox className="h-32 rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="h-3 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  </SkeletonContainer>
);
