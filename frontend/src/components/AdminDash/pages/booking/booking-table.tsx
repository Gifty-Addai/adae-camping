import React, { useState, useEffect, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Spinner } from '@/components/ui/loader/_spinner';
import BookingCard from './admin-booking-card';
import ConfirmModal from './modals/booking-confirm.modal';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Booking, BookingSearchParams } from '@/core/interfaces';
import Pagination from '@/components/ui/pagination';
import SearchBar from '@/components/ui/search_input';
import { useMailAPI } from '@/hooks/api.hook';
import { useBookingAPI } from '@/hooks/booking.hook';

interface BookingTableProp {
    bookings: Booking[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    getBookings: (page?: number, filters?: BookingSearchParams) => Promise<void>;
}

const BookingsTable: React.FC<BookingTableProp> = ({
    bookings,
    loading,
    currentPage,
    totalPages,
    getBookings,
    goToPage,
}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const { bookingConfirm, bookingCancel } = useMailAPI()
    const { editBooking } = useBookingAPI();


    const handleDeleteClick = useCallback(async (id: string)  => {
        setBookingToDelete(id);
        await editBooking(id, {
            status: "cancelled",
        })
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (bookingToDelete) {
            await bookingCancel(bookingToDelete);
            setBookingToDelete(null);
            setIsDeleteModalOpen(false);
        }
    }, [bookingToDelete]);

    const cancelDelete = useCallback(() => {
        setBookingToDelete(null);
        setIsDeleteModalOpen(false);
    }, []);

    const handleSearchChange = useCallback((query: string) => {
        setSearchTerm(query);
    }, []);

    const handleFilterChange = useCallback((value: string) => {
        setFilterStatus(value);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const filters: BookingSearchParams = {};
            if (searchTerm.trim() !== '') {
                filters.trip = searchTerm.trim();
            }
            if (filterStatus !== 'All') {
                filters.status = filterStatus as Booking['status'];
            }
            await getBookings(currentPage, filters);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filterStatus, currentPage]);

    return (
        <div className="mt-8">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                {/* Search Input */}
                <div className="flex items-center mb-2 sm:mb-0">
                    <SearchBar placeholder='Search with ID ...' onSearch={handleSearchChange} />
                </div>

                {/* Filter Select */}
                <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-500 mr-2" />
                    <Select onValueChange={handleFilterChange} value={filterStatus}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="reschedule">Reschedule</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Bookings List */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <BookingCard
                            {...booking}
                            onCancel={() => {
                                handleDeleteClick(booking._id);
                            }}
                            onConfirm={async () => {
                                await editBooking(booking._id, {
                                    status: "confirmed",
                                })
                                await bookingConfirm(booking._id)
                            }}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-300">No bookings found.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-4">
                <Pagination
                    goToPage={goToPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this booking? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default BookingsTable;