
import mongoose = require('mongoose'); // import mongoose

import { IModel } from './models/model'; // import IModel
import { IUserModel } from './models/user'; // import IUserModel
import { userSchema } from './schemas/user'; // import userSchema

const model: IModel = { user: null }; // an instance of IModel

const MONGODB_CONNECTION = 'mongodb://weserver:27017/GuildUsers';
const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

model.user = connection.model<IUserModel>('User', userSchema);

export default model;
