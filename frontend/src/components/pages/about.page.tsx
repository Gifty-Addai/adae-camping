import { Page } from '@/components/ui/page';
import { Images } from '@/assets/assets';

const AboutPage = () => {
    return (
        <Page
            pageTitle="About Us"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen">
                    {/* Hero Section */}
                    <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d]">
                        <div className="absolute inset-0 opacity-5">
                            <img src={Images.Goat} alt="" className="absolute top-10 left-10 w-32 h-32 rotate-12" />
                            <img src={Images.Cow} alt="" className="absolute bottom-10 right-10 w-48 h-48 -rotate-12" />
                        </div>
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <h1 className="text-5xl md:text-6xl font-serif text-gray-100 mb-6 font-bold">
                                About The Ancestral Tallow
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Rediscovering Ghana's traditional wisdom through pure, ancestral tallow products
                            </p>
                        </div>
                    </section>

                    {/* Our Story */}
                    <section className="py-16 bg-[#2a2a2a]">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-serif text-gray-100 mb-6 font-bold">Our Story</h2>
                                    <div className="space-y-4 text-gray-300 leading-relaxed">
                                        <p>
                                            The Ancestral Tallow was born from a deep respect for Ghana's traditional practices and
                                            a desire to bring ancestral nutrition back to modern kitchens and skincare routines.
                                        </p>
                                        <p>
                                            For generations, our ancestors recognized the incredible nourishing properties of
                                            grass-fed tallow from locally raised cattle and goats. These traditional fats were
                                            central to cooking, healing, and skin care across West Africa.
                                        </p>
                                        <p>
                                            Today, we're reviving these time-tested traditions by sourcing the finest quality
                                            tallow from Ghana's ethical farms and rendering it using methods passed down through
                                            generations, ensuring every jar maintains the ancestral integrity our grandmothers knew.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="aspect-square bg-[#353535] rounded-3xl overflow-hidden border border-[#454545]">
                                        <img
                                            src="https://res.cloudinary.com/dyua9sfez/image/upload/v1769895230/photo_7_2026-01-31_21-33-30_piv24z.jpg"
                                            alt="Traditional Tallow Products"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Our Values */}
                    <section className="py-16 bg-[#1d1d1d]">
                        <div className="container mx-auto px-6">
                            <h2 className="text-4xl font-serif text-gray-100 mb-12 text-center font-bold">Our Values</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Value 1 */}
                                <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                    <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl">🌿</span>
                                    </div>
                                    <h3 className="text-2xl font-serif text-gray-100 mb-4 font-semibold">Traditional Wisdom</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        We honor ancestral knowledge, using time-tested rendering methods that preserve the
                                        natural nutrients and benefits of tallow.
                                    </p>
                                </div>

                                {/* Value 2 */}
                                <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                    <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl">🐄</span>
                                    </div>
                                    <h3 className="text-2xl font-serif text-gray-100 mb-4 font-semibold">Ethical Sourcing</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        All our tallow comes from grass-fed, pasture-raised cattle and goats from trusted
                                        Ghanaian farms committed to animal welfare.
                                    </p>
                                </div>

                                {/* Value 3 */}
                                <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                    <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl">✨</span>
                                    </div>
                                    <h3 className="text-2xl font-serif text-gray-100 mb-4 font-semibold">Purity & Quality</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Each batch is rendered in small quantities with no additives, preservatives, or
                                        artificial ingredients—just pure, nourishing tallow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why Tallow */}
                    <section className="py-16 bg-[#2a2a2a]">
                        <div className="container mx-auto px-6">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-4xl font-serif text-gray-100 mb-8 text-center font-bold">Why Tallow?</h2>
                                <div className="space-y-6 text-gray-300 leading-relaxed">
                                    <p className="text-lg">
                                        Tallow is one of nature's most nutrient-dense fats, rich in vitamins A, D, E, and K,
                                        as well as conjugated linoleic acid (CLA) and omega-3 fatty acids. Our ancestors
                                        instinctively knew what science is now confirming:
                                    </p>
                                    <ul className="space-y-3 ml-6">
                                        <li className="flex items-start">
                                            <span className="text-[#d4c5a9] mr-3">•</span>
                                            <span><strong className="text-gray-100">For Cooking:</strong> High smoke point, stable for high-heat cooking,
                                                and imparts incredible flavor</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#d4c5a9] mr-3">•</span>
                                            <span><strong className="text-gray-100">For Skin:</strong> Deeply moisturizing with a composition similar to
                                                our skin's natural oils, promoting healing and nourishment</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#d4c5a9] mr-3">•</span>
                                            <span><strong className="text-gray-100">For Hair:</strong> Strengthens, conditions, and promotes healthy growth
                                                naturally</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="py-20 bg-[#1d1d1d] border-t border-[#3d3d3d]">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-100 mb-6 font-bold">
                                Join the Ancestral Movement
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                                Experience the nourishment our ancestors knew. Pure, simple, effective.
                            </p>
                            <a href="/products" className="inline-block bg-[#8b7355] hover:bg-[#6d5a44] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                Explore Our Products
                            </a>
                        </div>
                    </section>
                </div>
            )}
        />
    );
};

export default AboutPage;
