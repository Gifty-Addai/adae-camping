import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '@/components/ui/product.modal';
import Filters from '@/components/ui/filter';
import ProductCard from './product.card';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { cn, postRequest } from '@/lib/utils';
import { Spinner } from '@/components/ui/loader/_spinner';
import { debounce } from 'lodash';

const StorePage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  filteredProducts.map((prod)=>console.log("filterproducts" , prod._id))
  

  // Debounced search query
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string, categoryFilter: string) => {
      setLoading(true);
      try {
        const params = {
          name: searchQuery,
          category: categoryFilter,
        };
        const response = await postRequest<Product[]>('/api/product/searchProducts', params);
        setFilteredProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }, 2000)
  ).current;

  useEffect(() => {

    debouncedSearch(searchQuery, categoryFilter);

  }, [searchQuery, categoryFilter]);

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
  };

  const noProductsFoundMessage = searchQuery || categoryFilter ? (
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
  ) : (
    <div className="flex justify-center items-center flex-col text-center p-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Oops, looks like we’re out of stock! 🏕️
      </h3>
      <p className="text-gray-500 mb-4">
        We might be out on a camping trip ourselves! But don’t worry, we’ll be back soon with fresh stock. 🌲
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
                categories={filteredProducts}
                onFilterChange={handleCategoryFilterChange}
                onSearchChange={setSearchQuery}
                categoryValue={categoryFilter}
                searchQuery={searchQuery}
              />
            </div>

            {/* Product Grid */}
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Explore Our Products!
            </h2>

            {loading ? (
              <div
                className={cn(
                  "fixed top-0 left-0 w-full h-full flex items-center bg-primary justify-center z-50",
                  loading && "bg-primary/50"
                )}
              >
                <div className="text-center flex relative flex-col">
                  <Spinner size={"xl"} />
                </div>
              </div>
            ) 
            : 
            filteredProducts.length === 0 ? (
              noProductsFoundMessage
            ) 
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOpenModal={openModal}
                  />
                ))}
              </div>
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
