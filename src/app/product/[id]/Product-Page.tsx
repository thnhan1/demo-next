"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ProductDetails, ProductVariant } from "@/types/type";
import { Star, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Loading from "./loading";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [displayImages, setDisplayImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const carouselApiRef = useRef<CarouselApi | null>(null);

  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://192.168.1.58:8080/api/products/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        const data: ProductDetails = await res.json();
        setProduct(data);
        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        const images = [
          ...data.images.map((img) => ({ id: img.id, url: img.url })),
          ...data.variants.map((v) => ({
            id: `variant-${v.id}`,
            url: v.imageUrl,
          })),
        ];
        setDisplayImages(images);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Đồng bộ hình ảnh chính và thumbnail
  useEffect(() => {
    if (carouselApiRef.current) {
      // @ts-ignore
      carouselApiRef.current.scrollTo(selectedImageIndex, true);
    }
  }, [selectedImageIndex]);

  // Cập nhật selectedImageIndex khi carousel tự động chuyển
  useEffect(() => {
    if (carouselApiRef.current) {
      const onSelect = () => {
        // @ts-ignore
        setSelectedImageIndex(carouselApiRef.current.selectedScrollSnap());
      };
      // @ts-ignore
      carouselApiRef.current.on("select", onSelect);
      return () => {
        // @ts-ignore
        carouselApiRef.current.off("select", onSelect);
      };
    }
  }, []);

  // Xử lý khi chọn variant
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Tìm index của ảnh variant trong displayImages
    const variantImageIndex = displayImages.findIndex(
      (img) => img.id === `variant-${variant.id}`
    );
    if (variantImageIndex !== -1) {
      setSelectedImageIndex(variantImageIndex);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      alert(
        `Đã thêm ${quantity} x ${product?.name} (${selectedVariant.color}) vào giỏ hàng.`
      );
    }
  };

  const handleAddToWishlist = () => {
    alert(`Đã thêm ${product?.name} vào danh sách yêu thích.`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Không tìm thấy sản phẩm
            </h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Main carousel */}
          <div className="relative">
            <Carousel
              className="w-full max-w-lg mx-auto"
              plugins={[Autoplay(autoplayOptions)]}
              setApi={(api) => (carouselApiRef.current = api)}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {displayImages.map((image, idx) => (
                  <CarouselItem
                    key={image.id}
                    className={`relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === idx ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Thumbnails below carousel */}
          <div className="flex gap-2 overflow-x-auto mt-2 justify-center scrollbar-thin scrollbar-thumb-gray-300">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 
                  ${
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary"
                      : "border-gray-200"
                  }
                `}
                tabIndex={0}
                aria-label={`Chọn hình ảnh ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={`thumb-${index}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                (4.0) 128 đánh giá
              </span>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="text-3xl font-bold">
            ${selectedVariant?.price.toFixed(2)}
          </div>

          <div className="space-y-4">
            <Label>Màu sắc</Label>
            <RadioGroup
              value={selectedVariant?.id}
              onValueChange={(value) => {
                const found = product.variants.find((v) => v.id === value);
                if (found) handleVariantSelect(found); // Gọi hàm mới
              }}
              className="flex gap-2 flex-wrap"
            >
              {product.variants.map((variant) => (
                <div key={variant.id} className="flex flex-col items-center">
                  <RadioGroupItem
                    value={variant.id}
                    id={variant.id}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => handleVariantSelect(variant)} // Gọi hàm mới
                    className={`border-2 rounded-md p-1 mb-1 flex flex-col items-center justify-center 
                      ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <Image
                      src={
                        variant.imageUrl ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={variant.color}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                    <span className="text-xs mt-1 px-2">{variant.color}</span>{" "}
                    {/* Thêm tên variant */}
                  </button>
                </div>
              ))}
            </RadioGroup>

            <div className="flex items-center gap-2">
              <span className="text-sm">Tồn kho:</span>
              <Badge
                variant={selectedVariant!.stock > 0 ? "default" : "destructive"}
              >
                {selectedVariant!.stock > 0
                  ? `${selectedVariant!.stock} còn lại`
                  : "Hết hàng"}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Label>Số lượng</Label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1"
                  disabled={quantity >= (selectedVariant?.stock || 0)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Thêm vào giỏ
            </Button>
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="lg"
              className="bg-white text-black"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-t pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span>{selectedVariant?.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Danh mục:</span>
              <span>{product.category.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
