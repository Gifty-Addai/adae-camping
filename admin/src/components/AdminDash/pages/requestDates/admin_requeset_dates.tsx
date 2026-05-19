import React, { useEffect, useState, MouseEvent } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import { RequestItem } from "@/core/interfaces";
import { getRequest } from "@/lib/api-Request/api-requests";
import { format } from "date-fns";
import { Page } from "@/components/ui/page";

/** Extended shape of your request array from the server. */
interface RequestsApiResponse {
    requests: RequestItem[];
    currentPage?: number;
    totalPages?: number;
    totalRequests?: number;
}

const AdminRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await getRequest<RequestsApiResponse>("/api/trip/getAllRequests");

                // If your backend returns { requests: [...] }
                setRequests(response.requests);
            } catch (err) {
                setError("Failed to fetch requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleOpenDetails = (req: RequestItem) => {
        setSelectedRequest(req);
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
    };

    if (loading) {
        return <div className="p-4">Loading requests...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    /**
     * Optional helper for avatar fallback text:
     * e.g., "John Doe" => "JD"
     */
    const getInitials = (fullName: string): string => {
        const parts = fullName.split(" ");
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return parts
            .slice(0, 2)
            .map((p) => p.charAt(0).toUpperCase())
            .join("");
    };

    return (
        <Page
            renderBody={() => (
                <div className="mt-5 space-y-6">

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requests.map((req) => {
                            // For demonstration, we'll add a "status" badge in the card
                            // You might have status logic from your DB. Here, let's just say they're "Pending".
                            const status = "Pending";

                            return (
                                <Card
                                    key={req._id}
                                    className="cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => handleOpenDetails(req)}
                                >
                                    <CardHeader className="flex flex-row items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>{getInitials(req.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1">
                                            <CardTitle className="text-yellow-400">{req.tripName}</CardTitle>
                                            <CardDescription className="text-sm text-card-foreground">
                                                {req.name}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-x-7">
                                        {/* Email with tooltip */}
                                        <p className="text-sm ml-7 text-card-foreground">
                                            <Tooltip>
                                                <TooltipTrigger className="underline decoration-dotted">
                                                    {req.email}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span>Contact email</span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </p>

                                        {/* Dates with custom formatting */}
                                        <p className="text-sm text-card-foreground">
                                            {format(new Date(req.startDate), "MMM d, yyyy")} –{" "}
                                            {format(new Date(req.endDate), "MMM d, yyyy")}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="flex justify-between items-center">
                                        {/* Status Badge */}
                                        <Badge variant="outline">{status}</Badge>

                                        <Button
                                            variant="outline"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                handleOpenDetails(req);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Dialog (Modal) for selected request details */}
                    <Dialog open={!!selectedRequest} onOpenChange={handleCloseDialog}>
                        <DialogContent className="max-w-xl">
                            {selectedRequest && (
                                <>
                                    <DialogHeader >
                                        <DialogTitle className="text-yellow-400">Request Details</DialogTitle>
                                        <DialogDescription className="text-card-foreground">
                                            Review trip information and user details for this request.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 mt-4">
                                        {/* Section 1: Basic Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-yellow-400">Requester Info</h3>
                                            <Separator className="my-2" />
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-card-foreground"> 
                                                    <strong className="text-muted-foreground">Name:</strong> {selectedRequest.name}
                                                </div>
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">Phone:</strong> {selectedRequest.phone}
                                                </div>
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">Email:</strong> {selectedRequest.email}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 2: Trip Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-yellow-400">Trip Details</h3>
                                            <Separator className="my-2" />
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">Trip Name:</strong> {selectedRequest.tripName}
                                                </div>
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">Trip ID:</strong> {selectedRequest.tripId}
                                                </div>
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">Start Date:</strong>{" "}
                                                    {format(new Date(selectedRequest.startDate), "PPP")}
                                                </div>
                                                <div className="text-card-foreground">
                                                    <strong className="text-muted-foreground">End Date:</strong>{" "}
                                                    {format(new Date(selectedRequest.endDate), "PPP")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: Extra Info */}
                                        {selectedRequest.createdAt && (
                                            <div className="text-card-foreground">
                                                <h3 className="text-lg font-semibold text-yellow-400">Metadata</h3>
                                                <Separator className="my-2" />
                                                <p className="text-sm text-card-foreground">
                                                    <strong className="text-muted-foreground">Created At:</strong>{" "}
                                                    {new Date(selectedRequest.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        />
    );
};

export default AdminRequestsPage;
