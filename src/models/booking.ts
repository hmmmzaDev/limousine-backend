import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface IBooking extends Document {
    id: string;
    customerId: Schema.Types.ObjectId;
    driverId?: Schema.Types.ObjectId;
    pickupLocation: string;
    dropoffLocation: string;
    rideTime: Date;
    finalPrice?: number;
    status: "Pending" | "Awaiting-Acceptance" | "Assigned" | "En-Route" | "Completed" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            autopopulate: true,
            required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            autopopulate: true,
            default: null,
        },
        pickupLocation: {
            type: String,
            required: true,
        },
        dropoffLocation: {
            type: String,
            required: true,
        },
        rideTime: {
            type: Date,
            required: true,
        },
        finalPrice: {
            type: Number,
            default: null,
        },
        status: {
            type: String,
            enum: [
                "Pending",             // Customer has submitted, waiting for admin
                "Awaiting-Acceptance", // Admin has set a price, waiting for customer
                "Assigned",            // Customer has accepted, waiting for driver
                "En-Route",            // Driver is on the way
                "Completed",           // Ride finished
                "Cancelled"            // Ride cancelled by customer
            ],
            default: "Pending",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "Booking",
        timestamps: true,
    },
);

BookingSchema.plugin(autopopulate);
BookingSchema.virtual("id").get(function () {
    return this._id.toString();
});
BookingSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        return ret;
    },
});

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
export default BookingModel;
