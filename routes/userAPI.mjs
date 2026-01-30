import express from "express"
import user from "../dataObjects/user.mjs";
import { generateID } from "../dataObjects/user.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/", (req, res, next) => {

    let newUser = user();
    newUser.id = generateID();



    //res.json(JSON.stringify(newUser));
    
     res.status(201).json(newUser);
});

export default userRouter;