import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trip, TripDate } from "@/core/interfaces";
import { Link } from "react-router-dom";

/** Modal component interface */
interface TripDatesModalProps {
  tripName: string;
  cost: number;
  tripId: string | undefined;
  departures: TripDate[];
  selectedDate: TripDate | null;
  setSelectedDate: (date: TripDate) => void;
  onClose: () => void;
  groupSizeMax: number;
}

/** TripDatesModal: A scrollable, centered modal with year toggles and availability cards */
const TripDatesModal: React.FC<TripDatesModalProps> = ({
  tripId,
  cost,
  departures,
  tripName,
  selectedDate,
  setSelectedDate,
  onClose,
  groupSizeMax,
}) => {
  const [years, setYears] = useState<number[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Collect unique years from the departures
  useEffect(() => {
    const uniqueYears = Array.from(
      new Set(departures.map((dep) => new Date(dep.startDate).getFullYear()))
    ).sort();
    setYears(uniqueYears);

    // Default the activeYear to the first available if any
    if (uniqueYears.length > 0) {
      setActiveYear(uniqueYears[0]);
    }
  }, [departures]);

  // Filter departures by the currently active year
  const filteredDepartures = departures.filter((dep) => {
    const year = new Date(dep.startDate).getFullYear();
    return year === activeYear;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      {/* Modal container with max height and scrollable content */}
      <div className="bg-card rounded-lg w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Centered modal content */}
        <div className="p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl text-card-foreground font-bold mb-2">Select your trip dates</h2>
          <p className="text-md text-muted-foreground mb-6">{tripName}</p>

          {/* Year Toggles (centered) */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {years.map((yr) => (
              <Button
                key={yr}
                variant={activeYear === yr ? "default" : "outline"}
                onClick={() => setActiveYear(yr)}
              >
                {yr}
              </Button>
            ))}
          </div>

          {/* Departure Cards (centered grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
            {filteredDepartures.length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground">
                No departures found for {activeYear}.
              </p>
            )}
            {filteredDepartures.map((dep) => {
              const { _id, startDate, endDate, isAvailable, slotsRemaining } = dep;

              // Format date strings "MMM d"
              const shortStart = format(new Date(startDate), "MMM d");
              const shortEnd = format(new Date(endDate), "MMM d");

              const isLimited =
                isAvailable && slotsRemaining > 0 && slotsRemaining < groupSizeMax;

              return (
                <div
                  key={_id ?? `${startDate}-${endDate}`}
                  className="border w-60 border-amber-400 rounded-3xl p-4 flex flex-col justify-between items-center"
                >
                  <div className="mb-3 text-center">
                    <p className="text-lg text-muted-foreground font-semibold">
                      {shortStart} – {shortEnd}
                    </p>
                    <p className="text-sm text-card-foreground">from GHS {cost}</p>
                  </div>

                  {isAvailable ? (
                    <div className="w-full">
                      <Link to={`/ASGSDWSDZ-234ADFSDAS/booking/${tripId}/${selectedDate?._id}`}>

                        <Button
                          className="w-full bg-green-700 hover:bg-green-800 text-white mb-2"
                          onClick={() => {
                            setSelectedDate(dep);
                            onClose();
                          }}
                        >
                          Request space
                        </Button>
                      </Link>
                      {isLimited && (
                        <p className="text-center text-red-600 text-sm font-semibold">
                          Limited availability
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-400 font-semibold">Sold out</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disclaimers (centered text) */}
          <div className="text-sm text-gray-600 space-y-2 mb-6">
            <p className="text-muted-foreground">Prices are per person.</p>
            {/* <p>
              All dates are subject to hotel availability and may change. Hotel
              reservations will be confirmed approximately 12 months prior to
              departure.
            </p> */}
          </div>

          <div className="text-sm space-y-2 text-center mb-6">
            {/* <p className="text-muted-foreground">
              Don&apos;t see the dates you&apos;re looking for?{" "}
              <a href="#" className="underline">
                Sign up for trip updates
              </a>{" "}
              or{" "}
              <a href="#" className="underline">
                book a private departure
              </a>
            </p> */}
            <p className="text-muted-foreground">
              Want to join a waitlist? Contact us to join the waitlist for any
              sold-out date:{" "}
              <a href="mailto:travel@rei.com" className="underline">
                akoben@fienefie.com
              </a>{" "}
              |{" "}
              <a href="tel:1-800-622-2236" className="underline">
                +233 247413964
              </a>
              <br />
              Mon–Sun 7am–5pm GMT
            </p>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={onClose}>
              Back to trip page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  trip: Trip;
}

const TripHeaderCTA: React.FC<Props> = ({
  trip
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<TripDate | null>(null);

  // Automatically select first available date, if any, on mount or whenever `departures` changes
  useEffect(() => {
    if (trip.schedule.dates.length > 0) {
      const firstAvailable = trip.schedule.dates.find((d) => d.isAvailable);
      if (firstAvailable) {
        setSelectedDate(firstAvailable);
      }
    }
  }, [trip.schedule.dates]);

  return (
    <section className="flex flex-col my-8 lg:flex-row justify-between items-start lg:space-y-0 lg:space-x-6">
      {/* Left Column */}
      <div className="space-y-6 lg:w-2/3 lg:mt-2">
        <h1 className="text-3xl font-bold text-card-foreground mb-4 leading-tight">
          {trip.name}
        </h1>
        {/* Star Rating */}
        {/* <div className="flex items-center space-x-2 text-yellow-400">
          <span className="text-2xl">★★★★★</span>
          <span className="text-muted-foreground text-lg font-medium">
            5.0 ({12} Reviews)
          </span>
        </div> */}
        {/* Share Links */}
        <div className="flex space-x-3 text-white text-md font-medium">
          <span className="text-card-foreground">Share this trip:</span>
          <a href="#" className="hover:text-yellow-400">
            Facebook
          </a>
          <a href="#" className="hover:text-primary">
            TikTok
          </a>
          <a href="#" className="hover:text-blue-400">
            Twitter
          </a>
        </div>
        {/* Trip Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8 text-secondary">
          <div>
            <p className="uppercase text-yellow-200 text-sm font-semibold">Trip Length</p>
            <p className="text-2xl font-bold text-card-foreground">
              {trip.duration.days} Days
            </p>
          </div>
          <div>
            <p className="uppercase text-sm text-yellow-200 font-semibold">Group Size</p>
            <p className="text-2xl font-bold text-card-foreground">
              {trip.groupSize.min} - {trip.groupSize.max}
            </p>
          </div>
          <div>
            <p className="uppercase text-sm text-yellow-200 font-semibold">Activity Level</p>
            <p className="text-2xl font-bold text-card-foreground">
              {trip.activityLevel}{" "}
              <span className="text-muted-foreground text-xl">ⓘ</span>
            </p>
          </div>
        </div>

      </div>

      {/* Right Column: Pricing Card */}
      <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
        <Card className="bg-card text-card-foreground shadow-md rounded-lg border border-border">
          <CardContent className="p-4 space-y-2">
            {/* Pricing Info */}
            <div>
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="text-2xl font-bold text-primary">
                ${(trip.cost.basePrice - trip.cost.discount).toLocaleString()}{" "}
                <span className="text-sm font-normal text-foreground">
                  for Fie Members
                </span>
              </p>
              <p className="font-normal mt-5 text-primary text-md">
                ${(trip.cost.basePrice + trip.cost.discount).toLocaleString()}{" "}
                <span className="text-sm font-normal text-foreground">
                  for non-members
                </span>
              </p>
            </div>

            {/* Selected Date */}
            <div>
              <p className="text-muted-foreground font-semibold">Departure</p>
              {selectedDate ? (
                <p className="text-lg font-bold text-foreground">
                  {format(new Date(selectedDate.startDate), "MMM d")} –{" "}
                  {format(new Date(selectedDate.endDate), "MMM d")}
                </p>
              ) : (
                <p className="text-sm text-red-500">No available dates</p>
              )}
            </div>

            <Button className="w-full" onClick={() => setShowModal(true)}>
              Select Dates
            </Button>

            {/* Contact Info */}
            <div className="flex flex-row items-center mt-4 space-y-1 text-muted-foreground">
              <Button size="sm" className="pr-3" variant="link">
                <a
                  href="mailto:travel@rei.com"
                  className="text-yellow-400 text-xs"
                >
                  📧 akoben@fie.com
                </a>
              </Button>
              <Button size="sm" className="p-0" variant="link">
                <a href="tel:1-800-622-2236" className="text-yellow-400 text-xs">
                  📞 233 247413964
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <TripDatesModal
          tripId={trip._id}
          cost={trip.cost.basePrice}
          tripName={trip.name}
          departures={trip.schedule.dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onClose={() => setShowModal(false)}
          groupSizeMax={trip.groupSize.max}
        />
      )}
    </section>
  );
};

export default TripHeaderCTA;
