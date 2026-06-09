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
import { Helmet } from 'react-helmet';

const LandingPage = () => {
    // Use the hook at the top level correctly
    const { products: allProducts, loading } = useProductAPI(true);

    // Derived state or just variable
    const featuredProducts = allProducts ? allProducts.slice(0, 6) : [];

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);

        if (window.fbq) {
            window.fbq.push("trackCustom", "View Product Content", {
                content_category: [product.name],
                content_ids: [product.name],
                content_type: "product",
                value: product.price,
                currency: "GHS",
            })
        }
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <Helmet>
                <title>Ancestral Tallow | Pure Grass-Fed & Finished Tallow & Ghee in Ghana</title>
                <meta name="description" content="Experience the nourishment our ancestors knew. Pure beef, goat, and sheep tallow rendered traditionally for cooking, baking, and skincare. Ethically sourced from locally raised grass-fed cattle in Ghana." />
                <meta name="keywords" content="tallow cooking oil, grass-fed beef tallow, goat tallow, sheep tallow, cooking ghee, ancestral skincare, healthy cooking fat, Ghana, local Ghanaian farm sourcing" />
                <link rel="canonical" href="https://ancestraltallow.gh/" />
                <meta property="og:title" content="Ancestral Tallow | Pure Grass-Fed & Finished Tallow & Ghee" />
                <meta property="og:description" content="Pure beef, goat, and sheep tallow rendered traditionally for cooking, baking, and skincare in Ghana." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ancestraltallow.gh/" />
                <meta property="og:image" content="/main_logo.jpg" />
            </Helmet>
            {/* ---------------------------------------HERO SECTION--------------------------------------- */}


            {/* ---------------------------------------
          FEATURED PRODUCTS SHOWCASE
      --------------------------------------- */}
            {(loading || featuredProducts.length > 0) && (
                <section className="py-0 bg-white">
                    <div className="container px-4">
                        <div className="text-center mb-5">
                            {/* <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 font-bold">Featured Products</h2> */}
                            <p className="text-gray-900 uppercase text-lg">Our customers' favorites</p>
                        </div>

                        {loading ? (
                            /* Shimmer skeleton grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                                    >
                                        {/* Image placeholder */}
                                        <div className="relative h-64 bg-gray-200 overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                        </div>
                                        {/* Text placeholders */}
                                        <div className="p-4 space-y-3">
                                            <div className="relative h-4 w-3/4 rounded bg-gray-200 overflow-hidden">
                                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                            </div>
                                            <div className="relative h-4 w-1/2 rounded bg-gray-200 overflow-hidden">
                                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                            </div>
                                            <div className="relative h-9 w-full rounded-lg bg-gray-200 overflow-hidden mt-2">
                                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto place-items-center">
                                {featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onOpenModal={openModal}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && (
                            <div className="text-center mt-12">
                                <Link to="/products">
                                    <Button className="bg-[#1d1d1d] text-white hover:bg-[#333] px-8 py-6 rounded-full text-lg">
                                        View All Products
                                    </Button>
                                </Link>
                            </div>
                        )}
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
                                    className="absolute inset-0 w-full h-full object-fill"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Cooking Oils</h3>
                            <p className="text-sm text-gray-600 mb-2">Goat, Beef Tallow & Ghee</p>
                            <Link to="/products?subCategory=Oils">
                                <Button variant="link" className="text-gray-700 hover:text-black font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                            </Link>
                        </div>

                        {/* Feature 2 - Skin Care */}
                        <div className="flex flex-col items-center text-center group cursor-pointer mt-12 md:mt-0">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-gray-100 mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border border-gray-200">
                                <img
                                    src="https://res.cloudinary.com/dyua9sfez/image/upload/v1735639715/trip_images/kkorgq4e8d9uuc8qfr6b.jpg"
                                    alt="Skin Care - Nourishing Tallow Balms"
                                    className="absolute inset-0 w-full h-full object-fill"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Skin & Hair Care</h3>
                            <p className="text-sm text-gray-600 mb-2">Nourishing Tallow Balms</p>
                            <Link to="/products?subCategory=skin %26 hair">
                                <Button variant="link" className="text-gray-700 hover:text-black font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                            </Link>
                        </div>

                        {/* Feature 3 - Hair Care */}
                        <div className="flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-gray-100 mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border border-gray-200">
                                <img
                                    src="https://res.cloudinary.com/dyua9sfez/image/upload/v1780651416/trip_images/lnnbox90aj8bzgctegym.jpg"
                                    alt="Hair Care - Traditional Nourishment"
                                    className="w-full h-full object-fill"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2 font-semibold">Broths</h3>
                            <p className="text-sm text-gray-600 mb-2">Bone Broth</p>
                            <Link to="/products?subCategory=broth">
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
