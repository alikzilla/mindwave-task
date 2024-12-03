import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export interface Product {
  id: number;
  product_name: string;
  product_amount: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/sandbox/crud";

export const useCrudStore = defineStore("crud", () => {
  const products = ref<Product[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchProducts = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get<{ content: { rows: Product[] } }>(
        API_BASE_URL
      );
      products.value = response.data.content.rows;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch products";
    } finally {
      isLoading.value = false;
    }
  };

  const createProduct = async (product: Omit<Product, "id">): Promise<void> => {
    try {
      const response = await axios.post<{ content: Product }>(
        API_BASE_URL,
        product
      );
      const newProduct = response.data.content;
      if (newProduct) {
        products.value.push(newProduct);
      }
    } catch (err: any) {
      error.value = err.message || "Failed to create product";
    }
  };

  const updateProduct = async (
    id: number,
    updatedProduct: Partial<Product>
  ): Promise<void> => {
    try {
      const response = await axios.put<{ content: Product }>(
        `${API_BASE_URL}/${id}`,
        updatedProduct
      );
      const updatedData = response.data.content;
      const index = products.value.findIndex((product) => product.id === id);
      if (index !== -1 && updatedData) {
        products.value[index] = updatedData;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to update product";
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      products.value = products.value.filter((product) => product.id !== id);
    } catch (err: any) {
      error.value = err.message || "Failed to delete product";
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
