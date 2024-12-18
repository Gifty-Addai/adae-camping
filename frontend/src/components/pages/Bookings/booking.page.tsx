// src/pages/BookingPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trip, BookingFormData } from "@/core/interfaces";
import PersonalInfo from "./booking-personalInfo";
import TravelDetails from "./booking-travel-details";
import ReviewConfirm from "./review";
import { useTripAPI } from "@/hooks/api.hook";
import { Page } from "@/components/ui/page";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingPage: React.FC = () => {
    const { loading, trips, getTripById } = useTripAPI();
    const params = useParams<{ id: string; date: string }>();
    const id = params.id;
    const dateId = params.date;

    const [currentStep, setCurrentStep] = useState(1);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [formData, setFormData] = useState<BookingFormData>({
        personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            notParticipating: false,
        },
        travelDetails: {
            dob: undefined,
            gender: "",
            streetAddress: "",
            address2: "",
            city: "",
            zipCode: "",
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const data = await getTripById(id);
                setTrip(data);

            }
        };
        fetchData();
    }, [id, getTripById]);

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const updateFormData = <K extends keyof BookingFormData>(
        section: K,
        data: Partial<BookingFormData[K]>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data,
            },
        }));
    };

    const selectedDate = trip?.schedule.dates.find((date) => date._id === dateId);

    const steps = ["Personal Information", "Travel Details", "Review & Confirm"];

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
            pageTitle="Booking"
            renderBody={() => (
                <div className="mt-3">
                    <h1 className="text-3xl text-card-foreground font-bold mb-3">Book Us</h1>
                    <div className="mb-6">
                        <p className="text-lg text-muted-foreground ">
                            Confirm trip dates & add member number
                        </p>
                    </div>

                    {/* Dynamic Step Header */}
                    <div className="mb-4">
                        {currentStep && (
                            <Button
                                variant={"link"}
                                className="px-0 items-start font-semibold text-base"
                                onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : {})}
                            >
                                {currentStep > 1 && <ArrowLeft color="yellow" className="mr-3" />}
                                {getStepHeader()}
                            </Button>
                        )}
                    </div>

                    {/* Render Current Step */}
                    {currentStep === 1 && (
                        <PersonalInfo
                            trip={trip}
                            selectedDate={selectedDate}
                            nextStep={nextStep}
                            updateData={(data) => updateFormData("personalInfo", data)}
                            data={formData.personalInfo}
                        />
                    )}
                    {currentStep === 2 && (
                        <TravelDetails
                            nextStep={nextStep}
                            trip={trip}
                            selectedDate={selectedDate}
                            data={formData.travelDetails}
                            updateData={(data) => updateFormData("travelDetails", data)}
                        />
                    )}
                    {currentStep === 3 && (
                        <ReviewConfirm formData={formData} trip={trip} selectedDate={selectedDate} />
                    )}
                </div>
            )}
        />
    );
};

export default BookingPage;
