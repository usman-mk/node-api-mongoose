import express from "express";

import { isAuthenticated } from "../middlewares";
import { getAllUsers } from "../controllers/userController";

export default (router: express.Router) => {
    router.get("/user", isAuthenticated, getAllUsers);
};
