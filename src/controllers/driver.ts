import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "../helpers/apiError";
import { DriverService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function addRecord(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { name, email, password, vehicleDetails, status } = req["validData"];

        // Check if email already exists
        const existingDriver = await DriverService.findOne({ email });
        if (existingDriver) {
            return next(new BadRequestError("Email already exists"));
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const data = await DriverService.create({
            name,
            email,
            password: hashedPassword,
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

export async function driverLogin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { email, password } = req["validData"];

        // Find driver by email with password field
        const driver = await DriverService.findOne({ email }, { password: 1, name: 1, email: 1, status: 1, vehicleDetails: 1 });
        if (!driver) {
            return next(new UnauthorizedError("Invalid email or password"));
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, driver.password);
        if (!isPasswordValid) {
            return next(new UnauthorizedError("Invalid email or password"));
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: driver._id,
                email: driver.email,
                name: driver.name,
                userType: "driver",
                role: "driver",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        // Remove password from response
        const driverData = driver.toObject();
        delete driverData.password;

        return res.status(200).json({
            status: "success",
            data: {
                token,
                driver: driverData,
            },
        });
    } catch (error) {
        next(error);
    }
}
