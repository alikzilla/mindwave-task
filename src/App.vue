<template>
  <section>
    <h1>Product List</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>

    <form @submit.prevent="onSubmitForm">
      <input v-model="form.product_name" placeholder="Product Name" required />
      <input
        v-model.number="form.product_amount"
        type="number"
        placeholder="Product Amount"
        required
      />
      <button type="submit">{{ isEditing ? "Update" : "Create" }}</button>
    </form>

    <div v-if="products.length <= 0">There is no any products.</div>

    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.product_name }} ({{ product.product_amount }})
        <div>
          <button @click="onEditProduct(product)">Edit</button>
          <button @click="onDeleteProduct(product.id)">Delete</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useCrudStore } from "@/stores/crud";

export default {
  setup() {
    const crudStore = useCrudStore();

    const form = ref({
      product_name: "",
      product_amount: 1,
    });
    const isEditing = ref(false);
    const editingId = ref(null);

    const products = computed(() => crudStore.products);
    const isLoading = computed(() => crudStore.isLoading);
    const error = computed(() => crudStore.error);

    const fetchProducts = async () => {
      await crudStore.fetchProducts();
      console.log(products);
    };

    const onSubmitForm = async () => {
      if (isEditing.value) {
        await crudStore.updateProduct(editingId.value, form.value);
        isEditing.value = false;
        editingId.value = null;
      } else {
        await crudStore.createProduct(form.value);
      }
      resetForm();
      await fetchProducts();
    };

    const onEditProduct = (product) => {
      form.value = { ...product };
      editingId.value = product.id;
      isEditing.value = true;
    };

    const onDeleteProduct = async (id) => {
      await crudStore.deleteProduct(id);
    };

    const resetForm = () => {
      form.value = { product_name: "", product_amount: 1 };
    };

    onMounted(fetchProducts);

    return {
      products,
      isLoading,
      error,
      form,
      isEditing,
      onSubmitForm,
      onEditProduct,
      onDeleteProduct,
    };
  },
};
</script>

<style scoped>
body {
  background-color: #f4f7fc;
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

template {
  width: 100%;
  display: flex;
  align-items: center;
}

section {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

div[v-if="isLoading"],
div[v-if="error"] {
  text-align: center;
  color: #ff6347;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fafafa;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

li button {
  background-color: #ff6f61;
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
}

li button:hover {
  background-color: #e05c4f;
}

li:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
