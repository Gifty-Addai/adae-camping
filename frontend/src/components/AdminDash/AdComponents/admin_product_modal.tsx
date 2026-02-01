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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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
    onSave: (data: ProductFormData) => Promise<boolean>;
    onDelete: (id: string) => void;
    action: "add" | "update" | null;
    defaultCategory?: string; // Optional fixed category
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ product, onOpen, onClose, onSave, onDelete, defaultCategory }) => {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: undefined,
            category: defaultCategory || "accessories", // Use defaultCategory if provided
            stock: 0,
            image: "",
            isAvailable: false,
        },
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            // Retrieve token from localStorage (adjust key as needed based on auth implementation)
            const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

            const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/image/upload-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.data.success) {
                form.setValue("image", response.data.data.url);
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

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
                category: defaultCategory || "accessories",
                stock: 0,
                image: "",
                isAvailable: false,
            });
        }
    }, [product, form, defaultCategory]);

    const onSubmit = async (data: ProductFormData) => {
        const success = await onSave(data);
        if (success) {
            onClose();
        }
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
            <DialogContent className="w-full max-w-3xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto bg-[#2a2a2a] border border-[#3d3d3d]">
                <DialogHeader>
                    <DialogTitle className="text-gray-100">{product ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {product ? "Update the details of the product" : "Fill out the details of the new product"}
                    </DialogDescription>
                </DialogHeader>

                {/* Form Layout */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name input (Textarea) */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Product Name</FormLabel>
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
                                <FormLabel className="text-gray-300">Description</FormLabel>
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
                                    <FormLabel className="text-gray-300">Price</FormLabel>
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
                                    <FormLabel className="text-gray-300">Stock</FormLabel>
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
                                <FormLabel className="text-gray-300">Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!!defaultCategory} // Disable if fixed category
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="accessories">Outdoor accessory</SelectItem>
                                        <SelectItem value="camping light">Camping Light</SelectItem>
                                        <SelectItem value="cookwear">Cookwear</SelectItem>
                                        <SelectItem value="tallow">Tallow</SelectItem>
                                        <SelectItem value="others">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Image Selection with Tabs */}
                        <div className="space-y-3">
                            <FormLabel className="text-gray-300">Product Image</FormLabel>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-[#353535] text-gray-400">
                                    <TabsTrigger value="url" className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white">Image URL</TabsTrigger>
                                    <TabsTrigger value="upload" className="data-[state=active]:bg-[#8b7355] data-[state=active]:text-white">Upload Image</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url" className="mt-4">
                                    <FormField control={form.control} name="image" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide image URL"
                                                    {...field}
                                                    className="resize-none h-20 bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </TabsContent>
                                <TabsContent value="upload" className="mt-4">
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#4d4d4d] border-dashed rounded-lg cursor-pointer bg-[#353535] hover:bg-[#3d3d3d] transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                            </div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {uploading && <p className="mt-2 text-sm text-[#8b7355] animate-pulse">Uploading image...</p>}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            {/* Image Preview */}
                            {form.watch("image") && (
                                <div className="mt-4 relative w-full h-48 bg-[#353535] rounded-lg overflow-hidden border border-[#4d4d4d]">
                                    <img src={form.watch("image")} alt="Preview" className="w-full h-full object-contain" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 rounded-full w-8 h-8"
                                        onClick={() => form.setValue("image", "")}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Availability Checkbox */}
                        <FormField control={form.control} name="isAvailable" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                                <FormLabel className="text-gray-300">Available</FormLabel>
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
                                <Button type="submit" className="bg-[#8b7355] hover:bg-[#6d5a44] text-white">
                                    {product ? "Update" : "Add"} Product
                                </Button>

                                {product && (
                                    <Button
                                        type="button"
                                        onClick={() => handleAction("delete")}
                                        className="bg-red-600 hover:bg-red-700 text-white"
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
                        <DialogContent className="w-full max-w-sm mx-auto bg-[#2a2a2a] border border-[#3d3d3d]">
                            <DialogHeader>
                                <DialogTitle className="text-gray-100">Confirm Deletion</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Yes, Delete</Button>
                                <Button onClick={closeConfirmDialog} className="bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-100">Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AdminProductModal;
