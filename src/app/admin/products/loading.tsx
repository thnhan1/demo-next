"use client"; // Thêm chỉ thị này

// app/product/[id]/loading.tsx
// Đây là một Client Component vì nó sử dụng hiệu ứng animate-pulse của Tailwind CSS
// và có thể được sử dụng trong môi trường Next.js App Router.

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skeleton cho phần hình ảnh sản phẩm */}
        <div className="space-y-4">
          {/* Main image skeleton */}
          <div className="relative w-full aspect-square bg-gray-200 rounded-lg animate-pulse">
            {/* Placeholder cho ảnh chính */}
          </div>

          {/* Thumbnails skeleton */}
          <div className="flex gap-2 overflow-x-auto mt-2 justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"
              >
                {/* Placeholder cho ảnh thumbnail */}
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton cho phần thông tin sản phẩm */}
        <div className="space-y-6">
          {/* Category Badge skeleton */}
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-2"></div>

          {/* Product Name skeleton */}
          <div className="h-9 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2"></div>

          {/* Rating and Reviews skeleton */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
            <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-5 w-11/12 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-5 w-10/12 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Price skeleton */}
          <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>

          {/* Color/Variant selection skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse mt-1"></div>
                </div>
              ))}
            </div>

            {/* Stock status skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Quantity control skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="flex items-center border rounded-md">
                <div className="h-8 w-8 bg-gray-200 rounded-l-md animate-pulse"></div>
                <div className="h-8 w-12 bg-gray-200 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-r-md animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Add to Cart & Wishlist buttons skeleton */}
          <div className="flex gap-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* SKU and Category details skeleton */}
          <div className="border-t pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
