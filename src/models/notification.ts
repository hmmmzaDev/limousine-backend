import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface INotification extends Document {
  id: string;
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: "task_assigned" | "location_error" | "payment_processed" | "system";
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["task_assigned", "location_error", "payment_processed", "system"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Notification",
    timestamps: true,
  },
);

NotificationSchema.plugin(autopopulate);
NotificationSchema.virtual("id").get(function () {
  return this._id.toString();
});
NotificationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
export default NotificationModel;
