import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";
import { CustomerStatus } from "../helpers/constants";

interface ICustomer extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    fcmToken?: string;
    status: typeof CustomerStatus[keyof typeof CustomerStatus];
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
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
        fcmToken: {
            type: String,
            required: false,
            default: undefined,
        },
        status: {
            type: String,
            enum: Object.values(CustomerStatus),
            default: CustomerStatus.UNVERIFIED,
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
        collection: "Customer",
        timestamps: true,
    },
);

CustomerSchema.plugin(autopopulate);
CustomerSchema.virtual("id").get(function () {
    return this._id.toString();
});
CustomerSchema.set("toJSON", {
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

const CustomerModel = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default CustomerModel;
