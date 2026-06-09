import { useState } from 'react';
import { Page } from '@/components/ui/page';
import { ChevronDown, Search, HelpCircle, Mail, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  category: 'general' | 'cooking' | 'storage' | 'sourcing';
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: '✨' },
  { id: 'general', label: 'General & Definitions', icon: '🐄' },
  { id: 'cooking', label: 'Cooking & Culinary', icon: '🍳' },
  { id: 'storage', label: 'Storage & Stability', icon: '🏺' },
  { id: 'sourcing', label: 'Ethical Sourcing', icon: '🌿' },
];

const FAQS: FAQItem[] = [
  {
    id: 'what-is-tallow',
    category: 'general',
    question: 'WHAT IS TALLOW? (i.e., beef tallow, goat tallow, sheep tallow, pork lard)',
    answer: 'Tallow is rendered suet fat of an Animal. It has been used for cooking and household purposes for generations and is valued for its stability and versatility.'
  },
  {
    id: 'differences',
    category: 'general',
    question: 'What are the Differences Between Beef Tallow, Goat Tallow, and Sheep Tallow?',
    answer: 'Beef tallow is usually yellow in colour. Goat tallow is creamy white and much firmer than Beef tallow. Sheep tallow is pure white and has a relatively buttery texture. Each tallow has its own unique and distinctive flavour. They are all used in the same purpose of cooking and to replace unhealthy cooking oil.'
  },
  {
    id: 'tallow-butter-ghee',
    category: 'general',
    question: 'Is Beef Tallow, Butter and Ghee the Same?',
    answer: 'Beef tallow is made when the fat of the cow is rendered into oil. Butter is skimmed from the whole milk of the cow. Ghee is made when butter is cooked to remove moisture and milk residue, which makes ghee more flavourful, versatile and shelf-stable.'
  },
  {
    id: 'strong-smell',
    category: 'general',
    question: 'Does tallow have a strong smell?',
    answer: 'High-quality, properly rendered tallow smells just like the meat of the animal from which the tallow is rendered.'
  },
  {
    id: 'tallow-vs-lard',
    category: 'general',
    question: 'Is beef tallow the same as lard?',
    answer: 'No. Beef tallow comes from cattle, while lard comes from pork fat. Each has different textures, melting points, and culinary uses. Tallow is generally firmer and more heat stable.'
  },
  {
    id: 'tallow-uses',
    category: 'cooking',
    question: 'What is tallow used for?',
    answer: 'Beef tallow is commonly used for cooking applications such as frying, roasting, deep frying and sautéing. It has also been traditionally used in soaps, balms, and candles.'
  },
  {
    id: 'tallow-for-cooking',
    category: 'cooking',
    question: 'Can tallow be used for cooking?',
    answer: 'Yes. Beef tallow has historically been used as a cooking fat because of its stability and performance at moderate to higher cooking temperatures. It is commonly used for pan-frying, roasting vegetables, and cooking meats.'
  },
  {
    id: 'smoking-point',
    category: 'cooking',
    question: 'Does tallow have a high smoking point?',
    answer: 'Tallow has a high smoking point. Like all high-stability cooking fats, it can withstand high temperatures (around 400°F / 205°C) without breaking down or producing harmful free radicals.'
  },
  {
    id: 'reuse-tallow',
    category: 'cooking',
    question: 'Can tallow be reused for cooking?',
    answer: 'Yes. Tallow can be strained and reused if it remains clean and free of moisture or food debris. Proper handling extends usability.'
  },
  {
    id: 'shelf-stable',
    category: 'storage',
    question: 'Is tallow shelf stable?',
    answer: 'Yes. Tallow is shelf stable. It should be kept in a sealed container away from moisture and excessive heat.'
  },
  {
    id: 'refrigeration',
    category: 'storage',
    question: 'Does tallow need to be refrigerated?',
    answer: 'Ancestral Tallow will last more than 6 months when stored at room temperature. Refrigeration is not strictly required but can extend shelf life. Many people store beef tallow at room temperature in a cool, dry place. Clean handling and proper storage are key factors.'
  },
  {
    id: 'how-stored',
    category: 'storage',
    question: 'How should tallow be stored?',
    answer: 'Ancestral tallow should be stored in airtight containers using clean utensils to avoid contamination. A cool, dry pantry or refrigerator are common storage options.'
  },
  {
    id: 'go-bad',
    category: 'storage',
    question: 'Can beef tallow go bad?',
    answer: 'Yes. While stable, beef tallow can spoil if exposed to moisture, contaminants, or improper storage. Signs of spoilage include sour smells, visible mold, or unusual texture changes.'
  },
  {
    id: 'grass-fed',
    category: 'sourcing',
    question: 'Is tallow grass-fed / grass-finished?',
    answer: 'Primal Tribe sources tallow from locally raised, grass-fed/grass-finished cattle.'
  }
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Filter FAQs based on category and search query
  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setExpandedId(null);
  };

  return (
    <Page
      pageTitle="FAQ"
      seoDescription="Find answers to frequently asked questions about beef tallow, goat tallow, sheep tallow, and ghee. Learn about cooking uses, smoking points, refrigeration, and storage guidelines."
      seoKeywords="tallow questions, beef tallow vs lard, how to store tallow, does tallow spoil, grass fed tallow questions"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen pb-16">
          {/* Custom style for mobile scrollbars */}
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Hero Section */}
          <section className="relative py-20 bg-[#1d1d1d] border-b border-[#3d3d3d] overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-around items-center">
              <span className="text-9xl rotate-12">🐄</span>
              <span className="text-9xl -rotate-12">🏺</span>
            </div>
            
            <div className="container mx-auto px-6 text-center relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b7355]/10 border border-[#8b7355]/20 text-[#d4c5a9] text-xs font-semibold uppercase tracking-wider mb-4">
                <HelpCircle size={14} /> Common Questions
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-gray-100 mb-6 font-bold leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Learn about the nature, storage, benefits, and traditional cooking methods of Tallow and Ghee.
              </p>

              {/* Dynamic Interactive Search Bar */}
              <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400 group-focus-within:text-[#d4c5a9] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setExpandedId(null); // Collapse when filtering
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] border border-[#3d3d3d] rounded-full text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all shadow-inner text-base"
                />
              </div>
            </div>
          </section>

          {/* FAQ Content Section */}
          <section className="py-12 px-0">
            {/* Category Selector Tabs - Horizontal scrollable on mobile, flex-wrap on desktop */}
            <div className="w-full flex items-center md:justify-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-3 md:pb-0 px-6 md:px-0 md:flex-wrap whitespace-nowrap">
              {FAQ_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setExpandedId(null); // Collapse when changing category
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-[#8b7355] border-[#8b7355] text-white shadow-lg shadow-[#8b7355]/20 scale-105'
                      : 'bg-[#1d1d1d] border-[#3d3d3d] text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <div className="container mx-auto max-w-4xl px-6">
              {/* Accordion Questions List */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map(faq => {
                      const isExpanded = expandedId === faq.id;
                      return (
                        <motion.div
                          key={faq.id}
                          layout
                          className={`bg-[#1d1d1d] rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isExpanded ? 'border-[#8b7355]' : 'border-[#3d3d3d] hover:border-[#4d4d4d]'
                          }`}
                        >
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleExpand(faq.id)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none select-none group"
                          >
                            <span className={`text-base md:text-lg font-serif font-semibold transition-colors duration-300 pr-4 ${
                              isExpanded ? 'text-[#d4c5a9]' : 'text-gray-100 group-hover:text-[#d4c5a9]'
                            }`}>
                              {faq.question}
                            </span>
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="text-gray-400 shrink-0"
                            >
                              <ChevronDown size={20} className={isExpanded ? 'text-[#d4c5a9]' : ''} />
                            </motion.span>
                          </button>

                          {/* Accordion Body */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <div className="px-6 pb-6 text-gray-300 border-t border-[#2d2d2d] pt-4 leading-relaxed text-sm md:text-base">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 bg-[#1d1d1d] rounded-2xl border border-[#3d3d3d]"
                    >
                      <HelpCircle size={48} className="mx-auto text-gray-500 mb-4 animate-pulse" />
                      <p className="text-gray-300 text-lg mb-4">No matching questions found.</p>
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8b7355] text-white hover:bg-[#6d5a44] transition-all"
                      >
                        <RotateCcw size={16} /> Reset Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Still have questions CTA */}
              <div className="mt-16 bg-gradient-to-r from-[#1d1d1d] to-[#252525] rounded-3xl p-8 md:p-12 border border-[#3d3d3d] text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b7355]/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-2xl md:text-3xl font-serif text-gray-100 mb-4 font-bold">
                  Still Have Questions?
                </h3>
                <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
                  We're here to help! If you couldn't find the answers you were looking for, feel free to drop us a message.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#8b7355] hover:bg-[#6d5a44] text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Mail size={18} /> Contact Our Team
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    />
  );
};

export default FAQPage;
