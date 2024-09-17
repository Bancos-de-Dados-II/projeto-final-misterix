import { Router } from "express";
import User from "../model/mongooseUser.js";
import { generateAccessToken } from "../service/jwtService.js";
import { checkLoginModel } from "../middlewares.js";

const userRouter = new Router();

userRouter.post('/login', checkLoginModel, async (req, res) => {
    const {login, password} = res.locals.user;
    try{
        const user = await User.findOne({login});
        if(user){
            if(password == user.password)
                res.status(200).json(generateAccessToken(login));
            else
                res.sendStatus(403);
        }
        else{
            await User.create({login, password});
            const token = generateAccessToken(login);
            res.status(201).json(token);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default userRouter;