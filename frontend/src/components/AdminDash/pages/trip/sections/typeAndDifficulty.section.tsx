// src/components/AdminDash/pages/trip/sections/typeAndDifficulty.section.tsx
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { difficultyOptions, typeOptions } from "@/data/data";
import { TypeAndDifficultyInput, typeAndDifficultySchema } from "@/core/interfaces/zod";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";

interface TypeAndDifficultySectionProps {
  data: TypeAndDifficultyInput;
  onNext: (data: TypeAndDifficultyInput) => void;
}

const TypeAndDifficultySection: React.FC<TypeAndDifficultySectionProps> = ({ data, onNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeAndDifficultyInput>({
    resolver: zodResolver(typeAndDifficultySchema),
    defaultValues: {
      type: data.type,
      difficulty: data.difficulty,
    },
  });

  const onSubmit = (formData: TypeAndDifficultyInput) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-center text-yellow-400 text-2xl font-semibold">Type and Difficulty</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Type */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trip type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trip Types</SelectLabel>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <ErrorMessage message={errors.type.message} />}
        </div>

        {/* Difficulty */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="difficulty">
            Difficulty <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Difficulty Levels</SelectLabel>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.difficulty && <ErrorMessage message={errors.difficulty.message} />}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default React.memo(TypeAndDifficultySection);
