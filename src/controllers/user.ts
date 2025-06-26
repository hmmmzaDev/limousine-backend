import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../helpers/apiError";
import { UserService } from "../services";
import bcrypt from "bcrypt";

export async function addRecord(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { password, email } = req["validData"];
    const oldData = await UserService.findOne({
      $or: [{ email }],
    });
    if (oldData) {
      return next(new BadRequestError("Email already exists"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const data = await UserService.create({
      ...req["validData"],
      password: hash,
    });
    return res.json({
      status: "success",
      data,
    });
  } catch (error) {
    // return next(new BadRequestError("Something went wrong", error));
    return next(new BadRequestError(error.message));
  }
}

export async function loginUser(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { email, password } = req["validData"];
    const data = await UserService.findOne(
      { email, role: "user" },
      {
        "+password": 1,
      },
    );
    if (!data) {
      return next(new NotFoundError("Incorrect email"));
    }
    if (!bcrypt.compareSync(password, data.password)) {
      return next(new BadRequestError("Invalid Password"));
    }
    return res.json({
      status: "success",
      data,
    });
  } catch (error) {
    return next(new InternalServerError(error.message, error));
  }
}

export async function loginAdmin(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { email, password } = req["validData"];
    const data = await UserService.findOne(
      { email, role: "admin" },
      {
        "+password": 1,
      },
    );
    if (!data) {
      return next(new NotFoundError("Incorrect email"));
    }
    if (!bcrypt.compareSync(password, data.password)) {
      return next(new BadRequestError("Invalid Password"));
    }
    return res.json({
      status: "success",
      data,
    });
  } catch (error) {
    return next(new InternalServerError(error.message, error));
  }
}

export async function updateRecord(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { recordId, ...otherFields } = req["validData"];

    const oldData = await UserService.findById(recordId);

    if (!oldData) {
      return next(new NotFoundError("Invalid id"));
    }

    await UserService.updateById(recordId, {
      ...otherFields,
    });
    return res.json({
      status: "success",
      data: await UserService.findById(recordId),
    });
  } catch (error) {
    return next(new NotFoundError("No Record Found", error));
  }
}

export async function updatePassword(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { newPassword, recordId } = req["validData"];

    const oldData = await UserService.findById(recordId);

    if (!oldData) {
      return next(new NotFoundError("Invalid id"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    await UserService.updateById(recordId, {
      password: hash,
    });
    return res.json({
      status: "success",
      data: await UserService.findById(recordId),
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
    const data = await UserService.findById(id);

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
    const data = await UserService.findOne({ ...req["validData"] });

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
    const data = await UserService.findAll({ ...req["validData"] });

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
    const oldData = await UserService.findById(recordId);

    if (!oldData) {
      return next(new NotFoundError("Invalid id"));
    }
    await UserService.deleteById(recordId);

    return res.json({ status: "success", data: "Record deleted successfully" });
  } catch (error) {
    return next(new NotFoundError("No Record Found", error));
  }
}


