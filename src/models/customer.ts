import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface ICustomer extends Document {
    id: string;
    name: string;
    email: string;
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
        delete ret._id;
        return ret;
    },
});

const CustomerModel = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default CustomerModel;
