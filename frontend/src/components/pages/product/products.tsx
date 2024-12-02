import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '@/components/ui/product.modal';
import Filters from '@/components/ui/filter';
import ProductCard from './product.card';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/loader/_spinner';
import { useProductAPI } from '@/hooks/api.hook';

const StorePage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, searchProduct } = useProductAPI();

  // Function to fetch products based on search and category filter
  const fetchProducts = async (searchQuery: string, categoryFilter: string) => {
      
      searchProduct({ name: searchQuery, category:categoryFilter });
  };

  // Call fetchProducts on initial load with no filters
  useEffect(() => {
    fetchProducts(searchQuery, categoryFilter);
  }, []);

  // Handle manual search
  const handleSearch = async () => {
    fetchProducts(searchQuery, categoryFilter);
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    fetchProducts('', ''); 
  };

  const noProductsFoundMessage = (
    <div className="flex justify-center items-center flex-col text-center p-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Oops, no products found! 🏕️
      </h3>
      <p className="text-gray-500 mb-4">
        We couldn’t find anything matching your search or filter. Try something different!
      </p>
      <Button className="mt-4" onClick={handleResetFilters}>
        Reset Filters 🔄
      </Button>
    </div>
  );

  return (
    <>
      <Page
        renderBody={() => (
          <div className="mt-24">
            {/* Banner */}
            <section className="mb-8 bg-gray-700 rounded-lg flex items-center justify-between p-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-100">
                  Prepare your gears for the adventure ahead!
                </h1>
                <p className="mt-2 text-gray-300">
                  Discover the best deals for your next adventure.
                </p>
                <Button className="mt-4">Shop Now</Button>
              </div>
              <img
                src="/images/banner.jpg"
                alt="Promotional Banner"
                className="h-48 object-cover rounded-lg"
              />
            </section>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <Filters
                categories={products}
                onFilterChange={handleCategoryFilterChange}
                onSearchChange={setSearchQuery}
                categoryValue={categoryFilter}
                searchQuery={searchQuery}
                onSearch={handleSearch}              />

            </div>

            {/* Product Grid */}
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Explore Our Products!
            </h2>

            {loading ? (
              <div
                className={cn(
                  'fixed top-0 left-0 w-full h-full flex items-center bg-primary justify-center z-50',
                  loading && 'bg-primary/50'
                )}
              >
                <div className="text-center flex relative flex-col">
                  <Spinner size={'xl'} />
                </div>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOpenModal={openModal}
                  />
                ))}
                
              </div>
              {
                products.length == 0 && (noProductsFoundMessage)
              }
              </>
            )}

            {/* Modal */}
            <ToastContainer />
          </div>
        )}
      />
      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default StorePage;
