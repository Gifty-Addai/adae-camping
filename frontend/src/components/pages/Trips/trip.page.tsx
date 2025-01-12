import React from 'react';
import { useTripAPI } from '@/hooks/api.hook';
import TripCard from './trip-card';
import { Page } from '@/components/ui/page';
// import { Filter as FilterIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { TripSearchParams } from '@/core/interfaces';
// import TripFilter from './trip.filter';
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogOverlay,
//   DialogTrigger,
// } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';

export const TripPage: React.FC = () => {
  const { loading, trips } = useTripAPI();
  // const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);



  // const handleApplyFilters = useCallback((params: TripSearchParams) => {
  //   searchTrip({ ...params, status: 'open' });
  // }, [searchTrip]);

  return (
    <Page
      pageTitle='trips'
      renderBody={() => (
        <div className="mt-3 ">
          {/* Left Filter Section for Large Screens */}
          {/* <div className="mr-5 hidden lg:block lg:w-40">
            <TripFilter onApply={handleApplyFilters} isMobile={false} />
          </div> */}

          {/* Filter Button for Small Screens */}
          {/* <div className="flex justify-end mb-4 lg:hidden">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <FilterIcon className="mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
              <DialogContent className="fixed z-50 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 h-4/5 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <DialogClose asChild>
                    <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                      ✕
                    </Button>
                  </DialogClose>
                </div>
                <div className="h-full overflow-y-auto">
                  <TripFilter
                    onApply={handleApplyFilters}
                    isMobile={true}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div> */}

          {/* Main Trip Cards Section */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden mb-4">
                    <Skeleton key={index} className="w-full h-96" />
                  </div>
                  // <div
                  //   key={index}
                  //   className="bg-gray-300 w-64 rounded-lg animate-pulse h-64"
                  // ></div>
                ))}
              </div>
            ) : trips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8">
                {trips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                <h2 className="text-2xl text-card-foreground font-semibold">
                  Looks like there are no adventures to book yet! 🌲⛺️
                </h2>
                <p className="text-muted-foreground max-w-md">
                  No worries—this just means extra time to daydream about roaring campfires and breathtaking hikes!
                  Rest assured, when you're ready to lace up those boots, we'll be here to help you find your perfect trail.
                  Until then, keep the s’mores on standby! 🔥🍫
                </p>
                {/* <Link to={''}>
                <Button
                >
                  Reach Out to Us
                </Button> */}
                {/* </Link> */}

              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default TripPage;
