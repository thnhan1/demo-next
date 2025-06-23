import { Category } from "@prisma/client";
import { getCategories } from "./action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProductFormData {
  name: string;
  categoryId: string;
  description: string;
  price: string; // Using string to handle input value directly
  imageUrl: string;
}

const initialFormData: ProductFormData = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  imageUrl: "",
};

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] =
    useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsFetchingCategories(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setSubmitError("Failed to load categories. Please try again."); // Using submitError for general page errors too
    } finally {
      setIsFetchingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // Basic Validation
    if (!formData.name || !formData.categoryId || !formData.price) {
      setSubmitError("Product Name, Category, and Price are required.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setSubmitError("Price must be a valid non-negative number.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    console.log("Submitting product:", {
      ...formData,
      price: parseFloat(formData.price), // Convert price to number for submission
    });

    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulating a random error for demonstration
      // if (Math.random() < 0.3) {
      //   throw new Error("Simulated network error");
      // }

      setSubmitSuccess("Product added successfully!");
      setFormData(initialFormData); // Reset form
      // Note: The Select component's displayed value needs manual reset if not controlled by 'value' prop.
      // For this custom Select, it should reset fine if its internal state is tied to `defaultValue` or if `onValueChange` correctly updates what `SelectValue` reads.
      // As our Select gets its initial value from `defaultValue` on mount, setting formData.categoryId to '' should make the Select display placeholder.
      // To ensure Select visually resets, we would need to pass `value` prop to Select and control it fully or provide a key to Select to force remount, or ensure `selectedDisplayValue` in Select is reset.
      // For simplicity here, we rely on the user re-selecting or the Select component handling empty `selectedValue`. A key change on the Select component would be a robust way.
      // e.g. <Select key={Date.now()} ...> but this is often too aggressive.
    } catch (error) {
      console.error("Failed to submit product:", error);
      setSubmitError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingCategories && (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="ml-3 text-gray-600">Loading categories...</p>
            </div>
          )}

          {!isFetchingCategories && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  defaultValue={formData.categoryId}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category" name="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input to ensure categoryId is part of form data if native form submission were used */}
                <input
                  type="hidden"
                  name="categoryId"
                  value={formData.categoryId}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 19.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
                  {submitSuccess}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  //   ={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
