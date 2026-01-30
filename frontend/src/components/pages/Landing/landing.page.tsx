
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* ---------------------------------------
          HERO SECTION
      --------------------------------------- */}
            <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#2a2a2a]">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Content */}
                        <div className="relative">
                            {/* Slide Numbers */}
                            <div className="absolute -left-16 top-0 hidden xl:flex flex-col gap-8 text-gray-400">
                                <div className="text-2xl font-light">02</div>
                                <div className="w-px h-24 bg-gray-600 mx-auto"></div>
                                <div className="text-2xl font-light">04</div>
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 leading-tight">
                                    Meet TAT's{' '}
                                    <span className="block mt-2">Organic</span>
                                    <span className="block mt-2">Tallow Collection</span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-300 italic font-light max-w-md">
                                    Pure, ancestral goodness in every jar.
                                </p>

                                <div className="pt-4">
                                    <Link to="/products">
                                        <Button
                                            size="lg"
                                            className="bg-white hover:bg-gray-100 text-black rounded-md px-10 py-6 text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            Try Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Product Image */}
                        <div className="relative flex items-center justify-center">
                            {/* Decorative Circle Background */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#3a3a3a] opacity-20 blur-3xl"></div>

                            {/* Product Container */}
                            <div className="relative z-10 w-full max-w-md lg:max-w-lg">
                                {/* Green leaf decoration - left */}
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-48 opacity-40">
                                    <svg viewBox="0 0 100 150" className="w-full h-full">
                                        <path d="M50 10 Q30 50 40 100 Q50 110 50 140 Q50 110 60 100 Q70 50 50 10" fill="#7a9b5a" opacity="0.6" />
                                    </svg>
                                </div>

                                {/* Green leaf decoration - right */}
                                <div className="absolute -right-8 top-1/4 w-40 h-56 opacity-40">
                                    <svg viewBox="0 0 120 180" className="w-full h-full">
                                        <path d="M60 20 Q40 60 50 120 Q60 135 60 170 Q60 135 70 120 Q80 60 60 20" fill="#8aaa6a" opacity="0.7" />
                                        <path d="M80 40 Q65 75 72 125 Q80 138 80 165 Q80 138 88 125 Q95 75 80 40" fill="#7a9b5a" opacity="0.5" />
                                    </svg>
                                </div>

                                {/* Product Image */}
                                <div className="relative mx-auto w-full aspect-square flex items-center justify-center">
                                    <img
                                        src="/tallow-jar.svg"
                                        alt="Ancestral Beef Tallow"
                                        className="w-3/4 h-3/4 object-contain relative z-20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ---------------------------------------
          FEATURES / CATEGORIES
      --------------------------------------- */}
            <section className="py-24 bg-[#2a2a2a]">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-100 mb-4 font-bold">Our Collection</h2>
                        <p className="text-gray-300 text-lg">Traditional nourishment for modern living.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-[#353535] mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:bg-[#404040] border border-[#454545]">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-[#454545] flex items-center justify-center">
                                    <Leaf size={48} className="text-green-400 opacity-40" />
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Cooking Oils</h3>
                            <p className="text-sm text-gray-300 mb-2">Goat, Beef & Ghee Tallow</p>
                            <Button variant="link" className="text-gray-200 hover:text-white font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center group cursor-pointer mt-12 md:mt-0">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-[#353535] mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:bg-[#404040] border border-[#454545]">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-[#454545] flex items-center justify-center">
                                    <ShieldCheck size={48} className="text-amber-400 opacity-40" />
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Skin Care</h3>
                            <p className="text-sm text-gray-300 mb-2">Nourishing Tallow Balms</p>
                            <Button variant="link" className="text-gray-200 hover:text-white font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center group cursor-pointer">
                            <div className="w-full h-80 rounded-[40px] overflow-hidden bg-[#353535] mb-6 relative transition-all duration-300 group-hover:shadow-2xl group-hover:bg-[#404040] border border-[#454545]">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-[#454545] flex items-center justify-center">
                                    <Heart size={48} className="text-rose-400 opacity-40" />
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Hair Care</h3>
                            <p className="text-sm text-gray-300 mb-2">Traditional Nourishment</p>
                            <Button variant="link" className="text-gray-200 hover:text-white font-medium">Shop Now <ArrowRight size={16} className="ml-2" /></Button>
                        </div>
                    </div>
                </div>
            </section>


            {/* ---------------------------------------
          PROMO BANNER
      --------------------------------------- */}
            <section className="py-32 bg-[#1d1d1d] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Leaf className="absolute top-10 left-10 text-white w-32 h-32 rotate-45" />
                    <Leaf className="absolute bottom-10 right-10 text-white w-48 h-48 -rotate-12" />
                </div>

                <div className="container px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
                        Ghana's Ancestral <br /> Tallow Tradition
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Pure Goat, Beef, and Ghee tallow. Crafted with respect for tradition and the earth. Nourish your body inside and out.
                    </p>
                    <Link to="/products">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold">
                            Explore Collection
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ---------------------------------------
          COMMUNITY / BLOG PREVIEW
      --------------------------------------- */}
            <section className="py-24 bg-[#2a2a2a]">
                <div className="container px-4 text-center">
                    <h3 className="text-2xl font-serif text-gray-100 mb-12 font-bold">From Our Community</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-[#353535] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#454545]">
                                <div className="w-full h-full bg-[#454545] flex items-center justify-center text-gray-300 font-medium">
                                    @user_{i}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
