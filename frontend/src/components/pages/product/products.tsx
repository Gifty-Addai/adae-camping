import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(productsData);
  const [filters, setFilters] = React.useState<string[]>([]);
  const [sortOption, setSortOption] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  React.useEffect(() => {
    let updatedProducts = [...productsData];

    if (filters.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filters.includes(product.category)
      );
    }

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption) {
      updatedProducts.sort((a, b) => {
        switch (sortOption) {
          case 'price_low_high':
            return a.price - b.price;
          case 'price_high_low':
            return b.price - a.price;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(updatedProducts);
  }, [filters, sortOption, searchQuery]);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (

    <Page
      renderBody={() => (
        <div className="mt-24">
          {/* Banner */}
          <section className="mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between p-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                Prepare your gears for the adventure ahead!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Discover the best deals for your next adventure.
              </p>
              <Button className="mt-4">
                Shop Now
              </Button>
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
              onFilterChange={setFilters}
              onSortChange={setSortOption}
            />
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <DarkModeToggle />
              <Basket />
            </div>
          </div>

          {/* Product Grid */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
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
          <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
          <ToastContainer />
        </div>
      )}
    />

  );
};

export default StorePage;
