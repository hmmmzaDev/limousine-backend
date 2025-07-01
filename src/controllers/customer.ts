import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "../helpers/apiError";
import { CustomerService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { name, email, password } = req["validData"];
        const existingCustomer = await CustomerService.findOne({
            email,
        });
        if (existingCustomer) {
            return next(new BadRequestError("Email already exists"));
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdCustomer = await CustomerService.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.json({
            status: "success",
            data: createdCustomer.toJSON(),
        });
    } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000 || error.message.includes('duplicate key')) {
            return next(new BadRequestError("Email already exists"));
        }
        return next(new BadRequestError(error.message));
    }
}

export async function findAll(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const data = await CustomerService.findAll({ ...req["validData"] });

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
        const data = await CustomerService.findById(id);

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

        const oldData = await CustomerService.findById(recordId);

        if (!oldData) {
            return next(new NotFoundError("Invalid id"));
        }

        await CustomerService.updateById(recordId, {
            ...otherFields,
        });
        return res.json({
            status: "success",
            data: await CustomerService.findById(recordId),
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
        const oldData = await CustomerService.findById(recordId);

        if (!oldData) {
            return next(new NotFoundError("Invalid id"));
        }

        await CustomerService.deleteById(recordId);
        res.json({
            status: "success",
            data: "Record deleted successfully",
        });
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}

export async function customerLogin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { email, password } = req["validData"];

        // Find customer by email with password field
        const customer = await CustomerService.findOne({ email }, { password: 1, name: 1, email: 1 });
        if (!customer) {
            return next(new UnauthorizedError("Invalid email or password"));
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return next(new UnauthorizedError("Invalid email or password"));
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: customer._id,
                email: customer.email,
                name: customer.name,
                userType: "customer",
                role: "customer",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        // Remove password from response and ensure 'id' field is present
        const customerData = customer.toJSON();

        res.status(200).json({
            status: "success",
            data: {
                token,
                customer: customerData,
            },
        });
    } catch (error) {
        next(error);
    }
}
