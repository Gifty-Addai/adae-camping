import { Product } from "@/core/interfaces";

export const components: { title: string; href: string; description: string }[] = [
  {
    title: "Camping",
    href: "/gallery",
    description:
      "Explore the best camping spots and outdoor locations to visit.",
  },
  {
    title: "Others",
    href: "/product/booking",
    description:
      "Reserve your camping spots, cabins, or glamping options.",
  },
  {
    title: "Gear Checklist",
    href: "/docs/gear-checklist",
    description:
      "Make sure you have everything you need for your camping adventure.",
  },
  {
    title: "Safety Tips",
    href: "/docs/safety-tips",
    description:
      "Important advice to stay safe during your camping trip.",
  },
]



const productsData: Product[] = [
  {
    _id: 1,
    name: 'Ultralight Backpacking Tent',
    category: 'camping',
    imageUrl: '/images/tent.jpg',
    price: 299.99,
    oldPrice: 349.99,
    description: 'A lightweight tent perfect for backpacking trips.'
  },
  {
    _id: 2,
    name: 'Sleeping Bag -15°C',
    category: 'camping',
    imageUrl: '/images/sleeping-bag.jpg',
    price: 129.99,
    description: 'Stay warm even in the coldest nights with this sleeping bag.'

  },
  {
    _id: 3,
    name: 'Portable Camping Stove',
    category: 'Cooking Gear',
    imageUrl: '/images/camping-stove.jpg',
    price: 59.99,
    description: 'Compact stove for cooking meals on the go.'
  },
  // Add more camping products...
];
export default productsData;
