import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

// Giả định các types này đã được định nghĩa ở đâu đó, ví dụ trong "@/type/type"
// Nếu bạn đang dùng shadcn/ui, hãy import Card, CardContent, Badge, Button từ đó
// Ví dụ:
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

interface Category {
    id: string;
    name: string;
}

interface ProductSummary {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    minPrice: number;
    maxPrice: number;
    totalStock: number;
    variantCount: number;
}

interface ProductSummarizeResponse {
    content: ProductSummary[];
    // Thêm các thuộc tính phân trang khác nếu có
    // pageable: any;
    // last: boolean;
    // totalPages: number;
    // totalElements: number;
    // size: number;
    // number: number;
    // first: boolean;
    // numberOfElements: number;
    // empty: boolean;
}

export default async function ProductPage() {
    const res = await fetch('http://192.168.1.58:8080/api/products', {
        next: { revalidate: 3600 } // Revalidate data every hour (adjust as needed for production)
    });

    if (!res.ok) {
        // Xử lý lỗi fetch dữ liệu
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Error loading products.</h1>
                <p className="text-gray-600">Please try again later.</p>
            </div>
        );
    }

    const productResponse: ProductSummarizeResponse = await res.json();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">Khám phá sản phẩm của chúng tôi</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productResponse.content.length === 0 && (
                    <p className="col-span-full text-center text-gray-600">Không có sản phẩm nào để hiển thị.</p>
                )}
                {productResponse.content.map(product => (
                    // Wrap the entire card with Link for better UX
                    <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="block group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                    >
                        {/* Card Component (replace with shadcn/ui Card if available) */}
                        <div className="flex flex-col h-full">
                            <div className="relative w-full h-64 overflow-hidden">
                                <Image
                                    src={product.thumbnailUrl || "/placeholder.svg"} // Fallback image
                                    alt={product.name}
                                    fill // Makes the image fill the parent
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority={true} // Prioritize loading for initial view
                                />
                                {product.totalStock === 0 && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Hết hàng
                                    </span>
                                )}
                            </div>

                            {/* CardContent (replace with shadcn/ui CardContent if available) */}
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                    {product.category.name}
                                </span>
                                <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
                                    {product.name}
                                </h2>
                                <p className="mb-4 text-gray-600 text-sm line-clamp-2" title={product.description}>
                                    {/* line-clamp-2 truncates text after 2 lines */}
                                    {product.description || "Mô tả sản phẩm đang được cập nhật."}
                                </p>

                                <div className="mt-auto"> {/* Push content to the bottom */}
                                    <p className="text-xl font-bold text-gray-900 mb-2">
                                        ${product.minPrice.toFixed(2)} - ${product.maxPrice.toFixed(2)}
                                    </p>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>
                                            <span className="font-medium">Tồn kho:</span> {product.totalStock}
                                        </p>
                                        <p>
                                            <span className="font-medium">Biến thể:</span> {product.variantCount}
                                        </p>
                                    </div>
                                    {/* Optional: Add a button if you prefer a explicit CTA */}
                                    {/*
                                    <button className="mt-4 w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors duration-200">
                                        Xem chi tiết
                                    </button>
                                    */}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}