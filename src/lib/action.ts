import prisma from "@/lib/prisma";
import { CategorySummary } from "@/types/type";

export async function getCategories(): Promise<CategorySummary[]> {
    try {
        const categories = await prisma.category.findMany();

        const mappedCategories: CategorySummary[] = categories.map((cat: unknown) => {
            const { id, name, description } = cat as { id: string; name: string; description: string };
            return {
                id,
                name: name ?? "",
                description: description ?? "",
            };
        });

        return mappedCategories;
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}