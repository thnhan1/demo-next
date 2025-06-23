"use server";
import { NextResponse } from "next/server";
import type { Product, ProductDetails, ProductSummarizeResponse, ProductSummary } from "@/types/type";
import prisma from "@/lib/prisma";
import { log } from "console";


export async function GET() {
    const res = await fetch("http://192.168.1.58:8080/api/products");
    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }
    const data = await res.json();

    const r: ProductSummarizeResponse = data;
    const products: ProductSummary[] = r.content;

    return NextResponse.json(products);

    // const res = await prisma.product.findMany();
    // if (!res) {
    //     return NextResponse.json({ error: "No products found" }, { status: 404 });
    // }
    // log(res)
    // return NextResponse.json(res as unknown as Product[]);
}
