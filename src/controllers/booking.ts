import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../helpers/apiError";
import { BookingService, CustomerService, DriverService } from "../services";

export async function submitRideRequest(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const {
            startLocation,
            finalLocation,
            stops,
            numberOfPassengers,
            numberOfLuggage,
            note,
            contactInfo,
            rideTime
        } = req["validData"];

        // Get customer ID from authenticated user
        const customerId = req.user?.userId;
        if (!customerId) {
            return next(new BadRequestError("Customer ID not found in authentication"));
        }

        // Validate that customer exists
        const customer = await CustomerService.findById(customerId);
        if (!customer) {
            return next(new NotFoundError("Customer not found"));
        }

        // Validate ride time is in the future
        const requestedTime = new Date(rideTime);
        if (requestedTime <= new Date()) {
            return next(new BadRequestError("Ride time must be in the future"));
        }

        // Validate location data
        if (!startLocation || !startLocation.longitude || !startLocation.latitude || !startLocation.locationName) {
            return next(new BadRequestError("Start location must include longitude, latitude, and locationName"));
        }

        if (!finalLocation || !finalLocation.longitude || !finalLocation.latitude || !finalLocation.locationName) {
            return next(new BadRequestError("Final location must include longitude, latitude, and locationName"));
        }

        // Validate stops if provided
        if (stops && Array.isArray(stops)) {
            for (const stop of stops) {
                if (!stop.longitude || !stop.latitude || !stop.locationName) {
                    return next(new BadRequestError("Each stop must include longitude, latitude, and locationName"));
                }
            }
        }

        const data = await BookingService.create({
            customerId: new (require('mongoose')).Types.ObjectId(customerId),
            startLocation,
            finalLocation,
            stops: stops || [],
            numberOfPassengers,
            numberOfLuggage,
            note: note || null,
            contactInfo,
            rideTime: requestedTime,
            status: "Pending", // Initial status as per requirements
        });

        return res.json({
            status: "success",
            data,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function fetchBookings(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { status, ...otherFilters } = req["validData"];

        // Build filter object
        const filter: any = { ...otherFilters };
        if (status) {
            filter.status = status;
        }

        const data = await BookingService.findAll(filter);

        return res.json({
            status: "success",
            data
        });
    } catch (error) {
        return next(new NotFoundError("No Record Found", error));
    }
}

export async function findById(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { id } = req["validData"];
        const data = await BookingService.findById(id);

        if (!data) {
            return next(new NotFoundError("Booking not found"));
        }

        return res.json({ status: "success", data });
    } catch (error) {
        return next(new NotFoundError("No Record Found", error));
    }
}

export async function assignDriverAndSetPrice(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { bookingId, driverId, finalPrice } = req["validData"];

        // Validate booking exists and is in correct status
        const booking = await BookingService.findById(bookingId);
        if (!booking) {
            return next(new NotFoundError("Booking not found"));
        }

        if (booking.status !== "Pending") {
            return next(new BadRequestError("Booking must be in 'Pending' status to assign driver"));
        }

        // Validate driver exists and is available
        const driver = await DriverService.findById(driverId);
        if (!driver) {
            return next(new NotFoundError("Driver not found"));
        }

        if (driver.status !== "available") {
            return next(new BadRequestError("Driver is not available"));
        }

        // Validate price is positive
        if (finalPrice <= 0) {
            return next(new BadRequestError("Final price must be greater than 0"));
        }

        // Update booking with driver assignment and price
        const updatedBooking = await BookingService.updateById(bookingId, {
            driverId,
            finalPrice,
            status: "Awaiting-Acceptance"
        });

        return res.json({
            status: "success",
            data: updatedBooking,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function acceptRideQuote(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { bookingId } = req["validData"];

        // Get customer ID from authenticated user
        const customerId = req.user?.userId;
        if (!customerId) {
            return next(new BadRequestError("Customer ID not found in authentication"));
        }

        // Validate booking exists and is in correct status
        const booking = await BookingService.findById(bookingId);
        if (!booking) {
            return next(new NotFoundError("Booking not found"));
        }

        // Verify ownership - booking must belong to the authenticated customer
        if (booking.customerId.toString() !== customerId) {
            return next(new BadRequestError("You can only accept quotes for your own bookings"));
        }

        if (booking.status !== "Awaiting-Acceptance") {
            return next(new BadRequestError("Booking must be in 'Awaiting-Acceptance' status to accept quote"));
        }

        // Update booking status to Assigned
        const updatedBooking = await BookingService.updateById(bookingId, {
            status: "Assigned"
        });

        return res.json({
            status: "success",
            data: updatedBooking,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function cancelBooking(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { bookingId } = req["validData"];

        // Get customer ID from authenticated user
        const customerId = req.user?.userId;
        if (!customerId) {
            return next(new BadRequestError("Customer ID not found in authentication"));
        }

        // Validate booking exists
        const booking = await BookingService.findById(bookingId);
        if (!booking) {
            return next(new NotFoundError("Booking not found"));
        }

        // Verify ownership - booking must belong to the authenticated customer
        if (booking.customerId.toString() !== customerId) {
            return next(new BadRequestError("You can only cancel your own bookings"));
        }

        // Check if booking can be cancelled (not already completed)
        if (booking.status === "Completed") {
            return next(new BadRequestError("Cannot cancel a completed booking"));
        }

        if (booking.status === "Cancelled") {
            return next(new BadRequestError("Booking is already cancelled"));
        }

        // Update booking status to Cancelled
        const updatedBooking = await BookingService.updateById(bookingId, {
            status: "Cancelled"
        });

        return res.json({
            status: "success",
            data: updatedBooking,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function fetchAssignedRides(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        // Get driver ID from authenticated user
        const driverId = req.user?.userId;
        if (!driverId) {
            return next(new BadRequestError("Driver ID not found in authentication"));
        }

        // Validate driver exists
        const driver = await DriverService.findById(driverId);
        if (!driver) {
            return next(new NotFoundError("Driver not found"));
        }

        // Fetch all bookings assigned to this driver
        const assignedRides = await BookingService.findAll({
            driverId: driverId,
            status: { $in: ["Assigned", "En-Route"] } // Only show active rides
        });

        return res.json({
            status: "success",
            data: assignedRides,
        });
    } catch (error) {
        return next(new NotFoundError("No Record Found", error));
    }
}

export async function updateRideStatus(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { bookingId, newStatus } = req["validData"];

        // Get driver ID from authenticated user
        const driverId = req.user?.userId;
        if (!driverId) {
            return next(new BadRequestError("Driver ID not found in authentication"));
        }

        // Validate booking exists
        const booking = await BookingService.findById(bookingId);
        if (!booking) {
            return next(new NotFoundError("Booking not found"));
        }

        // Verify ownership - booking must be assigned to the authenticated driver
        if (!booking.driverId || booking.driverId.toString() !== driverId) {
            return next(new BadRequestError("You can only update status for rides assigned to you"));
        }

        // Validate status transitions
        const validTransitions = {
            "Assigned": ["En-Route"],
            "En-Route": ["Completed"]
        };

        if (!validTransitions[booking.status] || !validTransitions[booking.status].includes(newStatus)) {
            return next(new BadRequestError(`Cannot transition from '${booking.status}' to '${newStatus}'. Valid transitions from '${booking.status}': ${validTransitions[booking.status]?.join(", ") || "none"}`));
        }

        // Update booking status
        const updatedBooking = await BookingService.updateById(bookingId, {
            status: newStatus
        });

        // If ride is completed, update driver status to available
        if (newStatus === "Completed" && booking.driverId) {
            await DriverService.updateById(booking.driverId.toString(), {
                status: "available"
            });
        }

        return res.json({
            status: "success",
            data: updatedBooking,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}
