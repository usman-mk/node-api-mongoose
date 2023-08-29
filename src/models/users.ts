import mongoose from "mongoose";

import { createSalt, createToken, hashPassword } from "../helpers";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Plese enter username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Plese enter email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Plese enter password"],
        min: 6,
        select: false,
    },
    name: {
        type: String,
        required: [true, "Plese enter name"],
        max: 100,
    },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
});

UserSchema.pre("save", async function (next) {
    try {
        const user = this;
        // encryption password
        const salt = await createSalt();
        const password = await hashPassword(salt, user.password);
        user.salt = salt;
        user.password = password;
        // set token after register
        user.sessionToken = createToken({ id: user._id });
        return next();
    } catch (error) {
        console.log("User => pre: " + error);
    }
});

export const User = mongoose.model("User", UserSchema);

export const getUserAll = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserByUsername = (username: string) =>
    User.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
    User.findOne({ sessionToken });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) => User.create(values);
export const deleteUserById = (id: string) =>
    User.findByIdAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
    User.findByIdAndUpdate(id, values);
