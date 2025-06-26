import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../helpers/apiError";
import { CustomerService } from "../services";

export async function signup(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { name, email } = req["validData"];
        const existingCustomer = await CustomerService.findOne({
            email,
        });
        if (existingCustomer) {
            return next(new BadRequestError("Email already exists"));
        }
        const data = await CustomerService.create({
            name,
            email,
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
        return res.json({
            status: "success",
            data: "Record deleted successfully",
        });
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}
