import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '@/components/ui/product.modal';
import ProductCard from './product.card';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import Pagination from '../../ui/pagination';
import { ShoppingCart } from 'lucide-react';
import { useProductAPI } from '@/hooks/product.hook';

const StorePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, isSuggestion, totalPages, currentPage, goToPage } = useProductAPI(true);
  // const totalItems = useSelector((state: RootState) => state.cart.totalItems);


  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };





  return (
    <>
      <Page

        pageTitle='Products'

        renderBody={() => (
          <div className="">
            {/* Product Grid */}
            <h2 className="text-2xl font-bold mt-0 text-gray-900 mb-4 font-serif">
              Explore Our Products!
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Placeholder skeletons for products */}
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-2xl animate-pulse h-72 border border-gray-300"></div>
                ))}
              </div>
            ) : products.length === 0 && !isSuggestion ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 p-6 rounded-full border border-gray-200 mb-6 shadow-xl">
                  <ShoppingCart className="w-16 h-16 text-[#8b7355] opacity-50" />
                </div>
                <h3 className="text-3xl font-serif text-gray-900 mb-3 font-bold">
                  No Products Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg mb-8 leading-relaxed">
                  We couldn't find any ancestral tallow products at the moment. Please check your connection or try again later.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#8b7355] hover:bg-[#6d5a44] text-white px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                >
                  Refresh Page
                </Button>
              </div>
            ) : (
              <>
                {isSuggestion && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-2xl">🔍</span> No exact matches found
                    </h3>
                    <p className="text-gray-600">
                      We couldn't find exactly what you looked for, but check out these suggested products!
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onOpenModal={openModal}
                    />
                  ))}
                </div>
              </>
            )}



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
