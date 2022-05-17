import { Model } from 'mongoose';
import { IUserModel } from './user';

// The application's main DB model
export interface IModel {
    user: Model<IUserModel>;
}
