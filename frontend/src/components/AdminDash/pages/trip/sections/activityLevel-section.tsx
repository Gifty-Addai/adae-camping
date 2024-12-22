// src/components/TripForm/sections/activityLevel-section.tsx

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TripFormInput } from "@/core/interfaces/zod";
import ErrorMessage from "@/components/ui/error-message";

const ActivityLevelSection: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<TripFormInput>();

    return (
        <div className="flex flex-col space-y-2">
            <Label htmlFor="activityLevel">Activity Level (1-5)</Label>
            <Input
                type="number"
                id="activityLevel"
                placeholder="Enter activity level"
                {...register("activityLevel", { valueAsNumber: true })}
                min={1}
                max={5}
            />
            {errors.activityLevel?.message && (
                <ErrorMessage message={errors.activityLevel.message} />
            )}
        </div>
    );
};

export default ActivityLevelSection;
