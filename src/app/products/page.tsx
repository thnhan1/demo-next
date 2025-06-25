import Link from "next/link";
import Image from "next/image";
import { ProductSummarizeResponse } from "@/types/type";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProductPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Error loading products.
        </h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const productResponse: ProductSummarizeResponse = await res.json();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 text-gray-900">
        Khám phá sản phẩm của chúng tôi
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {productResponse.content.length === 0 && (
          <p className="col-span-full text-center text-gray-600">
            Không có sản phẩm nào để hiển thị.
          </p>
        )}
        {productResponse.content.map((product) => (
          <Card
            key={product.id}
            className="flexflex-col h-full transition-shadow duration-300 hover:shadow-lg"
          >
            <Link
              href={`/products/${product.id}`}
              className="block"
              tabIndex={0}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={product.thumbnailUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover top-0 transition-transform duration-300 group-hover:scale-105"
                  priority={true}
                />
                {product.totalStock === 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full z-10"
                  >
                    Hết hàng
                  </Badge>
                )}
              </div>
            </Link>
            <CardContent className="flex flex-col flex-grow p-4 sm:p-6">
              <Badge
                variant="secondary"
                className="w-fit mb-2 text-xs px-3 py-1 rounded-full"
              >
                {product.category.name}
              </Badge>
              <Link
                href={`/products/${product.id}`}
                className="group focus:outline-none focus:ring-2 focus:ring-primary-500"
                tabIndex={0}
              >
                <CardTitle className="text-lg sm:text-xl font-semibold mb-1 text-gray-800 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
                  {product.name}
                </CardTitle>
              </Link>
              <CardDescription
                className="mb-3 text-gray-600 text-sm line-clamp-2"
                title={product.description}
              >
                {product.description || "Mô tả sản phẩm đang được cập nhật."}
              </CardDescription>
              <div className="mt-auto">
                <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  ${product.minPrice.toFixed(2)} - $
                  {product.maxPrice.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
