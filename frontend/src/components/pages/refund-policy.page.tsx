import { Page } from '@/components/ui/page';

const RefundPolicyPage = () => {
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
                                        At <strong>The Ancestral Tallow</strong>, we stand behind the quality of our handcrafted, natural tallow products. Due to the personal care and perishable nature of our products, we have established guidelines for returns and refunds to ensure fairness and product safety.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">2. Perishable Goods Notice</h2>
                                    <p>
                                        Because our products are made from natural fats and contain no synthetic preservatives, they are classified as perishable. We generally <strong>do not accept returns or offer refunds</strong> for products that have been opened, used, or altered after delivery.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">3. Damaged or Defective Items</h2>
                                    <p>
                                        If your order arrives damaged (e.g., broken glass jar, leakage) or defective, we will gladly send a replacement or issue a refund.
                                    </p>
                                    <p className="mt-2">
                                        To qualify for a replacement or refund for damaged items:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li>You must notify us within <strong>12 hours</strong> of receiving your delivery.</li>
                                        <li>Please send photo evidence of the damaged package and product to our contact channels (Email or WhatsApp).</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">4. Refund Processing</h2>
                                    <p>
                                        Once your claim is reviewed and approved, we will process your refund or initiate a dispatch for a replacement.
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li>Refunds are typically processed within <strong>2 to 5 business days</strong>.</li>
                                        <li>Approved refunds will be sent directly to your original payment method (Mobile Money or Bank Transfer).</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">5. Need Help?</h2>
                                    <p>
                                        If you have any questions or require support regarding your order, please do not hesitate to contact us at:
                                    </p>
                                    <ul className="list-none ml-4 mt-2 space-y-1">
                                        <li><strong>Email:</strong> info@ancestraltallow.gh</li>
                                        <li><strong>WhatsApp / Call:</strong> +233 XX XXX XXXX</li>
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
