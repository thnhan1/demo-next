import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function getCategories(): Promise<Category[]> {
    try {
        const categories: Category[] = await prisma.category.findMany();

        return categories;
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}