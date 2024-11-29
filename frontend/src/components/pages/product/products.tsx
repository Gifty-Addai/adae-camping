import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitcher from '@/components/ui/language.switcher';
import DarkModeToggle from '@/components/ui/dark_mode_toggle';
import ProductModal from '@/components/ui/product.modal';
import Basket from '@/components/ui/basket';
import Filters from '@/components/ui/filter';
import ProductCard from './product.card';
import productsData from '@/data/data.data';
import { Product } from '@/core/interfaces';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';

const StorePage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(productsData);
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');  // Empty for "All" category
  const [searchQuery, setSearchQuery] = React.useState<string>(''); // Search query
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Get categories from the products data
  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  React.useEffect(() => {
    let updatedProducts = [...productsData];

    // Apply category filter if selected
    if (categoryFilter && categoryFilter !== '') {
      updatedProducts = updatedProducts.filter((product) => product.category === categoryFilter);
    }

    // Apply search query filter (if any)
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Update filtered products
    setFilteredProducts(updatedProducts);
  }, [categoryFilter, searchQuery]);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query); 
  };

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
                categories={categories}
                onFilterChange={handleCategoryFilterChange}
                onSearchChange={handleSearchChange}
              />
              <div className="flex items-center space-x-4">
                {/* <LanguageSwitcher />
                <DarkModeToggle /> */}
                <Basket />
              </div>
            </div>

            {/* Product Grid */}
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Explore Our Products!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenModal={openModal}
                />
              ))}
            </div>

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
