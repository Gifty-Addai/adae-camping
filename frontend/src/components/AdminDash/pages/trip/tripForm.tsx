// src/components/AdminDash/pages/trip/TripForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  ActivityLevelInput,
  BasicInfoInput,
  CostInput,
  DurationInput,
  GroupSizeInput,
  ImagesInput,
  LocationInput,
  LogisticsInput,
  ScheduleInput,
  TripFormInput,
  tripSchema,
  TypeAndDifficultyInput,
} from "@/core/interfaces/zod";
import { Trip } from "@/core/interfaces";
import {
  BasicInfoSection,
  TypeAndDifficultySection,
  DurationSection,
  CostSection,
  GroupSizeSection,
  ActivityLevelSection,
  LocationSection,
  ScheduleSection,
  LogisticsSection,
  ImagesSection,
  ReviewAndSubmitSection,
} from "./sections"; // Ensure all sections are exported from './sections/index.ts'
import { Page } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary"; // Ensure this component exists
import { Progress } from "@/components/ui/progress"; interface TripFormProps {
  defaultTrip?: Trip | null;
  onSubmit: (tripData: TripFormInput, isEdit: boolean) => Promise<void>;
  isEdit: boolean;
}

const TripForm: React.FC<TripFormProps> = ({
  defaultTrip = null,
  onSubmit,
  isEdit,
}) => {
  const steps: string[] = [
    "Basic Information",
    "Type and Difficulty",
    "Duration",
    "Cost",
    "Group Size",
    "Activity Level",
    "Location",
    "Schedule",
    "Logistics",
    "Images",
    "Review and Submit",
  ];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<TripFormInput>({
    basicInfo: {
      name: "",
      description: "",
    },
    typeAndDifficulty: {
      type: "hiking",
      difficulty: "easy",
    },
    duration: { days: 1, nights: 0 },
    cost: { basePrice: 0, discount: 0 },
    groupSize: { min: 1, max: 10 },
    activityLevel: { activityLevel: 1 },
    location: {
      mainLocation: "",
      pointsOfInterest: [{ value: "" }],
    },
    schedule: {
      dates: [
        {
          startDate: "",
          endDate: "",
          isAvailable: true,
          slotsRemaining: 10,
        },
      ],
      itinerary: [],
    },
    logistics: {
      transportation: "",
      gearProvided: false,
      accommodation: "",
    },
    images: defaultTrip?.images.length! > 0 ? defaultTrip?.images! : [{ url: "" }],
  });

  const totalSteps: number = steps.length;

  useEffect(() => {
    if (defaultTrip) {
      setFormData({
        basicInfo: {
          name: defaultTrip.name,
          description: defaultTrip.description || "",
        },
        typeAndDifficulty: {
          type: defaultTrip.type,
          difficulty: defaultTrip.difficulty,
        },
        duration: defaultTrip.duration,
        cost: defaultTrip.cost,
        groupSize: defaultTrip.groupSize,
        activityLevel: { activityLevel: defaultTrip.activityLevel }, // Wrapped in object
        location: {
          mainLocation: defaultTrip.location.mainLocation,
          pointsOfInterest:
            defaultTrip.location.pointsOfInterest.length > 0
              ? defaultTrip.location.pointsOfInterest.map(
                (poi: string) => ({ value: poi })
              )
              : [{ value: "" }],
        },
        schedule: {
          dates:
            defaultTrip.schedule.dates.length > 0
              ? defaultTrip.schedule.dates.map((date) => ({
                ...date,
                startDate: new Date(date.startDate).toISOString().split("T")[0],
                endDate: new Date(date.endDate).toISOString().split("T")[0],
              }))
              : [
                {
                  startDate: "",
                  endDate: "",
                  isAvailable: true,
                  slotsRemaining: 10,
                },
              ],
          itinerary: defaultTrip.schedule.itinerary || [],
        },
        logistics: defaultTrip.logistics,
        images: defaultTrip.images.length > 0 ? defaultTrip.images : [{ url: "" }], // Ensure at least one image
      });
    }
  }, [defaultTrip]);

  // Handle form submission
  const handleFinalSubmit = async () => {
    try {
      // Validate the entire form data before submission
      const validatedData = tripSchema.parse(formData);
      // No transformation needed as pointsOfInterest is already { value: string }[]
      const transformedData: TripFormInput = validatedData;
      await onSubmit(transformedData, isEdit);
      alert("Trip successfully submitted!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        alert("Validation failed. Please check your inputs.");
        console.error(error.errors);
      } else {
        // Handle other errors
        alert("An unexpected error occurred.");
        console.error(error);
      }
    }
  };

  // Define step components mapping
  const stepComponents: { [key: number]: React.ReactElement } = {
    1: (
      <BasicInfoSection
        data={formData.basicInfo}
        onNext={(data: BasicInfoInput) =>
          handleNextStep({
            basicInfo: data,
          })
        }
      />
    ),
    2: (
      <TypeAndDifficultySection
        data={formData.typeAndDifficulty}
        onNext={(data: TypeAndDifficultyInput) =>
          handleNextStep({
            typeAndDifficulty: data,
          })
        }
      />
    ),
    3: (
      <DurationSection
        data={formData.duration}
        onNext={(data: DurationInput) =>
          handleNextStep({
            duration: data,
          })
        }
      />
    ),
    4: (
      <CostSection
        data={formData.cost}
        onNext={(data: CostInput) =>
          handleNextStep({
            cost: data,
          })
        }
      />
    ),
    5: (
      <GroupSizeSection
        data={formData.groupSize}
        onNext={(data: GroupSizeInput) =>
          handleNextStep({
            groupSize: data,
          })
        }
      />
    ),
    6: (
      <ActivityLevelSection
        data={formData.activityLevel}
        onNext={(data: ActivityLevelInput) =>
          handleNextStep({
            activityLevel: data,
          })
        }
      />
    ),
    7: (
      <LocationSection
        data={formData.location}
        onNext={(data: LocationInput) =>
          handleNextStep({
            location: data,
          })
        }
      />
    ),
    8: (
      <ScheduleSection
        data={formData.schedule}
        onNext={(data: ScheduleInput) =>
          handleNextStep({
            schedule: data,
          })
        }
      />
    ),
    9: (
      <LogisticsSection
        data={formData.logistics}
        onNext={(data: LogisticsInput) =>
          handleNextStep({
            logistics: data,
          })
        }
      />
    ),
    10: (
      <ImagesSection
        data={formData.images}
        onNext={(data: ImagesInput) =>
          handleNextStep({
            images: data,
          })
        }
      />
    ),
    11: (
      <ReviewAndSubmitSection
        data={formData}
        onSubmit={handleFinalSubmit}
      />
    ),
  };

  // Handle data from each section and proceed to next step
  const handleNextStep = (updatedFields: Partial<TripFormInput>) => {
    // Specifically handle pointsOfInterest to ensure structure
    if (updatedFields.location?.pointsOfInterest) {
      updatedFields.location.pointsOfInterest = updatedFields.location.pointsOfInterest.map(
        (poi: { value: string }) => ({ value: poi.value })
      );
    }

    setFormData((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    setCurrentStep((prev) => prev + 1);
  };

  // Get the current step component
  const currentStepComponent = stepComponents[currentStep];

  // Determine if it's the final step
  const isFinalStep = currentStep === totalSteps;

  const getStepHeader = () => {
    if (currentStep === 1) {
      return `Step ${currentStep} of ${steps.length}`;
    } else {
      const previousStepLabel = steps[currentStep - 2];
      return `Edit ${previousStepLabel} Step ${currentStep} of ${steps.length}`;
    }
  };
  return (
    <Page
      pageTitle="Admin Trip Management"
      renderBody={() => (
        <ErrorBoundary>
          <div className="mt-3">
            {/* Progress Bar */}
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="w-full h-2.5 mb-4 bg-gray-200 rounded-full"
            >
            </Progress>

            {/* Step Header */}
            <div className="flex items-start mb-6">
              <Button
                variant={"link"}
                className="px-0 items-start font-semibold text-base"
                onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : {})}
              >
                {currentStep > 1 && <ArrowLeft color="yellow" className="mr-3" />}
                {getStepHeader()}
              </Button>
            </div>

            {/* Current Step Component */}
            {currentStepComponent}

            {/* Navigation Buttons */}
            {!isFinalStep && (
              <div className="flex justify-end mt-6">
                {/* The "Continue" button is handled within each section */}
              </div>
            )}

            {isFinalStep && (
              <div className="flex justify-end mt-6">
                {/* The "Submit" button is handled within ReviewAndSubmitSection */}
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}
    />
  );
};

export default React.memo(TripForm);
