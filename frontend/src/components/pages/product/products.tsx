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
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';
import { useProductAPI } from '@/hooks/product.hook';

const StorePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, isSuggestion, totalPages, currentPage, goToPage } = useProductAPI(true);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);


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
          <div className="mt-3 bg-[#2a2a2a] p-6 rounded-2xl">
            {/* Product Grid */}
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Explore Our Products!
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder skeletons for products */}
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-[#2a2a2a] rounded-3xl animate-pulse h-96 border border-[#3d3d3d]"></div>
                ))}
              </div>
            ) : products.length === 0 && !isSuggestion ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-[#1d1d1d] p-6 rounded-full border border-[#3d3d3d] mb-6 shadow-xl">
                  <ShoppingCart className="w-16 h-16 text-[#8b7355] opacity-50" />
                </div>
                <h3 className="text-3xl font-serif text-gray-100 mb-3 font-bold">
                  No Products Found
                </h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg mb-8 leading-relaxed">
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
                  <div className="mb-8 p-6 bg-[#1d1d1d] rounded-xl border border-[#3d3d3d]">
                    <h3 className="text-xl font-bold text-gray-100 mb-2 flex items-center gap-2">
                      <span className="text-2xl">🔍</span> No exact matches found
                    </h3>
                    <p className="text-gray-400">
                      We couldn't find exactly what you looked for, but check out these suggested products!
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
