import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";
import { BookingStatus } from "../helpers/constants";

interface ILocation {
    longitude: number;
    latitude: number;
    locationName: string;
}

interface IStop {
    longitude: number;
    latitude: number;
    locationName: string;
}

interface IBooking extends Document {
    id: string;
    customerId: Schema.Types.ObjectId;
    driverId?: Schema.Types.ObjectId;
    paymentId?: Schema.Types.ObjectId;
    startLocation: ILocation;
    finalLocation: ILocation;
    stops: IStop[];
    numberOfPassengers: number;
    numberOfLuggage: number;
    note?: string;
    contactInfo: string;
    rideTime: Date;
    finalPrice?: number;
    rejectionReason?: string;
    status: typeof BookingStatus[keyof typeof BookingStatus];
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
}, { _id: false });

const StopSchema = new Schema<IStop>({
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
}, { _id: false });

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
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            autopopulate: true,
            default: null,
        },
        startLocation: {
            type: LocationSchema,
            required: true,
        },
        finalLocation: {
            type: LocationSchema,
            required: true,
        },
        stops: {
            type: [StopSchema],
            default: [],
        },
        numberOfPassengers: {
            type: Number,
            required: true,
            min: 1,
        },
        numberOfLuggage: {
            type: Number,
            required: true,
            min: 0,
        },
        note: {
            type: String,
            default: null,
        },
        contactInfo: {
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
        rejectionReason: {
            type: String,
            default: null,
            maxlength: 40,
        },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING,
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
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
export default BookingModel;
