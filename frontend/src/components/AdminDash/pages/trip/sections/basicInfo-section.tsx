import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import ErrorMessage from "@/components/ui/error-message";
import { BasicInfoInput, basicInfoSchema } from "@/core/interfaces/zod";

interface BasicInfoSectionProps {
  data: BasicInfoInput;
  onNext: (data: BasicInfoInput) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data, onNext }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoInput>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: data.name,
      description: data.description || "",
    },
  });

  // Reset form whenever `data` changes
  useEffect(() => {
    reset({
      name: data.name,
      description: data.description || "",
    });
  }, [data, reset]);

  const onSubmit = (formData: BasicInfoInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Basic Information</h3>

      {/* Trip Name */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="name">
          Trip Name <span className="text-red-500">*</span>
        </Label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Enter title"
              {...field}
              className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
              aria-invalid={errors.name ? "true" : "false"}
            />
          )}
        />
        {errors.name && <ErrorMessage message={errors.name.message} />}
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter trip description"
          {...register("description")}
          rows={4}
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && <ErrorMessage message={errors.description.message} />}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(BasicInfoSection);
