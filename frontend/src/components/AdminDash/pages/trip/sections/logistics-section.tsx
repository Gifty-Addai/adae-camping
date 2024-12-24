// src/components/TripForm/sections/LogisticsSection.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { LogisticsInput, logisticsSchema } from "@/core/interfaces/zod";

interface LogisticsSectionProps {
  data: {
    transportation: string;
    gearProvided: boolean;
    accommodation: string;
  };
  onNext: (data: LogisticsInput) => void;
}

const LogisticsSection: React.FC<LogisticsSectionProps> = ({ data, onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogisticsInput>({
    resolver: zodResolver(logisticsSchema),
    defaultValues: {
      transportation: data.transportation,
      gearProvided: data.gearProvided,
      accommodation: data.accommodation,
    },
  });

  const onSubmit = (formData: LogisticsInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      {/* Transportation */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="transportation">
            Transportation <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>
              Enter details about transportation arrangements for the trip.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="transportation"
          placeholder="Enter transportation details"
          {...register("transportation")}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.transportation ? "true" : "false"}
        />
        {errors.transportation && <ErrorMessage message={errors.transportation.message} />}
      </div>

      {/* Gear Provided */}
      <div className="flex items-center justify-between">
        <Label htmlFor="gearProvided">Gear Provided</Label>
        <Tooltip>
          <TooltipContent>
            Toggle to indicate whether gear is provided as part of the trip.
          </TooltipContent>
        </Tooltip>
        <Switch
          id="gearProvided"
          {...register("gearProvided")}
          className="focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Accommodation */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="accommodation">
            Accommodation <span className="text-red-500">*</span>
          </Label>
          <Tooltip>
            <TooltipContent>
              Provide details about accommodation arrangements during the trip.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="accommodation"
          placeholder="Enter accommodation details"
          {...register("accommodation")}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-300"
          aria-invalid={errors.accommodation ? "true" : "false"}
        />
        {errors.accommodation && <ErrorMessage message={errors.accommodation.message} />}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(LogisticsSection);
