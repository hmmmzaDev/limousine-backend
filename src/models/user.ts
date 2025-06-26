import mongoose, { Schema, Document } from "mongoose";
import autopopulate from "mongoose-autopopulate";

interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  name: string;
  phone: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
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
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    currentLocation: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      lastUpdated: {
        type: Date,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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
    collection: "User",
    timestamps: true,
  },
);

UserSchema.plugin(autopopulate);
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
