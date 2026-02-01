import { Input } from "@/components/ui/input";
import { Product, ProductFormData } from "@/core/interfaces";
import React, { useState } from "react";
import AdminProductModal from "../../AdComponents/admin_product_modal";
import { Button } from "@/components/ui/button";
import AdminProductCard from "../../AdComponents/admin_product_card";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/loader/_spinner";
import Pagination from "@/components/ui/pagination";
import { useProductAPI } from "@/hooks/product.hook";
import { Page } from "@/components/ui/page";
import { toast } from "react-toastify";
import StatisticsCard from "../../AdComponents/booking-statistics-card";
import { Book, CheckCircle, Clock } from "lucide-react";

const AdminProductDash: React.FC = () => {
  const { products, loading, addProduct, activeProducts, inActiveProducts, totalProducts, editProduct, removeProduct, searchProduct, totalPages, currentPage, goToPage } = useProductAPI(undefined, true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [action, setAction] = useState<"add" | "update" | null>(null);

  const handleSearch = (): void => {
    searchProduct({ name: searchQuery }, undefined);
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

  const handleSaveProduct = async (data: ProductFormData): Promise<boolean> => {
    console.info(`action performing ${action} data : ${data}`)
    try {
      let success = false;
      // Try updating or adding the product
      if (action === "update" && productToEdit) {
        success = await editProduct(productToEdit._id, data);
      } else if (action === "add") {
        success = await addProduct(data);
      }
      return success;

    } catch (error) {
      // If there's an error, handle it (show a toast or alert)
      toast.error("Error saving product");
      return false;
      // The modal stays open to allow the user to retry
    }
  };


  return (
    <Page
      pageTitle="Admin Products"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatisticsCard
              title="Total Products"
              value={totalProducts}
              icon={<Book className="w-3 h-3 text-indigo-600" />}
              color="bg-indigo-600"
            />
            <StatisticsCard
              title="Active"
              value={activeProducts}
              icon={<CheckCircle className="w-3 h-3 text-green-500" />}
              color="bg-green-500"
            />
            <StatisticsCard
              title="InActive"
              value={inActiveProducts}
              icon={<Clock className="w-3 h-3 text-yellow-500" />}
              color="bg-yellow-500"
            />
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex space-x-2 w-full sm:w-auto">
                <Input
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded w-full sm:w-64"
                />
                <Button onClick={handleSearch} className="bg-[#8b7355] hover:bg-[#6d5a44] text-white px-4 py-2 w-full sm:w-auto">
                  Search
                </Button>
              </div>
              <Button
                onClick={handleAddProduct}
                className="bg-[#8b7355] hover:bg-[#6d5a44] text-white px-6 py-2 w-full sm:w-auto mt-4 sm:mt-0"
              >
                Add Product
              </Button>
            </div>

            {loading ? (
              <div
                className={cn(
                  'fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                )}
              >
                <div className="text-center flex relative flex-col">
                  <Spinner size={'xl'} />
                </div>
              </div>
            ) : (
              <>
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
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}
                  />

                )}
              </>
            )}

            {showModal && (
              <AdminProductModal
                product={productToEdit}
                onClose={() => setShowModal(false)}
                onOpen={showModal}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
                action={action}
              />
            )}
          </div>
        </div>
      )}
    />

  );
};

export default AdminProductDash;
