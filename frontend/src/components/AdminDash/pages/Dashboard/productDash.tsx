import { Input } from "@/components/ui/input";
import { Product, ProductFormData } from "@/core/interfaces";
import { useProductAPI } from "@/hooks/api.hook";
import React, { useState } from "react";
import AdminProductModal from "../../AdComponents/admin_product_modal";
import { Button } from "@/components/ui/button";
import AdminProductCard from "../../AdComponents/admin_product_card";

const AdminProductDash: React.FC = () => {
  const { products, loading, addProduct, editProduct, removeProduct, searchProduct, apiError } = useProductAPI();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [action, setAction] = useState<"add" | "update" | null>(null);

  const handleSearch = (): void => {
    searchProduct({ name: searchQuery });
  };

  const handleAddProduct = (): void => {
    setProductToEdit(null);
    setAction("add");
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string): void => {
    removeProduct(id);
  };

  const handleEditProduct = (product: Product): void => {
    setProductToEdit(product);
    setAction("update");
    setShowModal(true);
  };

  const handleSaveProduct = async (data: ProductFormData) => {
    console.info(`action performing ${action} data : ${data}`)
    try {
      // Try updating or adding the product
      if (action === "update" && productToEdit) {
        editProduct(productToEdit._id, data);
      } else if (action === "add") {
        addProduct(data);
      }


    } catch (error) {
      // If there's an error, handle it (show a toast or alert)
      console.error("Error saving product:", error);
      // The modal stays open to allow the user to retry
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-2 w-full sm:w-auto">
          <Input
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded w-full sm:w-64"
          />
          <Button onClick={handleSearch} className="bg-yellow-400 text-white px-4 py-2 w-full sm:w-auto">
            Search
          </Button>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-6 py-2 w-full sm:w-auto mt-4 sm:mt-0"
        >
          Add Product
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product: Product) => (
            <AdminProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AdminProductModal
          product={productToEdit}
          onClose={()=>setShowModal(false)}
          onOpen={showModal}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          action={action}
        />
      )}
    </div>
  );
};

export default AdminProductDash;
