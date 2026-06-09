import { Page } from '@/components/ui/page';

const PrivacyPolicyPage = () => {
    return (
        <Page
            pageTitle="Privacy Policy"
            seoDescription="Read our Privacy Policy to understand how The Ancestral Tallow protects and manages your personal information, order data, and delivery coordinates in Ghana."
            seoKeywords="tallow privacy policy, data safety ghana, ancestral tallow privacy"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen">
                    {/* Hero Section */}
                    <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d]">
                        <div className="container mx-auto px-6 text-center">
                            <h1 className="text-5xl md:text-6xl font-serif text-gray-100 mb-6 font-bold">
                                Privacy Policy
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                How we protect and manage your personal information.
                            </p>
                        </div>
                    </section>

                    {/* Policy Content */}
                    <section className="py-16">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <div className="bg-[#2a2a2a] p-8 md:p-12 rounded-2xl border border-[#3d3d3d] space-y-8 text-gray-300 leading-relaxed">
                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">1. Introduction</h2>
                                    <p>
                                        At <strong>The Ancestral Tallow</strong>, we respect your privacy and are committed to protecting any personal information you share with us. This policy details how we collect, use, and store your details when you interact with our website or make a purchase.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">2. Information We Collect</h2>
                                    <p>
                                        When you browse our shop, place an order, or register for updates, we collect key information necessary to fulfill your request:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li><strong>Identity & Contact:</strong> Name, phone number, and email address.</li>
                                        <li><strong>Delivery Details:</strong> Shipping address, notes, and precise GPS map coordinates pinned through our checkout MapPicker tool.</li>
                                        <li><strong>Transaction Data:</strong> Product selections, order history, and payment status. (We do not store your raw payment details or pin codes on our servers.)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">3. How We Use Your Data</h2>
                                    <p>
                                        We collect and process your information for the following specific purposes:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li>To process, fulfill, and track your orders.</li>
                                        <li>To share your delivery coordinates, contact number, and name with third-party courier services (such as <strong>Uber</strong> and <strong>Yango</strong>) strictly for the purpose of carrying out delivery.</li>
                                        <li>To send order status updates via SMS, WhatsApp, or Email.</li>
                                        <li>To improve our site functionality, customer service, and overall shopping experience.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">4. Data Security & Sharing</h2>
                                    <p>
                                        We do not sell, rent, or trade your personal information to marketing firms or unrelated third parties. Your details are shared only with essential services required to complete your transaction and delivery:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                                        <li><strong>Logistics Partners:</strong> Delivery riders or courier drivers (e.g. Uber, Yango) receive your contact number and map coordinates to guide them to your location.</li>
                                        <li><strong>Payment Gateways:</strong> Standard payment service providers to securely handle credit/debit/mobile money payments.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">5. Cookies and Analytics</h2>
                                    <p>
                                        We may use cookies to remember items in your shopping cart, analyze website traffic patterns, and personalize your experience. You can choose to disable cookies in your browser settings, though some features of our site may not function properly as a result.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">6. Your Rights</h2>
                                    <p>
                                        You have the right to request a copy of the data we hold on you, request modifications to inaccurate information, or request the complete deletion of your records from our systems, subject to legal record-keeping obligations.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif text-gray-100 mb-4 font-semibold">7. Contact Information</h2>
                                    <p>
                                        If you have questions regarding this policy or how your data is handled, please reach out to us:
                                    </p>
                                    <ul className="list-none ml-4 mt-2 space-y-1">
                                        <li><strong>Email:</strong> privacy@ancestraltallow.gh</li>
                                        <li><strong>Phone / WhatsApp:</strong> +233 XX XXX XXXX</li>
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

export default PrivacyPolicyPage;
