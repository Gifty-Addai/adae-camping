import { Page } from '@/components/ui/page';
import { useSettings } from '@/context/settings_context';

const RefundPolicyPage = () => {
    const { settings } = useSettings();
    return (
        <Page
            pageTitle="Refund Policy"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen">
                    {/* Hero Section */}
                    <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d]">
                        <div className="container mx-auto px-6 text-center">
                            <h1 className="text-5xl md:text-6xl font-serif text-gray-100 mb-6 font-bold">
                                Refund Policy
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Our commitment to quality and transparency.
                            </p>
                        </div>
                    </section>

                    {/* Policy Content */}
                    <section className="py-16">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <div className="bg-[#2a2a2a] p-8 md:p-12 rounded-2xl border border-[#3d3d3d] space-y-8 text-gray-300 leading-relaxed">
                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">1. Overview</h2>
                                    <p>
                                        At <strong>The Ancestral Tallow</strong>, we stand behind the quality of our handcrafted, natural tallow products. Due to the personal care, hygiene, and perishable nature of our products, <strong>all sales are final. All items are strictly non-refundable and non-returnable once purchased.</strong>
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">2. No-Refund Policy</h2>
                                    <p>
                                        Because our products are made from natural organic fats and contain no synthetic preservatives, they are classified as perishable goods. Once an order is placed and delivered, <strong>we do not accept returns or offer monetary refunds</strong> under any circumstances.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">3. Damaged or Defective Items</h2>
                                    <p>
                                        We partner with third-party dispatch services and riders for order deliveries. While we pack our items securely, if your order arrives damaged (e.g., broken glass jar, leakage) due to transit/handling by the rider, please notify us within <strong>12 hours</strong> of receiving your delivery.
                                    </p>
                                    <p className="mt-2">
                                        Reporting the damage promptly allows us to file a claim with the third-party delivery provider and process a replacement for you.
                                    </p>
                                    <p className="mt-2">
                                        To qualify for a <strong>replacement item</strong>:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li>You must contact us via WhatsApp or Email within 12 hours of delivery.</li>
                                        <li>Please provide clear photos of the damaged packaging and the product.</li>
                                    </ul>
                                    <p className="mt-2">
                                        Please note that we do not issue monetary refunds for damaged shipments; we will only dispatch a replacement product once verified.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">4. Contact Us</h2>
                                    <p>
                                        If you have any questions or concerns regarding your order, please reach out to us:
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

export default RefundPolicyPage;
