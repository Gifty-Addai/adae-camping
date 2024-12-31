import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
import { becomeMemberSchema } from "@/core/interfaces/zod";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Page } from "../ui/page";
// import { ImageUpload } from "@/core/interfaces";
// import { useDropzone } from "react-dropzone";
// import { v4 as uuidv4 } from "uuid";
import ImageUploader from "../ui/image-uploader";


type SignupFormValues = z.infer<typeof becomeMemberSchema>;

const BecomeMemberPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(becomeMemberSchema),
    });

    const [images, setImages] = useState<string[]>([]);

    const onSubmit = (data: SignupFormValues) => {
        console.log(data);
        // navigate("/success");
    };


    // Callback passed to ImageUploader to update our local state
    const handleImagesChange = (newImages: string[]) => {
        console.log(`Updated images: ${images}`, newImages);
        setImages(newImages);
    };

    return (
        <Page

            renderBody={() => (
                <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                        Become a Fie Member
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your Email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Your Password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="Your Phone Number"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="streetAddress">Street Address</Label>
                            <Input
                                id="streetAddress"
                                type="text"
                                placeholder="Street Address"
                                {...register("streetAddress")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="City"
                                {...register("city")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                                id="zipCode"
                                type="text"
                                placeholder="Zip Code"
                                {...register("zipCode")}
                            />
                        </div>



                        <ImageUploader
                            maxFiles={5} 
                            maxSize={2 * 1024 * 1024} 
                            acceptedFormats={{ "image/*": [".jpeg", ".jpg", ".png"] }}
                            initialImages={[]}
                            onImagesChange={handleImagesChange}
                            label="Upload your photos"
                        />
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                        >
                            Sign Up
                        </Button>
                    </form>
                </div>
            )}
        />

    );
};

export default BecomeMemberPage;
