// src/components/TripForm/sections/CostSection.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { CostInput, costSchema } from "@/core/interfaces/zod";

interface CostSectionProps {
  data: {
    basePrice: number;
    discount: number;
  };
  onNext: (data: CostInput) => void;
}

const CostSection: React.FC<CostSectionProps> = ({ data, onNext }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CostInput>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      basePrice: data.basePrice,
      discount: data.discount,
    },
  });

  const basePrice = watch("basePrice");

  // Ensure discount does not exceed basePrice
  React.useEffect(() => {
    const currentDiscount = watch("discount");
    if (currentDiscount > basePrice) {
      setValue("discount", basePrice);
    }
  }, [basePrice, setValue, watch]);

  const onSubmit = (formData: CostInput) => {
    console.log("CostInput", formData)
    onNext(formData);
  };

  const safeMax = Number.isFinite(basePrice) ? basePrice : undefined;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">
        Pricing
      </h3>
      {/* Base Price */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="basePrice">
            Base Price <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>
              The initial price before any discounts or additional costs.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          type="number"
          step={"0.01"}
          id="basePrice"
          placeholder="Enter base price"
          {...register("basePrice", { valueAsNumber: true })}
          min={0}
          max={safeMax}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.basePrice ? "true" : "false"}
        />
        {errors.basePrice && <ErrorMessage message={errors.basePrice.message} />}
      </div>

      {/* Discount */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="discount">Discount</Label>
          <Tooltip>
            <TooltipContent>
              Any reduction in price applied to the base price.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          type="number"
          id="discount"
          step={"0.01"}
          placeholder="Enter discount"
          {...register("discount", { valueAsNumber: true })}
          min={0}
          max={basePrice}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.discount ? "true" : "false"}
        />
        {errors.discount && <ErrorMessage message={errors.discount.message} />}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(CostSection);
