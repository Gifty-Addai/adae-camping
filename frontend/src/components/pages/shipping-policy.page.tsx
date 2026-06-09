import { Page } from '@/components/ui/page';
import { useSettings } from '@/context/settings_context';

const ShippingPolicyPage = () => {
    const { settings } = useSettings();
    return (
        <Page
            pageTitle="Shipping Policy"
            seoDescription="Learn about the shipping and delivery policy for The Ancestral Tallow. Read about local Accra dispatch timelines (same-day/next-day via Uber & Yango) and the importance of pinning GPS map coordinates."
            seoKeywords="tallow shipping ghana, tallow delivery accra, uber yango dispatch, domestic shipping"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen">
                    {/* Hero Section */}
                    <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d]">
                        <div className="container mx-auto px-6 text-center">
                            <h1 className="text-5xl md:text-6xl font-serif text-gray-100 mb-6 font-bold">
                                Shipping & Delivery Policy
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Reliable local dispatch and coordinate-based delivery.
                            </p>
                        </div>
                    </section>

                    {/* Policy Content */}
                    <section className="py-16">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <div className="bg-[#2a2a2a] p-8 md:p-12 rounded-2xl border border-[#3d3d3d] space-y-8 text-gray-300 leading-relaxed">
                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">1. Delivery Zones</h2>
                                    <p>
                                        We currently deliver <strong>The Ancestral Tallow</strong> products across Ghana. 
                                        Local on-demand deliveries are concentrated within the Greater Accra Region, while standard parcel delivery options are used for regional and nationwide orders.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">2. Third-Party Dispatch & Courier Services</h2>
                                    <p>
                                        To ensure fast, reliable, and prompt service in the Accra Area, we dispatch local orders using popular third-party ride-hailing and courier services, primarily <strong>Uber Delivery</strong> and <strong>Yango Delivery</strong>.
                                    </p>
                                    <p className="mt-2">
                                        Once your order is processed and packaged, a rider from one of these platforms is requested to carry your package directly to your specified address.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">3. Importance of Map Coordinates</h2>
                                    <div className="bg-[#1d1d1d] border-l-4 border-[#8b7355] p-4 rounded-r-lg my-4">
                                        <p className="text-gray-200 font-medium">📍 Crucial for Delivery Accuracy:</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            During checkout, we require customers to use our interactive MapPicker tool to pin their exact location. Pinned locations provide exact GPS map coordinates, which are passed directly to our <strong>Uber</strong> and <strong>Yango</strong> dispatch riders.
                                        </p>
                                    </div>
                                    <p>
                                        This coordinate-based routing ensures the courier rider can navigate directly to your doorstep or designated pickup point without confusing phone directions or delays. Please ensure your location is correctly pinned before submitting your order.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">4. Shipping Rates</h2>
                                    <p>
                                        Shipping costs are calculated dynamically based on distance or quoted from the dispatch location at the time of delivery. Any applicable delivery fees will be shown at checkout or communicated prior to dispatching your courier rider.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">5. Delivery Timeline</h2>
                                    <ul className="list-disc list-inside ml-4 space-y-2">
                                        <li><strong>Accra Area (On-Demand):</strong> Orders placed before 2:00 PM are typically dispatched and delivered the same day. Orders after 2:00 PM may be processed the next business day.</li>
                                        <li><strong>Other Regions:</strong> Standard delivery through domestic parcel services takes between 2 to 4 business days.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">6. Delivery Inquiries</h2>
                                    <p>
                                        For tracking updates or to modify a delivery pin, reach out to us at:
                                    </p>
                                    <ul className="list-none ml-4 mt-2 space-y-1">
                                        <li><strong>Email:</strong> {settings.supportEmail}</li>
                                        <li><strong>WhatsApp / Call:</strong> {settings.supportPhone}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        />
    );
};

export default ShippingPolicyPage;
