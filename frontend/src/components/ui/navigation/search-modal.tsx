import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/core/interfaces';
import { postRequest } from '@/lib/api-Request/api-requests';
import { Button } from '@/components/ui/button';
import { useProductAPI } from '@/hooks/product.hook';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { trackClick } = useProductAPI();

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setSuggestions([]);
            setProducts([]);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle Search
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setSuggestions([]);
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                // Search specifically for tallow products
                // Search specifically for tallow products
                const response = await postRequest<{
                    products: Product[];
                    totalProducts: number;
                }>("/api/product/searchProducts", {
                    name: query,
                    category: 'tallow', // Enforce tallow category
                    isAvailable: true,  // Only available products
                    limit: 5
                });

                if (response && response.products) {
                    // Split results into suggestions (names) and products (display)
                    setSuggestions(response.products.slice(0, 3));
                    setProducts(response.products.slice(0, 2));
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-center items-start pt-20">
            {/* Modal Container */}
            <div className="w-full max-w-4xl bg-[#1d1d1d] rounded-2xl shadow-2xl border border-[#333] overflow-hidden mx-4 animate-in fade-in slide-in-from-top-10 duration-200">

                {/* Header / Search Bar */}
                <div className="flex items-center p-6 border-b border-[#333]">
                    <Search className="w-6 h-6 text-gray-400 mr-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for tallow products..."
                        className="flex-1 bg-transparent text-white text-xl placeholder:text-gray-500 outline-none border-none font-sans"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 min-h-[300px]">
                    {!query ? (
                        <div className="text-center text-gray-500 py-12">
                            <p>Type to search within our Tallow collection</p>
                        </div>
                    ) : loading ? (
                        <div className="text-center text-gray-400 py-12">Searching...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Suggestions Column */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Suggestions</h3>
                                {suggestions.length > 0 ? (
                                    <ul className="space-y-3">
                                        {suggestions.map((item) => (
                                            <li key={item._id}>
                                                <Link
                                                    to={`/product/${encodeURIComponent(item.name.substring(0, 30))}/${item._id}`}
                                                    onClick={onClose}
                                                    className="text-gray-300 hover:text-white text-lg transition-colors block py-1"
                                                >
                                                    {item.name.toLowerCase()}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 italic">No suggestions found</p>
                                )}

                                {/* Pages Section (Static for now as requested by image style) */}
                                <div className="mt-12">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Pages</h3>
                                    <ul className="space-y-3">
                                        <li>
                                            <Link to="/about" onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                                                Why Tallow Instead Of Seed Oils?
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Products Column */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Products</h3>
                                {products.length > 0 ? (
                                    <div className="space-y-4">
                                        {products.map((product) => (
                                            <Link
                                                key={product._id}
                                                to={`/product/${encodeURIComponent(product.name.substring(0, 30))}/${product._id}`}
                                                onClick={() => {
                                                    onClose();
                                                    trackClick(product._id);
                                                }}
                                                className="flex items-center gap-4 group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-[#333]"
                                            >
                                                <div className="w-16 h-16 bg-white/10 rounded-md overflow-hidden flex-shrink-0 p-1">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium group-hover:text-[#d4c5a9] transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h4>
                                                    <span className="text-sm text-gray-400">
                                                        GHS {product.price}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 italic">No products found matching "{query}"</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                {query && (
                    <Link
                        to={`/products?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="block w-full py-4 bg-[#252525] border-t border-[#333] text-center text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                    >
                        Search for "{query}" <ArrowRight className="inline ml-1 w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
