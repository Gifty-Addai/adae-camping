import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTripAPI } from "@/hooks/api.hook";
import { Trip } from "@/core/interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TripHeaderCTA from "./trip-header";
import { Page } from "@/components/ui/page";

// Simple tab component interface
interface TabProps {
  label: string;
  activeTab: string;
  onClick: (label: string) => void;
  icon?: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, activeTab, onClick, icon }) => {
  return (
    <li className="mr-2">
      <button
        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg 
          ${
            activeTab === label
              ? "text-primary border-primary"
              : "border-transparent text-muted-foreground hover:text-secondary-foreground hover:border-secondary"
          }`}
        onClick={() => onClick(label)}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </button>
    </li>
  );
};

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const { getTripById, loading } = useTripAPI();
  const [activeTab, setActiveTab] = useState<string>("Overview");

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (id) {
        const data = await getTripById(id);
        setTrip(data);
      }
    };
    fetchTripDetails();
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!trip) return <p className="text-destructive">Trip details not found.</p>;

  return (

    <Page
        renderBody={()=>(
            <div className="mt-3">
            {/* Image Carousel */}
            <section className="rounded-lg overflow-hidden mb-4">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                style={{ width: "100%", height: "400px" }}
              >
                {trip?.images?.map((image, index) => (
                  <SwiperSlide key={index} style={{ width: "100%", height: "100%" }}>
                    <img
                      src={image}
                      alt={`Trip Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
      
            {/* Trip Header and Pricing/CTA */}
             <TripHeaderCTA
              trip={trip}
            />
      
            {/* Highlights Section */}
            <section className="p-6 bg-card rounded-lg shadow-lg space-y-4">
              <h2 className="text-xl font-bold text-primary">Trip Highlights</h2>
              <ul className="list-disc list-inside text-card-foreground">
                {trip?.location?.pointsOfInterest?.map((poi, index) => (
                  <li className="text-card-foreground" key={index}>{poi}</li>
                ))}
              </ul>
            </section>
      
            {/* Tabs */}
            <section className="border-b border-border">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-muted-foreground">
                <Tab label="Overview" activeTab={activeTab} onClick={setActiveTab} />
                <Tab label="Itinerary" activeTab={activeTab} onClick={setActiveTab} />
                <Tab label="Logistics" activeTab={activeTab} onClick={setActiveTab} />
              </ul>
            </section>
      
            {/* Tab Content */}
            <div className="mt-4">
              {/* Overview Tab */}
              {activeTab === "Overview" && (
                <div>
                  <h2 className="text-xl font-bold text-primary">Trip Overview</h2>
                  <p className="text-muted-foreground mt-2">{trip?.description}</p>
                </div>
              )}
      
              {/* Itinerary Tab */}
              {activeTab === "Itinerary" && (
                <div>
                  <h2 className="text-xl font-bold text-primary">Daily Itinerary</h2>
                  <ul className="space-y-4 mt-4">
                    {trip?.schedule?.itinerary?.map((item) => (
                      <li
                        key={item._id}
                        className="border rounded-lg p-4 bg-card shadow-sm"
                      >
                        <h3 className="text-foreground font-bold">
                          Day {item.day}:{" "}
                          <span className="text-muted-foreground font-normal">
                            {item.activities}
                          </span>
                        </h3>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
      
              {/* Logistics Tab */}
              {activeTab === "Logistics" && (
                <div>
                  <h2 className="text-xl font-bold text-primary">Trip Logistics</h2>
                  <div className="text-muted-foreground mt-2 space-y-2">
                    <p className="text-card-foreground">
                      <strong className="text-yellow-400">Transportation:</strong>{" "}
                      {trip?.logistics?.transportation || "N/A"}
                    </p>
                    <p className="text-card-foreground">
                      <strong className="text-yellow-400">Gear Provided:</strong>{" "}
                      {trip?.logistics?.gearProvided ? "Yes" : "No"}
                    </p>
                    <p className="text-card-foreground">
                      <strong className="text-yellow-400">Accommodation:</strong>{" "}
                      {trip?.logistics?.accommodation || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    />
  
  );
};

export default TripDetail;
