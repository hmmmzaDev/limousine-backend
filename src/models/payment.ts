import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface IPayment extends Document {
    id: string;
    customerId: Schema.Types.ObjectId;
    paymentIntentId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    stripeChargeId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            autopopulate: true,
            required: true,
        },
        paymentIntentId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "USD",
            uppercase: true,
        },
        paymentMethod: {
            type: String,
            default: null,
        },
        stripeChargeId: {
            type: String,
            default: null,
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
        collection: "Payment",
        timestamps: true,
    },
);

PaymentSchema.plugin(autopopulate);
PaymentSchema.virtual("id").get(function () {
    return this._id.toString();
});
PaymentSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export default PaymentModel;