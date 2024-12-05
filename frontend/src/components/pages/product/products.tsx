import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '@/components/ui/product.modal';
import Filters from '@/components/ui/filter';
import ProductCard from './product.card';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { useProductAPI } from '@/hooks/api.hook';
import Pagination from './pagination';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';

const StorePage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, searchProduct, isSuggestion, totalPages, currentPage, goToPage } = useProductAPI();
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  const handleSearch = (): void => {
    console.log("fetch")
    searchProduct({ name: searchQuery, category: categoryFilter });
  }


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
    searchProduct({});
  };

  const noProductsFoundMessage = (
    <div className="flex justify-center items-center flex-col text-center p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Oops, no products found! 🏕️
      </h3>
      <p className="text-gray-500 mb-4">
        We couldn’t find anything matching your search or filter.
        But don’t worry, we’ve got some great suggestions that might just spark your interest!
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
                <h1 className="text-3xl font-bold text-gray-100">
                  Prepare your gears for the adventure ahead!
                </h1>
                <p className="mt-2 text-gray-300">
                  Discover the best deals for your next adventure.
                </p>
                {/* <Button className="mt-4">Shop Now</Button> */}
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
                onSearch={handleSearch} />

            </div>

            {/* Product Grid */}
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Explore Our Products!
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                {/* Placeholder skeletons for products */}
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-gray-300 rounded-lg animate-pulse h-56"></div>
                ))}
              </div>
            ) : isSuggestion ? (
              <>
                {noProductsFoundMessage}
                <h2 className="text-2xl font-bold text-card-foreground mb-5">
                  Suggested For You 🛒
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">

                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onOpenModal={openModal}
                    />
                  ))}
                </div>
              </>
            )
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onOpenModal={openModal}
                    />
                  ))}
                </div>
              )}

            <Link to="/cart">
              <Button className="fixed bottom-4 right-4 bg-gray-400 p-2 sm:hidden z-50 shadow-lg">
                <div className="relative">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -mt-1 -mr-1">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Button>
            </Link>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}
              />

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
