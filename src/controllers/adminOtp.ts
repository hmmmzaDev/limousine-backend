import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/apiError";
import { AdminOtpService } from "../services";
import sendMail from "../helpers/sendMail";
import jwt from "jsonwebtoken";
import { generateRandomString } from "../helpers/functions";

export async function sendOtp(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    // make 8 digit otp
    const otp = Math.floor(10000000 + Math.random() * 90000000);
    const oldData = await AdminOtpService.findOne({});
    if (!oldData) {
      await AdminOtpService.create({
        otp: String(otp),
      });
    } else {
      await AdminOtpService.updateByFilter({}, { otp: String(otp) }, {});
    }
    await sendMail({
      email: "test.hmmmzadev@gmail.com",
      subject: "OTP",
      message: `Your OTP is ${otp}`,
    });
    return res.json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error) {
    return next(new BadRequestError("Something went wrong", error));
  }
}

export async function verifyOtp(
  req: Request,
  res: Response | any,
  next: NextFunction,
) {
  try {
    const { otp } = req["validData"];

    const data = await AdminOtpService.findOne({ otp });

    if (!data) {
      return next(new UnauthorizedError("Invalid OTP"));
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return next(new BadRequestError("JWT secret is not configured"));
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        userId: "admin",
        email: "admin@limousine.com",
        name: "Admin",
        userType: "admin",
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Delete the used OTP for security
    // await AdminOtpService.deleteByQuery({ otp });

    return res.json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (error) {
    return next(new InternalServerError(error.message, error));
  }
}
