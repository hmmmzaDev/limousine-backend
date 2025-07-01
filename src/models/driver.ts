import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface IDriver extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    vehicleDetails: {
        model: string;
        licensePlate: string;
    };
    status: "available" | "on_trip" | "offline";
    createdAt: Date;
    updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        vehicleDetails: {
            model: {
                type: String,
                required: true,
            },
            licensePlate: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["available", "on_trip", "offline"],
            default: "available",
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
        collection: "Driver",
        timestamps: true,
    },
);

DriverSchema.plugin(autopopulate);
DriverSchema.virtual("id").get(function () {
    return this._id.toString();
});
DriverSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Explicitly remove password from JSON output
        return ret;
    },
});

const DriverModel = mongoose.model<IDriver>("Driver", DriverSchema);
export default DriverModel;
