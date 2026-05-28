import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Images } from '@/assets/assets';
import { Link } from 'react-router-dom';
import { VideoSlideshow } from '@/components/ui/VideoSlideshow';
import { useState } from 'react';
import { Product } from '@/core/interfaces';
import ProductCard from '../product/product.card';
import ProductModal from '@/components/ui/product.modal';
import { useProductAPI } from '@/hooks/product.hook';

const LandingPage = () => {
    // Use the hook at the top level correctly
    const { products: allProducts } = useProductAPI(true);

    // Derived state or just variable
    const featuredProducts = allProducts ? allProducts.slice(0, 6) : [];

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* ---------------------------------------HERO SECTION--------------------------------------- */}
            <section className="relative w-full min-h-[5vh] flex items-center overflow-hidden bg-transparent">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                        {/* Left Side - Content */}
                        <div className="flex gap-2 lg:gap-12">
                            {/* Slide Numbers */}
                            <div className="hidden lg:flex flex-col gap-6 text-gray-400 flex-shrink-0">
                                <div className="text-2xl font-light text-gray-800">02</div>
                                <div className="w-px h-24 bg-gray-300 mx-auto"></div>
                                <div className="text-2xl font-light text-gray-800">04</div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                    Ancestral{' '}
                                    <span className="block mt-2 text-gray-700">Beef & Goat</span>
                                    <span className="block mt-2 text-gray-700">Tallow Collection</span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-600 italic font-light max-w-md">
                                    Pure, ancestral goodness in every jar.
                                </p>

                                <div className="pt-4">
                                    <Link to="/products">
                                        <Button
                                            size="lg"
                                            className="bg-[#1d1d1d] hover:bg-[#333] text-white rounded-md px-10 py-6 text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            Try Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                       
                    </div>
                </div>
            </section>

            {/* ---------------------------------------
          FEATURED PRODUCTS SHOWCASE
      --------------------------------------- */}
            {featuredProducts.length > 0 && (
                <section className="py-5 bg-white">
                    <div className="container px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 font-bold">Featured Products</h2>
                            <p className="text-gray-600 text-lg">Our customers' favorites</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto place-items-center">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onOpenModal={openModal}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link to="/products">
                                <Button className="bg-[#1d1d1d] text-white hover:bg-[#333] px-8 py-6 rounded-full text-lg">
                                    View All Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ---------------------------------------
          FEATURES / CATEGORIES
      --------------------------------------- */}
            <section className="py-5 bg-transparent">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 font-bold">Our Collection</h2>
                        <p className="text-gray-600 text-lg">Traditional nourishment for modern living.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 - Cooking Oils */}
                        <div className="flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-gray-100 mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border border-gray-200">
                                <img
                                    src="https://res.cloudinary.com/dyua9sfez/image/upload/v1769895230/photo_7_2026-01-31_21-33-30_piv24z.jpg"
                                    alt="Cooking Oils - Goat, Beef Tallow & Ghee"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Cooking Oils</h3>
                            <p className="text-sm text-gray-600 mb-2">Goat, Beef Tallow & Ghee</p>
                            <Link to="/products">
                                <Button variant="link" className="text-gray-700 hover:text-black font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                            </Link>
                        </div>

                        {/* Feature 2 - Skin Care */}
                        <div className="flex flex-col items-center text-center group cursor-pointer mt-12 md:mt-0">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-gray-100 mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border border-gray-200">
                                <img
                                    src="https://res.cloudinary.com/dyua9sfez/image/upload/v1735639715/trip_images/kkorgq4e8d9uuc8qfr6b.jpg"
                                    alt="Skin Care - Nourishing Tallow Balms"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Skin Care</h3>
                            <p className="text-sm text-gray-600 mb-2">Nourishing Tallow Balms</p>
                            <Link to="/products">
                                <Button variant="link" className="text-gray-700 hover:text-black font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                            </Link>
                        </div>

                        {/* Feature 3 - Hair Care */}
                        <div className="flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-gray-100 mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border border-gray-200">
                                <img
                                    src="https://res.cloudinary.com/dyua9sfez/image/upload/v1735639715/trip_images/kkorgq4e8d9uuc8qfr6b.jpg"
                                    alt="Hair Care - Traditional Nourishment"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Hair Care</h3>
                            <p className="text-sm text-gray-600 mb-2">Traditional Nourishment</p>
                            <Link to="/products">
                                <Button variant="link" className="text-gray-700 hover:text-black font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* ---------------------------------------
          PROMO BANNER
      --------------------------------------- */}
            <section className="py-12 bg-[#1d1d1d] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    {/* Goat silhouette - top left */}
                    <img src={Images.Goat} alt="" className="absolute top-10 left-10 w-32 h-32 rotate-12 " />

                    {/* Cow silhouette - bottom right */}
                    <img src={Images.Cow} alt="" className="absolute bottom-10 right-10 w-48 h-48 -rotate-12 text-white" />
                </div>

                <div className="container px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
                        Ghana's Ancestral <br /> Tallow Tradition
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Pure Goat, Beef Tallow, and Ghee. Crafted with respect for tradition and the earth. Nourish your body inside and out.
                    </p>
                    <Link to="/products">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold">
                            Explore Collection
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ---------------------------------------
          VIDEO SLIDESHOW - COOKING OILS & MORE
      --------------------------------------- */}
            <section className="py-5 bg-transparent">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 font-bold">
                            Cooking Oils & More
                        </h3>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover how our ancestral tallow transforms cooking and enhances your lifestyle
                        </p>
                    </div>

                    <VideoSlideshow />
                </div>
            </section>

            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default LandingPage;
