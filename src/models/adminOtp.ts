import mongoose, { Document, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

interface IAdminOtp extends Document {
    otp: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminOtpSchema = new Schema<IAdminOtp>({
    otp: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    collection: 'AdminOtps',
    timestamps: true,
});

AdminOtpSchema.plugin(autopopulate);

AdminOtpSchema.virtual('id').get(function () {
    return this._id.toString();
});
AdminOtpSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        return ret;
    }
});

const AdminOtpModel = mongoose.model<IAdminOtp>('AdminOtp', AdminOtpSchema);

export default AdminOtpModel;
