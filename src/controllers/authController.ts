import express from "express";

import { createUser, getUserByEmail, getUserByUsername, updateUserById } from "../models/users";
import { comparePassword, createToken, messageError } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        let messages = [];
        const { email, password, username, name } = req.body;

        const existEmail = await getUserByEmail(email);
        if (existEmail) {
            messages.push(
                messageError("email", "Duplicate email", "unique", email)
            );
        }
        const existUsername = await getUserByUsername(username);
        if (existUsername) {
            messages.push(
                messageError(
                    "username",
                    "Duplicate username",
                    "unique",
                    username
                )
            );
        }

        if (messages.length > 0) {
            return res.status(400).json(messages);
        }

        const user = await createUser({
            email,
            username,
            password,
            name,
        });

        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        if (error) {
            return res.status(400).json(error.errors);
        }
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email).select("+password");
        if (!user)
            return res.status(400).json({ message: "User does not exist." });

        const compare = await comparePassword(password, user.password);
        if (!compare)
            return res.status(403).json({ message: "Invalid credentials." });

        const token = createToken({ id: user._id });
        // set token after login
        await updateUserById(user._id.toString(), {sessionToken: token});

        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        if (error) {
            return res.status(400).json(error.errors);
        }
        return res.status(500).json({ error: error.message });
    }
};
