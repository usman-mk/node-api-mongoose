import express from "express";

import { login, register } from "../controllers/authController";

export default (router: express.Router) => {
    router.post("/register", register);
    router.post("/login", login);
};
