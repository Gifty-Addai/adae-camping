
import { LucideIcon } from "lucide-react";

import {
    Shield as LucideShield,
    ShoppingCart as LucideShoppingCart,
    CalendarCheck as LucideCalendarCheck,
    Users as LucideUsers,
    MapPin as LucideMapPin,
    Image as LucideImage,
    Video as LucideVideo,
    MessageSquare as LucideMessageSquare,
} from "lucide-react";

export interface BreadcrumbConfigItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    breadcrumb?: string | ((params: Record<string, string | undefined>, dynamicName?: string) => string);
    children?: BreadcrumbConfigItem[];
}

export const breadcrumbConfig: BreadcrumbConfigItem[] = [
    {
        title: "Authentication",
        url: "/admin/auth",
        icon: LucideShield,
        isActive: false,
        breadcrumb: "Authentication",
        children: [
            {
                title: "Sign In",
                url: "/admin/signin",
                breadcrumb: "Sign In",
            },
            {
                title: "Sign Up",
                url: "/admin/signup",
                breadcrumb: "Sign Up",
            },
            // Add more auth routes if needed
        ],
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: LucideShoppingCart,
        isActive: false,
        breadcrumb: "Products",
        children: [
            {
                title: "All Products",
                url: "/admin/products",
                breadcrumb: "All Products",
            },
            {
                title: "Add New Product",
                url: "/admin/products/new",
                breadcrumb: "Add New Product",
            },
            // Add more product routes if needed
        ],
    },
    {
        title: "Bookings",
        url: "/admin/bookings",
        icon: LucideCalendarCheck,
        isActive: false,
        breadcrumb: "Bookings",
        children: [
            {
                title: "All Bookings",
                url: "/admin/bookings",
                breadcrumb: "All Bookings",
            },
            {
                title: "New Booking",
                url: "/admin/bookings/new",
                breadcrumb: "New Booking",
            },
            // Add more booking routes if needed
        ],
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: LucideUsers,
        isActive: false,
        breadcrumb: "Users",
        children: [
            {
                title: "All Users",
                url: "/admin/users",
                breadcrumb: "All Users",
            },
            {
                title: "Create User",
                url: "/admin/users/new",
                breadcrumb: "Create User",
            },
            // Add more user routes if needed
        ],
    },
    {
        title: "Trips",
        url: "/admin/trips",
        icon: LucideMapPin,
        isActive: false,
        breadcrumb: "Trips",
        children: [
            {
                title: "All Trips",
                url: "/admin/trips",
                breadcrumb: "All Trips",
            },
            {
                title: "Add New Trip",
                url: "/admin/trips/new",
                breadcrumb: "Add New Trip",
            },
            {
                title: "Edit Trip",
                url: "/admin/trips/edit/:id",
                breadcrumb: ({}, tripName) =>
                    tripName ? `Edit Trip: ${tripName}` : "Edit Trip",
            },
            // Add more trip routes if needed
        ],
    },
    {
        title: "Gallery",
        url: "/admin/gallery",
        icon: LucideImage,
        isActive: false,
        breadcrumb: "Gallery",
        children: [
            {
                title: "All Gallery Items",
                url: "/admin/gallery",
                breadcrumb: "All Gallery Items",
            },
            {
                title: "Add to Gallery",
                url: "/admin/gallery/new",
                breadcrumb: "Add to Gallery",
            },
            // Add more gallery routes if needed
        ],
    },
    {
        title: "Videos",
        url: "/admin/videos",
        icon: LucideVideo,
        isActive: false,
        breadcrumb: "Videos",
        children: [
            {
                title: "All Videos",
                url: "/admin/videos",
                breadcrumb: "All Videos",
            },
            {
                title: "Upload Video",
                url: "/admin/videos/new",
                breadcrumb: "Upload Video",
            },
            // Add more video routes if needed
        ],
    },
    {
        title: "Testimonies",
        url: "/admin/testimonies",
        icon: LucideMessageSquare,
        isActive: false,
        breadcrumb: "Testimonies",
        children: [
            {
                title: "All Testimonies",
                url: "/admin/testimonies",
                breadcrumb: "All Testimonies",
            },
            {
                title: "Add Testimony",
                url: "/admin/testimonies/new",
                breadcrumb: "Add Testimony",
            },
            // Add more testimony routes if needed
        ],
    }
    // Add more sections as needed
]