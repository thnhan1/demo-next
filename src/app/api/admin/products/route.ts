"use server";
import type { ProductSummarizeResponse, ProductSummary } from "@/types/type";
import { NextResponse } from "next/server";


export async function GET() {
    const res = await fetch(`${process.env.BACKEND_URL}/api/products`);
    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }
    const data = await res.json();

    const r: ProductSummarizeResponse = data;
    const products: ProductSummary[] = r.content;

    return NextResponse.json(products);

}
export async function POST(request: Request) {
    try {
        // Đọc JSON payload từ client
        const payload = await request.json();

        // Forward request sang backend
        const res = await fetch(`${process.env.BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to create product' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        console.error('Error in API route:', err);
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}