
import { LucideIcon } from "lucide-react";

import {
    Shield as LucideShield,
    ShoppingCart as LucideShoppingCart,
    Users as LucideUsers,
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
        title: "Orders",
        url: "/admin/orders",
        icon: LucideShoppingCart,
        isActive: false,
        breadcrumb: "Orders",
        children: [
            {
                title: "All Orders",
                url: "/admin/orders",
                breadcrumb: "All Orders",
            }
        ]
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
            {
                title: "Tallow Products",
                url: "/admin/products/tallow",
                breadcrumb: "Tallow Products",
            },
            // Add more product routes if needed
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
    // Add more sections as needed
]