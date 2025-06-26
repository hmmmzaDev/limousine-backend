import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { NotificationService } from "../services";

export async function addRecord(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const data = await NotificationService.create({
      ...req["validData"],
    });
    return res.json({
      status: "success",
      data,
    });
  } catch (error) {
    return next(new BadRequestError("Something went wrong", error));
  }
}

export async function updateRecord(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { recordId, ...otherFields } = req["validData"];

    const oldData = await NotificationService.findById(recordId);

    if (!oldData) {
      return next(new NotFoundError("Invalid id"));
    }

    await NotificationService.updateById(recordId, {
      ...otherFields,
    });
    return res.json({
      status: "success",
      data: await NotificationService.findById(recordId),
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
    const data = await NotificationService.findById(id);

    return res.json({ status: "success", data });
  } catch (error) {
    return next(new NotFoundError("No Record Found", error));
  }
}

export async function findOne(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const data = await NotificationService.findOne({ ...req["validData"] });

    return res.json({ status: "success", data });
  } catch (error) {
    return next(new NotFoundError("No Record Found", error));
  }
}

export async function findAll(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const data = await NotificationService.findAll({ ...req["validData"] });

    return res.json({ status: "success", data });
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
    const oldData = await NotificationService.findById(recordId);

    if (!oldData) {
      return next(new NotFoundError("Invalid id"));
    }
    await NotificationService.deleteById(recordId);

    return res.json({ status: "success", data: "Record deleted successfully" });
  } catch (error) {
    return next(new NotFoundError("No Record Found", error));
  }
}
