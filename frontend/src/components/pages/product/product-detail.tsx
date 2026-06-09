import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, setDrawerOpen } from '@/core/store/slice/cart.slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProductAPI } from '@/hooks/product.hook';
import { Product } from '@/core/interfaces';
import { Page } from '@/components/ui/page';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './product.card';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { ShareButtons } from '@/components/ui/share-button';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>();
    const [quantity, setQuantity] = useState(1);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const { loading, searchProduct, getProductById, trackClick } = useProductAPI();


    const [showFullDesc, setShowFullDesc] = useState(false);
    const MAX_DESC_LENGTH = 200;

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                    const storageKey = `viewed_product_${productId}`;
                    if (!sessionStorage.getItem(storageKey)) {
                        console.log(`[ProductDetail] First view in session, tracking click for: ${productId}`);
                        trackClick(productId);
                        sessionStorage.setItem(storageKey, 'true');
                    } else {
                        console.log(`[ProductDetail] Already viewed in this session, skipping track: ${productId}`);
                    }

                    const data = await getProductById(productId);
                    setProduct(data);

                    if (data) {
                        if (window.fbq) {
                            window.fbq('track', 'ViewContent', {
                                content_name: data.name,
                                content_category: data.category,
                                content_ids: [data._id],
                                contents: [{ id: data._id, quantity: 1 }],
                                content_type: 'product',
                                value: data.price,
                                currency: 'GHS'
                            });
                        }
                        const res = await searchProduct({ category: 'tallow' }, true);
                        const related = (res || []).filter((p) => p._id !== productId);
                        setProducts(related.slice(0, 5));
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                    toast.error('Failed to load product details.');
                }
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {

        if (window.fbq) {
            window.fbq("track", "AddToCart", {
                content_name: product?.name,
                content_category: product?.name,
                content_ids: product ? [product._id] : [],
                contents: product ? [{ id: product._id, quantity }] : [],
                content_type: "product",
                value: (product?.price || 0) * quantity,
                currency: "GHS",
                quantity: quantity,
            })
        }

        if (product) {
            dispatch(addToCart({ product, quantity }));
        }
    };

    const handleBuy = () => {
        if (window.fbq) {
            window.fbq("track", "AddToCart", {
                content_name: product?.name,
                content_category: product?.name,
                content_ids: product ? [product._id] : [],
                contents: product ? [{ id: product._id, quantity }] : [],
                content_type: "product",
                value: (product?.price || 0) * quantity,
                currency: "GHS",
                quantity: quantity,
            })
        }

        if (product) {
            dispatch(addToCart({ product, quantity }));
            dispatch(setDrawerOpen(true));
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
            seoDescription={product ? `${product.name} - Buy traditionally rendered, pure grass-fed ${product.subCategory || 'tallow'} in Ghana for GHS ${product.price}.` : undefined}
            seoKeywords={product ? `${product.name}, ${product.category}, grass-fed ${product.subCategory || 'tallow'}, buy tallow ghana` : undefined}
            ogImage={product?.imageUrl}
            ogType="product"
            renderBody={() => (
                <div className="px-4 sm:px-0 w-full">
                    <div className="max-w-6xl mx-auto mb-10 bg-[#2a2a2a] rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-12 border border-[#3d3d3d]">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-0">

                        {/* Product Image with Zoom */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            {product && (
                                <div 
                                    className="cursor-pointer group/img relative overflow-hidden rounded-2xl bg-[#1d1d1d] flex items-center justify-center w-full h-64 sm:h-80 md:h-96 lg:h-[450px] border border-[#3d3d3d]"
                                    onClick={() => setIsImageOpen(true)}
                                >
                                    <InnerImageZoom
                                        src={product.imageUrl}
                                        zoomSrc={product.imageUrl}
                                        zoomType="hover"
                                        zoomPreload={true}
                                        fadeDuration={150}
                                        className="w-full h-full [&_.iiz__img]:object-contain [&_.iiz__img]:w-full [&_.iiz__img]:h-full [&_.iiz__img]:rounded-2xl"
                                    />
                                    
                                    {/* Expand Indicator on Hover */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/img:opacity-100 border border-white/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 md:pl-8 lg:pl-12 mt-0">
                            {!loading && product ? (
                                <div>
                                    {/* Product Title & Share */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h1 className="text-3xl text-left md:text-4xl font-extrabold text-gray-100">
                                            {product?.name}
                                        </h1>
                                        <div className="flex-shrink-0 mt-1">
                                            <ShareButtons url={shareUrl} title={productTitle} buttonText="" />
                                        </div>
                                    </div>

                                    {/* Category, Subcategory & Stock Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="bg-[#8b7355]/20 text-[#d4c5a9] border border-[#8b7355]/30 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                            {product?.category}
                                        </span>
                                        {product?.subCategory && (
                                            <span className="bg-[#8b7355]/20 text-[#d4c5a9] border border-[#8b7355]/30 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                                {product?.subCategory}
                                            </span>
                                        )}
                                        {product?.isAvailable ? (
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Price Section */}
                                    <div className="flex items-center mb-6">
                                        <p className="text-3xl md:text-4xl font-bold text-[#d4c5a9] mr-4">
                                            GHS {product?.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Purchase Actions (Quantity, Add to Cart, Buy Now) */}
                                    <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-[#3d3d3d]">
                                        {/* Quantity Selector Row */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 font-medium">Quantity:</span>
                                            <div className="flex items-center justify-between border border-[#3d3d3d] rounded-xl px-2 py-1 bg-[#1d1d1d] w-32">
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 w-8 p-0 flex items-center justify-center bg-transparent border-none hover:bg-neutral-800"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        decrementQuantity();
                                                    }}
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </Button>
                                                <p className="text-md font-medium text-gray-100 select-none min-w-[20px] text-center">{quantity}</p>
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
                                        </div>

                                        {/* Actions Buttons Row */}
                                        <div className="flex gap-3 w-full">
                                            <Button onClick={handleAddToCart} className="flex-1 py-6 text-base font-semibold bg-[#8b7355] hover:bg-[#6d5a44]">
                                                Add to Cart
                                            </Button>
                                            <Button variant="secondary" onClick={handleBuy} className="flex-1 py-6 text-base font-semibold">
                                                Buy Now
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    {product?.description && (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-[#3d3d3d] pb-2">
                                                Description
                                            </h3>
                                            <div className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                                                {showFullDesc ? product.description : truncatedDesc}

                                                {/* If description is long AND we're not showing the full text, show "View More" */}
                                                {!showFullDesc && product.description.length > MAX_DESC_LENGTH && (
                                                    <button
                                                        onClick={() => setShowFullDesc(true)}
                                                        className="ml-2 text-[#d4c5a9] inline-flex items-center cursor-pointer text-sm font-semibold hover:text-[#8b7355] transition-colors border-none bg-transparent p-0"
                                                    >
                                                        View More
                                                    </button>
                                                )}

                                                {/* If we're showing the full text AND it's long, show "View Less" */}
                                                {showFullDesc && product.description.length > MAX_DESC_LENGTH && (
                                                    <button
                                                        onClick={() => setShowFullDesc(false)}
                                                        className="ml-2 text-[#d4c5a9] inline-flex items-center cursor-pointer text-sm font-semibold hover:text-[#8b7355] transition-colors border-none bg-transparent p-0"
                                                    >
                                                        View Less
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Countdown Timer */}
                                    <div className="mb-8 bg-[#1d1d1d]/50 border border-[#3d3d3d] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                            ⚡ Special Discount Ends In:
                                        </h4>
                                        <Countdown
                                            date={new Date().getTime() + 1000 * 60 * 60 * 24}
                                            renderer={renderer}
                                        />
                                    </div>

                                    {/* Delivery & Returns */}
                                    <div className="border-t border-[#3d3d3d] pt-6 mb-6">
                                        <h3 className="text-lg font-semibold text-gray-100 mb-4">
                                            Delivery &amp; Returns
                                        </h3>
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-[#d4c5a9] mb-3">🚚 Delivery Coverage</p>
                                            <div className="ml-2 space-y-3">
                                                <div className="flex items-start gap-2.5 text-sm md:text-base text-gray-300">
                                                    <span className="text-green-400 mt-0.5">📍</span>
                                                    <div>
                                                        <span className="font-semibold text-gray-100">Accra</span>
                                                        <span className="mx-2 text-gray-500">→</span>
                                                        <span>Same day delivery</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2.5 text-sm md:text-base text-gray-300">
                                                    <span className="text-yellow-400 mt-0.5">🗺️</span>
                                                    <div>
                                                        <span className="font-semibold text-gray-100">Outside Accra</span>
                                                        <span className="mx-2 text-gray-500">→</span>
                                                        <span>Next day delivery <span className="text-gray-400 text-xs font-normal">(orders placed before 12pm)</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm md:text-base text-gray-300 mt-3">
                                            <span className="mt-0.5">↩️</span>
                                            <div>
                                                <span className="font-semibold text-gray-100">Returns Policy</span>
                                                <span className="mx-2 text-gray-500">→</span>
                                                <span>Item is not refundable</span>
                                            </div>
                                        </div>
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



                    {/* People Also View Section */}
                    {products && products.length > 0 && (
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

                    {/* Full Size Image Lightbox Modal */}
                    {isImageOpen && (
                        <div 
                            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 cursor-pointer transition-opacity duration-300"
                            onClick={() => setIsImageOpen(false)}
                        >
                            <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    onClick={() => setIsImageOpen(false)}
                                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-light focus:outline-none z-50 bg-black/40 rounded-full w-10 h-10 flex items-center justify-center border border-white/10"
                                >
                                    ✕
                                </button>
                                <img 
                                    src={product?.imageUrl} 
                                    alt={product?.name} 
                                    className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                                />
                            </div>
                        </div>
                    )}

                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
                </div>
            )}
        />
    );
};

export default ProductDetailPage;
