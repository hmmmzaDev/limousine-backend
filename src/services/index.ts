import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

// import the user and notification models
import UserModel from "../models/user";
import NotificationModel from "../models/notification";

function main<T extends Document>(Model: Model<T>) {
  function count(filter: FilterQuery<T> = {}) {
    return Model.countDocuments(filter).exec();
  }

  function findAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}) {
    return Model.find(filter, null, options).exec();
  }

  async function findOne(
    filter: FilterQuery<T>,
    projection: Partial<Record<keyof T, 0 | 1>> | { [key: string]: 0 | 1 } = {},
    options: QueryOptions = {},
  ) {
    return Model.findOne(filter, projection, options).exec();
  }

  function create(data: Partial<T>) {
    return new Model(data).save();
  }

  function createMany<T extends Document>(data: Partial<T>[]): Promise<any> {
    return Model.insertMany(data);
  }

  function findByQuery(
    filter: FilterQuery<T>,
    projection: any = {},
    options: QueryOptions = {},
  ) {
    return Model.find(filter, projection, options).exec();
  }

  function findById(
    id: string,
    projection: any = {},
    options: QueryOptions = {},
  ) {
    return Model.findById(id, projection, options);
  }

  function updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true },
  ) {
    return Model.findByIdAndUpdate(id, update, options).exec();
  }

  function updateByFilter(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options,
  ) {
    return Model.updateOne(filter, update, options).exec();
  }

  function deleteById(id: string, options: QueryOptions = {}) {
    return Model.findByIdAndDelete(id, options).exec();
  }

  function deleteByQuery(filter: FilterQuery<T>, options = {}) {
    return Model.deleteOne(filter, options).exec();
  }

  return {
    findAll,
    findOne,
    create,
    findByQuery,
    findById,
    updateById,
    updateByFilter,
    deleteByQuery,
    deleteById,
    count,
    createMany,
  };
}

export const UserService = main(UserModel);
export const NotificationService = main(NotificationModel);
