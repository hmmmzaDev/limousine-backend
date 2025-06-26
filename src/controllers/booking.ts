import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../helpers/apiError";
import { BookingService, CustomerService } from "../services";

export async function submitRideRequest(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { customerId, pickupLocation, dropoffLocation, rideTime } = req["validData"];

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

        const data = await BookingService.create({
            customerId,
            pickupLocation,
            dropoffLocation,
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
