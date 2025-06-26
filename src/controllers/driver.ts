import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../helpers/apiError";
import { DriverService } from "../services";

export async function addRecord(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { name, vehicleDetails, status } = req["validData"];

        const data = await DriverService.create({
            name,
            vehicleDetails,
            status: status || "available", // Default to available if not provided
        });
        return res.json({
            status: "success",
            data,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function findAll(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const data = await DriverService.findAll({ ...req["validData"] });

        return res.json({ status: "success", data });
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
        const data = await DriverService.findById(id);

        return res.json({ status: "success", data });
    } catch (error) {
        return next(new NotFoundError("No Record Found", error));
    }
}

export async function updateRecord(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { recordId, ...otherFields } = req["validData"];

        const oldData = await DriverService.findById(recordId);

        if (!oldData) {
            return next(new NotFoundError("Invalid id"));
        }

        await DriverService.updateById(recordId, {
            ...otherFields,
        });
        return res.json({
            status: "success",
            data: await DriverService.findById(recordId),
        });
    } catch (error) {
        return next(new NotFoundError("No Record Found", error));
    }
}

export async function deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { recordId } = req["validData"];
        const oldData = await DriverService.findById(recordId);

        if (!oldData) {
            return next(new NotFoundError("Invalid id"));
        }

        await DriverService.deleteById(recordId);
        return res.json({
            status: "success",
            data: "Record deleted successfully",
        });
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}
