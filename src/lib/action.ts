import prisma from "@/lib/prisma";
import { CategorySummary } from "@/types/type";

export async function getCategories(): Promise<CategorySummary[]> {
    try {
        const categories = await prisma.category.findMany();

        const mappedCategories: CategorySummary[] = categories.map((cat) => ({
            id: cat.id,
            name: cat.name ?? "",
            description: cat.description ?? "",
        }));

        return mappedCategories;
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}