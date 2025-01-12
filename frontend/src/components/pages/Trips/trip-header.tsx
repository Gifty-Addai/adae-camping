import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleDate, Trip } from "@/core/interfaces";
import { Link } from "react-router-dom";
import { ShareButtons } from "@/components/ui/share-button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { requestDateSchema } from "@/core/interfaces/zod";
import { getInclusiveDayDifference } from "@/lib/utils";
import { toast } from "react-toastify";
import { postRequest } from "@/lib/api-Request/api-requests";


/** This new interface is for the Request Form Modal */
interface RequestFormModalProps {
  tripId: string | undefined;
  tripName: string;
  duration: number;
  onClose: () => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

/** A simple Request Form modal to capture user details */
const RequestFormModal: React.FC<RequestFormModalProps> = ({
  tripName,
  tripId,
  duration,
  onClose,
  defaultStartDate = "",
  defaultEndDate = "",
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Store Zod validation errors so we can display them
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof requestDateSchema>, string[]>>
  >({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      name,
      phone,
      email,
      startDate,
      endDate
    };

    try {
      const result = requestDateSchema.parse(formData);

      setErrors({});
      const dayDiff = getInclusiveDayDifference(result.startDate, result.endDate);

      if (dayDiff !== duration) {
        toast.info(`The date interval must be exactly ${duration} days!`);
        return;
      }

      console.log("Form Data:", result);

      try {

        const succ = await postRequest<{ sent: boolean }>(`/api/trip/requestDate/${tripId}`, { ...result, tripName });
        if (succ.sent) {
          toast.success("Request sent successfully!");
          onClose();
        } else {
          toast.error("Failed to send request. Please try again later.");
        }
      } catch (error) {
        toast.error("Failed to send request. Please try again later.");
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-card rounded-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <Button
          className="absolute top-4 right-4"
          onClick={onClose}
          size="icon"
          aria-label="Close Modal"
        >
          &times;
        </Button>

        <h2 className="text-xl text-yellow-400 font-bold mb-4">Request Date</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-card-foreground text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm text-card-foreground font-semibold" htmlFor="phone">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-card-foreground text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 text-card-foreground text-sm font-semibold" htmlFor="startDate">
              Trip Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate[0]}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-card-foreground mb-1 text-sm font-semibold" htmlFor="endDate">
              Trip End Date
            </label>
            <Input
              id="endDate"
              type="date"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


/** Modal component interface */
interface TripDatesModalProps {
  duration: number;
  tripName: string;
  cost: number;
  tripId: string | undefined;
  departures: ScheduleDate[];
  selectedDate: ScheduleDate | null;
  setSelectedDate: (date: ScheduleDate) => void;
  onClose: () => void;
  groupSizeMin: number;
}

/** TripDatesModal: A scrollable, centered modal with year toggles and availability cards */
const TripDatesModal: React.FC<TripDatesModalProps> = ({
  tripId,
  cost,
  duration,
  departures,
  tripName,
  selectedDate,
  setSelectedDate,
  onClose,
  groupSizeMin,
}) => {
  const [years, setYears] = useState<number[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const [showRequestFormModal, setShowRequestFormModal] = useState(false);

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
        <Button
          className="absolute top-4 right-4"
          onClick={onClose}
          size={"icon"}
          aria-label="Close"
        >
          &times;
        </Button>

        {/* Centered modal content */}
        <div className="p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl text-card-foreground font-bold mb-2">Select your trip dates</h2>
          <p className="text-md text-muted-foreground mb-6">{tripName}</p>

          {/* Year Toggles (centered) */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {years.map((yr) => (
              <Button
                key={yr}
                variant={activeYear === yr ? "secondary" : "outline"}
                onClick={() => setActiveYear(yr)}
                className="text-yellow-400"
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
                isAvailable && slotsRemaining > 0 && slotsRemaining <= groupSizeMin;


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

            {!selectedDate && (
              <Button onClick={() => setShowRequestFormModal(true)}>
                Request Date
              </Button>
            )}
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
                +233202814017
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

      {showRequestFormModal && (
        <RequestFormModal
          tripId={tripId}
          tripName={tripName}
          duration={duration}
          onClose={() => setShowRequestFormModal(false)}
        /** If you want to pass in defaults, e.g. today's date: 
            defaultStartDate={format(new Date(), 'yyyy-MM-dd')}
            defaultEndDate={format(new Date(), 'yyyy-MM-dd')}
         */
        />
      )}
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
  const [selectedDate, setSelectedDate] = useState<ScheduleDate | null>(null);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const shareUrl = `${baseUrl}/product/${encodeURIComponent((trip?.name || '').substring(0, 30))}/${trip?._id ?? ''}`;
  const tripTitle = trip?.name || 'Trip Details';


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
        <div className="mb-6">
          <ShareButtons buttonText="Share this trip" url={shareUrl} title={tripTitle} />
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
          <CardContent className="p-6 space-y-4">

            {/* Pricing Info */}
            <div>
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="text-2xl font-bold text-primary">
              ₵ {(trip.cost.basePrice - trip.cost.discount).toLocaleString()}{" "}
                <span className="text-sm font-normal text-foreground">
                  for Fie Members
                </span>
              </p>
              <p className="font-normal mt-5 text-primary text-md">
              ₵ {(trip.cost.basePrice + trip.cost.discount).toLocaleString()}{" "}
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
                <p className="text-sm text-red-500">Available dates sold out</p>
              )}
            </div>

            <Button className="w-full" onClick={() => setShowModal(true)}>
              {selectedDate ? "Select Dates" : "Request Date"}
            </Button>

            {/* Private Booking Contact Info */}
            <div className="mt-4">
              <p className="text-muted-foreground font-semibold mb-2">
                For Private Booking Contact:
              </p>
              <p className="text-xs text-yellow-400">
                📧{" "}
                <a
                  href="mailto:akoben@fie.com"
                  className="hover:underline"
                >
                  akoben@fie.com
                </a>{" "}
                or 📞{" "}
                <a
                  href="tel:+233202814017"
                  className="hover:underline"
                >
                  +233202814017
                </a>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>


      {/* Modal */}
      {showModal && (
        <TripDatesModal
          tripId={trip._id}
          cost={trip.cost.basePrice}
          duration={trip.duration.days}
          tripName={trip.name}
          departures={trip.schedule.dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onClose={() => setShowModal(false)}
          groupSizeMin={trip.groupSize.min}
        />
      )}
    </section>
  );
};

export default TripHeaderCTA;
