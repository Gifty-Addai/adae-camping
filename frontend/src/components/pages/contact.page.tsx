import { Page } from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSettings } from '@/context/settings_context';
import { postRequest } from '@/lib/api-Request/api-requests';

const ContactPage = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await postRequest('/api/contact', formData);
            if (window.fbq) {
                window.fbq('track', 'Contact');
            }
            toast.success('Thank you for contacting us! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err: any) {
            console.error('Contact submission error:', err);
            toast.error(err.message || 'Failed to send message. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Page
            pageTitle="Contact Us"
            seoDescription="Get in touch with The Ancestral Tallow team. Send us a message or find our contact information for support, inquiries, and consultations about our tallow products."
            seoKeywords="contact ancestral tallow, ancestral tallow support, tallow questions ghana, tallow customer service"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen">
                    {/* Hero Section */}
                    <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d]">
                        <div className="container mx-auto px-6 text-center">
                            <h1 className="text-5xl md:text-6xl font-serif text-gray-100 mb-6 font-bold">
                                Get In Touch
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Have questions about our products or want to learn more about ancestral tallow?
                                We'd love to hear from you.
                            </p>
                        </div>
                    </section>

                    {/* Contact Content */}
                    <section className="py-16">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Contact Form */}
                                <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3d3d3d]">
                                    <h2 className="text-3xl font-serif text-gray-100 mb-6 font-bold">Send Us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                required
                                                className="bg-[#353535] border-[#5d5d5d] text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">Email Address *</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                                required
                                                className="bg-[#353535] border-[#5d5d5d] text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">Phone Number</label>
                                            <Input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+233 XX XXX XXXX"
                                                className="bg-[#353535] border-[#5d5d5d] text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">Message *</label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us how we can help you..."
                                                required
                                                rows={6}
                                                className="bg-[#353535] border-[#5d5d5d] text-white placeholder:text-gray-400 resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-[#8b7355] hover:bg-[#6d5a44] text-white py-6 text-lg font-semibold"
                                        >
                                            Send Message
                                        </Button>
                                    </form>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-serif text-gray-100 mb-6 font-bold">Contact Information</h2>
                                        <p className="text-gray-300 leading-relaxed mb-8">
                                            Reach out to us through any of the following channels.
                                            We typically respond within 24 hours.
                                        </p>
                                    </div>

                                    {/* Contact Cards */}
                                    <div className="space-y-6">
                                        {/* Email */}
                                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-[#8b7355] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Mail className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Email Us</h3>
                                                    <p className="text-gray-300">{settings.supportEmail}</p>
                                                    <p className="text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-[#8b7355] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Call Us</h3>
                                                    <p className="text-gray-300">{settings.supportPhone}</p>
                                                    <p className="text-gray-400 text-sm mt-1">Mon-Fri: 9am - 6pm GMT</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#8b7355] transition-all">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-[#8b7355] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Visit Us</h3>
                                                    <p className="text-gray-300">Accra, Ghana</p>
                                                    <p className="text-gray-400 text-sm mt-1">By appointment only</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ Link */}
                                    <div className="bg-[#1d1d1d] p-6 rounded-xl border border-[#3d3d3d]">
                                        <h3 className="text-xl font-serif text-gray-100 mb-2 font-semibold">Quick Questions?</h3>
                                        <p className="text-gray-300 mb-4">
                                            Check out our FAQ section for answers to common questions about our products,
                                            shipping, and usage.
                                        </p>
                                        <a href="/products" className="text-[#d4c5a9] hover:text-[#8b7355] font-medium">
                                            View FAQs →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            )}
        />
    );
};

export default ContactPage;
