// ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import { MinusIcon, PlusIcon } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[] | void>();
    const [quantity, setQuantity] = useState(1);
    const { loading, searchProduct, getProductById } = useProductAPI();

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
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

    console.log("Page loading in detail", loading)

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity: quantity }));
            toast.success(`${product.name} added to cart!`);
        }
    };

    const navigate = useNavigate();


    const handleBuy = () => {
        if (product) {
            dispatch(addToCart({ product, quantity: quantity }));
            navigate("/cart")
        }
    };

    const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span className="text-green-600 font-semibold">Sale Ended</span>;
        } else {
            return (
                <div className="text-red-600 font-bold text-xl">
                    {days}d {hours}h {minutes}m {seconds}s
                </div>
            );
        }
    };

    return (
        <Page
            key={product?._id}
            // isLoading={loading}
            pageTitle={product ? product.name : 'Product Details'}
            renderBody={() => (
                <div className="max-w-6xl mx-auto bg-muted rounded-lg shadow-lg p-6 md:p-12">
                    <div className="flex flex-col md:flex-row">
                        {/* Product Images Carousel */}
                        <div className="w-full md:w-1/2 flex rounded-lg flex-col gap-4">
                            <img
                                key={productId}
                                src={product?.imageUrl}
                                alt={product?.name}
                                className="rounded-lg object-contain w-full h-64 md:h-96"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 md:pl-10 mt-6 md:mt-0">
                            {!loading && products?.length! > 0 ? (
                                <div>
                                    <h1 className="text-4xl font-extrabold text-card-foreground mb-4">
                                        {product?.name}
                                    </h1>
                                    <p className="text-white mb-6">{product?.description}</p>

                                    <div className="flex items-center mb-6">
                                        <p className="text-3xl font-bold text-yellow-400 mr-4">
                                            GHS {product?.price.toLocaleString()}
                                        </p>
                                        {product?.oldPrice && product?.oldPrice > product?.price && (
                                            <>
                                                <p className="text-card-foreground line-through text-lg">
                                                    GHS {product?.oldPrice.toLocaleString()}
                                                </p>
                                                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-md ml-4">
                                                    {(
                                                        ((product?.oldPrice - product?.price) /
                                                            product?.oldPrice) *
                                                        100
                                                    ).toFixed(0)}
                                                    % OFF
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="flex items-center">
                                            <Button
                                                variant="secondary"
                                                className="h-6 w-6 p-0 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    decrementQuantity();
                                                }}
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </Button>
                                            <p className="mx-3 text-sm font-medium text-card-foreground">{quantity}</p>
                                            <Button
                                                className="h-6 w-6 bg-yellow-400 p-0 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    incrementQuantity();
                                                }}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={handleAddToCart}
                                        >
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={handleBuy}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>

                                    {/* Timer for Sales Countdown */}

                                    <div className="mt-4 mb-6">
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                            Sale Ends In:
                                        </h3>
                                        <Countdown
                                            date={new Date()}
                                            renderer={renderer}
                                        />
                                    </div>


                                    {/* Return and Delivery Details */}
                                    <div className="border-t pt-6 mt-6">
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                            Delivery & Returns
                                        </h3>
                                        <ul className="list-disc list-inside ">
                                            <li className='text-white'>Delivery: Within 4-7 days</li>
                                            <li className='text-white'>Returns: Item is not refundable</li>
                                        </ul>
                                    </div>

                                    {/* Product Details */}
                                    <div className="border-t pt-6 mt-6">
                                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                            Product Details
                                        </h3>
                                        <ul className="list-disc list-inside text-white">
                                            <li className='text-white'>Category: {product?.category}</li>
                                            <li className='text-white'>Available: {product?.isAvailable ? 'Yes' : 'No'}</li>
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

                    {/* People Also View Section */}
                    {products?.length! > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                                People Also View
                            </h2>

                            {/* Flex Container with fixed-width children */}
                            <div className="flex space-x-4 overflow-x-auto pb-4 flex-nowrap">
                                {products?.map((relatedProduct) => (
                                    // Wrap ProductCard in a div with fixed/min width and prevent shrinking
                                    <div key={relatedProduct._id} className="flex-shrink-0 w-64">
                                        <ProductCard
                                            product={relatedProduct}
                                            onOpenModal={() => { }}
                                        />
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
