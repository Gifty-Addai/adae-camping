import React, { useState, useEffect } from "react";
import { Product, ProductFormData } from "@/core/interfaces";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ShadCN Dialog import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

// Define Zod validation schema for product
const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    price: z.preprocess((val) => {
        // Convert empty strings to undefined to trigger validation
        if (typeof val === "string" && val.trim() === "") {
            return undefined;
        }
        return Number(val);
    }, z.number().positive("Price must be greater than 0")),
    category: z.string().min(1, "Category is required"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
    image: z.string().url("Image URL must be a valid URL").optional(),
    isAvailable: z.boolean(),
});

export interface AdminProductModalProps {
    product: Product | null;
    onOpen: boolean;
    onClose: () => void;
    onSave: (data: ProductFormData) => void;
    onDelete: (id: string) => void;
    action: "add" | "update" | null;
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ product, onOpen, onClose, onSave, onDelete }) => {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: undefined, // Changed from 0 to undefined
            category: "accessories",
            stock: 0,
            image: "",
            isAvailable: false,
        },
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category || "accessories",
                stock: product.stock,
                image: product.imageUrl || "",
                isAvailable: product.isAvailable,
            });
            console.info("Data to edit", product);
        } else {
            form.reset({
                name: "",
                description: "",
                price: undefined,
                category: "accessories",
                stock: 0,
                image: "",
                isAvailable: false,
            });
        }
    }, [product, form]);

    const onSubmit = async (data: ProductFormData) => {
        onSave(data);
        onClose();
    };

    const handleDelete = () => {
        if (product) {
            onDelete(product._id);
            setShowConfirmDialog(false);
            onClose();
        }
    };

    // Open confirmation dialog
    const handleAction = (actionType: "delete" | "update") => {
        if (actionType === "delete") {
            setShowConfirmDialog(true);
        }
        // Handle other action types if needed
    };

    // Close confirmation dialog without action
    const closeConfirmDialog = () => {
        setShowConfirmDialog(false);
    };

    return (
        <Dialog open={onOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="w-full max-w-3xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto"> {/* Responsive width and scrollable content */}
                <DialogHeader>
                    <DialogTitle className="text-card-foreground">{product ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Update the details of the product" : "Fill out the details of the new product"}
                    </DialogDescription>
                </DialogHeader>

                {/* Form Layout */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name input (Textarea) */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Product Name</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product name"
                                        {...field}
                                        className="resize-none h-16"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Description input (Textarea) */}
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        {...field}
                                        className="resize-none h-24"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Price and Stock in Row */}
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-card-foreground">Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter price"
                                            value={field.value || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // If the input is empty, set the value to undefined
                                                // Otherwise, parse it to a float
                                                field.onChange(value === "" ? undefined : parseFloat(value));
                                            }}
                                            min="0"
                                            step="0.01"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="stock" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-card-foreground">Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter stock"
                                            value={field.value === 0 ? "" : field.value}
                                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                            min="0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Category */}
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="accessories">Outdoor accessory</SelectItem>
                                        <SelectItem value="camping light">Camping Light</SelectItem>
                                        <SelectItem value="cookwear">Cookwear</SelectItem>
                                        {/* <SelectItem value="others">Others</SelectItem> */}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Image URL input (Textarea) */}
                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-card-foreground">Image URL</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide image URL"
                                        {...field}
                                        className="resize-none h-16"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Availability Checkbox */}
                        <FormField control={form.control} name="isAvailable" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                                <FormLabel className="text-card-foreground">Available</FormLabel>
                            </FormItem>
                        )} />

                        <div className="flex justify-between mt-4">
                            <Button
                                type="button"
                                onClick={onClose} // Wire up the Cancel button
                                className="bg-gray-400 hover:bg-gray-500"
                            >
                                Cancel
                            </Button>

                            <div className="flex space-x-2">
                                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                                    {product ? "Update" : "Add"} Product
                                </Button>

                                {product && (
                                    <Button
                                        type="button"
                                        onClick={() => handleAction("delete")}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>

                {/* Delete Confirmation Dialog */}
                {showConfirmDialog && (
                    <Dialog open={showConfirmDialog} onOpenChange={(open) => { if (!open) closeConfirmDialog(); }}>
                        <DialogContent className="w-full max-w-sm mx-auto">
                            <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button onClick={handleDelete} className="bg-red-600">Yes, Delete</Button>
                                <Button onClick={closeConfirmDialog} className="bg-gray-400">Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AdminProductModal;
