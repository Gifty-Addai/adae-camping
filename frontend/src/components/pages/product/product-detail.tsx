import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/core/store/slice/cart.slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProductAPI } from '@/hooks/product.hook';
import { Product } from '@/core/interfaces';
import { Page } from '@/components/ui/page';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './product.card';
import { MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
import { ShareButtons } from '@/components/ui/share-button';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { RootState } from '@/core/store/store';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useDispatch();
    const totalItems = useSelector((state: RootState) => state.cart.totalItems);
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[] | void>();
    const [quantity, setQuantity] = useState(1);
    const { loading, searchProduct, getProductById } = useProductAPI();
    const navigate = useNavigate();

    // -- ADD THESE STATE/CONSTANTS:
    const [showFullDesc, setShowFullDesc] = useState(false);
    const MAX_DESC_LENGTH = 200; // Adjust this limit as you like

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                    const res = await searchProduct({}, true);
                    setProducts(res);
                    const data = await getProductById(productId);
                    setProduct(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                    toast.error('Failed to load product details.');
                }
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }));
            toast.success(`${product.name} added to cart!`);
        }
    };

    const handleBuy = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }));
            navigate('/cart');
        }
    };

    // Simple countdown renderer
    const renderer: CountdownRendererFn = ({ completed }) => {
        if (completed) {
            return <span className="text-green-600 font-semibold">Discount Ended</span>;
        } else {
            return (
                <div className="text-red-600 font-bold text-xl md:text-2xl">
                    {0}d {0}h {0}m {0}s
                </div>
            );
        }
    };

    const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
    const shareUrl = `${baseUrl}/product/${encodeURIComponent((product?.name || '').substring(0, 30))}/${product?._id ?? ''}`;
    const productTitle = product?.name || 'Product Details';

    const truncatedDesc =
        product?.description && product.description.length > MAX_DESC_LENGTH
            ? product.description.substring(0, MAX_DESC_LENGTH) + '...'
            : product?.description;

    return (
        <Page
            key={product?._id}
            pageTitle={product ? product.name : 'Product Details'}
            renderBody={() => (
                <div className="max-w-6xl mx-auto bg-[#2a2a2a] rounded-2xl shadow-2xl p-4 md:p-6 lg:p-12 border border-[#3d3d3d]">
                    <div className="flex flex-col md:flex-row">

                        {/* Product Image with Zoom */}
                        <div className="w-full md:w-1/2 flex rounded-lg flex-col gap-4">
                            {product && (
                                <InnerImageZoom
                                    src={product.imageUrl}
                                    zoomSrc={product.imageUrl}
                                    zoomType="hover"
                                    zoomPreload={true}
                                    fadeDuration={150}
                                    className="rounded-2xl object-fill w-full h-74 md:h-80 lg:h-96"
                                />
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 md:pl-8 lg:pl-12 mt-6 md:mt-0">
                            {!loading && products?.length! > 0 ? (
                                <div>
                                    <h1 className="text-3xl text-center md:text-4xl font-extrabold text-gray-100 mb-3 md:mb-4">
                                        {product?.name}
                                    </h1>

                                    {/* DESCRIPTION WITH VIEW MORE/LESS */}
                                    {product?.description && (
                                        <p className="text-xs text-muted-foreground mb-4 md:mb-6">
                                            {showFullDesc ? product.description : truncatedDesc}

                                            {/* If description is long AND we're not showing the full text, show "View More" */}
                                            {!showFullDesc && product.description.length > MAX_DESC_LENGTH && (
                                                <span
                                                    onClick={() => setShowFullDesc(true)}
                                                    className="ml-2 text-[#d4c5a9] cursor-pointer text-sm font-semibold hover:text-[#8b7355]"
                                                >
                                                    View More
                                                </span>
                                            )}

                                            {/* If we're showing the full text AND it's long, show "View Less" */}
                                            {showFullDesc && product.description.length > MAX_DESC_LENGTH && (
                                                <span
                                                    onClick={() => setShowFullDesc(false)}
                                                    className="ml-2 text-[#d4c5a9] cursor-pointer text-sm font-semibold hover:text-[#8b7355]"
                                                >
                                                    View Less
                                                </span>
                                            )}
                                        </p>
                                    )}

                                    <div className="flex items-center mb-4 md:mb-6">
                                        <p className="text-2xl md:text-3xl font-bold text-[#d4c5a9] mr-3 md:mr-4">
                                            GHS {product?.price.toLocaleString()}
                                        </p>
                                        <>
                                            <p className="text-sm md:text-base text-gray-400 line-through">
                                                GHS {0}
                                            </p>
                                            <span className="bg-red-500 text-white text-xs md:text-sm px-2 py-1 rounded-md ml-2 md:ml-4">
                                                {0}% OFF
                                            </span>
                                        </>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 md:mb-6">
                                        <div className="flex items-center">
                                            <Button
                                                variant="secondary"
                                                className="h-8 w-8 p-0 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    decrementQuantity();
                                                }}
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </Button>
                                            <p className="mx-3 text-md font-medium text-gray-100">{quantity}</p>
                                            <Button
                                                className="h-8 w-8 bg-[#8b7355] hover:bg-[#6d5a44] p-0 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    incrementQuantity();
                                                }}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex space-x-4">
                                            <Button onClick={handleAddToCart} className="w-full sm:w-auto">
                                                Add to Cart
                                            </Button>
                                            <Button variant="secondary" onClick={handleBuy} className="w-full sm:w-auto">
                                                Buy Now
                                            </Button>
                                        </div>
                                    </div>

                                    {/* SHARE FEATURE */}
                                    <div className="mt-4 mb-6">
                                        <ShareButtons url={shareUrl} title={productTitle} />
                                    </div>

                                    {/* Timer for Sales Countdown */}
                                    <div className="mt-4 mb-4 md:mb-6">
                                        <h3 className="text-md md:text-lg font-semibold text-gray-100 mb-1 md:mb-2">
                                            Discount Sale Ends In:
                                        </h3>
                                        <Countdown
                                            date={new Date().getTime() + 1000 * 60 * 60 * 24}
                                            renderer={renderer}
                                        />
                                    </div>

                                    {/* Delivery & Returns */}
                                    <div className="border-t pt-4 md:pt-6 mt-4 md:mt-6">
                                        <h3 className="text-md md:text-lg font-semibold text-gray-100 mb-2">
                                            Delivery & Returns
                                        </h3>
                                        <ul className="list-disc list-inside text-sm md:text-base text-gray-300">
                                            <li className="text-gray-300">Delivery: Within 4-7 working days</li>
                                            <li className="text-gray-300">Returns: Item is not refundable</li>
                                        </ul>
                                    </div>

                                    {/* Product Details */}
                                    <div className="border-t pt-4 md:pt-6 mt-4 md:mt-6">
                                        <h3 className="text-md md:text-lg font-semibold text-gray-100 mb-2">
                                            Product Details
                                        </h3>
                                        <ul className="list-disc list-inside text-sm md:text-base text-gray-300">
                                            <li className="text-gray-300">Category: {product?.category}</li>
                                            <li className="text-gray-300">
                                                Available: {product?.isAvailable ? 'Yes' : 'No'}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-4" />
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            )}
                        </div>
                    </div>

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

                    {/* People Also View Section */}
                    {products?.length! > 0 && (
                        <div className="mt-8 md:mt-12">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 md:mb-6">
                                People Also View
                            </h2>
                            <div className="flex space-x-4 overflow-x-auto pb-4 flex-nowrap">
                                {products?.map((relatedProduct) => (
                                    <div key={relatedProduct._id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
                                        <ProductCard product={relatedProduct} onOpenModal={() => { }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            )}
        />
    );
};

export default ProductDetailPage;
