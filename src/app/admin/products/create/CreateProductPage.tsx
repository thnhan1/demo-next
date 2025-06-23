"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CategorySummary } from "@/types/type";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface VariantForm {
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
  imageUrl: string;
}

interface ImageForm {
  url: string;
}

export default function CreateProductPage({
  categories,
}: {
  categories: CategorySummary[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [variants, setVariants] = useState<VariantForm[]>([
    { color: "", size: "", price: "", stock: "", sku: "", imageUrl: "" },
  ]);
  const [images, setImages] = useState<ImageForm[]>([{ url: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Helpers for variants ---
  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };
  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { color: "", size: "", price: "", stock: "", sku: "", imageUrl: "" },
    ]);
  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  // --- Helpers for images ---
  const handleImageChange = (index: number, value: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { url: value } : img))
    );
  };
  const addImage = () => setImages((prev) => [...prev, { url: "" }]);
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Build payload đúng cấu trúc backend yêu cầu
      const payload = {
        name,
        description,
        categoryId,
        variants: variants.map((v) => ({
          color: v.color,
          size: v.size,
          price: parseFloat(v.price),
          stock: parseInt(v.stock, 10),
          sku: v.sku,
          imageUrl: v.imageUrl,
        })),
        images: images.map((img) => ({ url: img.url })),
      };

      // 2. Gửi request
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create product");
      }

      // 3. Success
      setSuccess("Product created successfully!");
      // Reset form
      setName("");
      setDescription("");
      setCategoryId("");
      setVariants([
        { color: "", size: "", price: "", stock: "", sku: "", imageUrl: "" },
      ]);
      setImages([{ url: "" }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Variants</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Variant
                </Button>
              </div>
              {variants.map((variant, idx) => (
                <div key={idx} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Variant {idx + 1}</span>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeVariant(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                      [
                        "color",
                        "size",
                        "price",
                        "stock",
                        "sku",
                        "imageUrl",
                      ] as (keyof VariantForm)[]
                    ).map((field) => (
                      <div key={field}>
                        <Label className="capitalize">{field}</Label>
                        <Input
                          type={
                            field === "price" || field === "stock"
                              ? "number"
                              : "text"
                          }
                          value={variant[field]}
                          onChange={(e) =>
                            handleVariantChange(idx, field, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Images</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImage}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Image URL"
                    value={img.url}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    required
                  />
                  {images.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Messages */}
            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
