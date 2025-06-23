import CreateProductPage from "@/app/admin/products/create/CreateProductPage";
import { getCategories } from "@/lib/action";
export default async function addProductPage() {
  const categories = await getCategories();
  if (!categories) {
    return <div>Error loading categories</div>;
  }
  return <CreateProductPage categories={categories} />;
}
