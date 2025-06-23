"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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

export default function CreateProductPage() {
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

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { url: value } : img)));
  };

  const addImage = () => setImages((prev) => [...prev, { url: "" }]);

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

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

    try {
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSuccess("Product created successfully.");
      setName("");
      setDescription("");
      setCategoryId("");
      setVariants([{ color: "", size: "", price: "", stock: "", sku: "", imageUrl: "" }]);
      setImages([{ url: "" }]);
    } catch (err) {
      setError("Failed to create product.");
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
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="category">Category ID</Label>
              <Input id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Variants</h3>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
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
                    <div>
                      <Label>Color</Label>
                      <Input value={variant.color} onChange={(e) => handleVariantChange(idx, "color", e.target.value)} />
                    </div>
                    <div>
                      <Label>Size</Label>
                      <Input value={variant.size} onChange={(e) => handleVariantChange(idx, "size", e.target.value)} />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input type="number" value={variant.price} onChange={(e) => handleVariantChange(idx, "price", e.target.value)} />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input type="number" value={variant.stock} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input value={variant.sku} onChange={(e) => handleVariantChange(idx, "sku", e.target.value)} />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input value={variant.imageUrl} onChange={(e) => handleVariantChange(idx, "imageUrl", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Images</h3>
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Image URL"
                    value={img.url}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="flex-1"
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

            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
