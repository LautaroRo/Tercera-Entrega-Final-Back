import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import userModel from "../models/usersModels.js";

const usersRouter = Router()

usersRouter.get("/register", (req,res) => {
    console.log(req.session)
    res.render("register")
})

usersRouter.get("/", auth, async(req,res) => {

    const result = await userModel.findById(req.session.passport.user)
    console.log(result)
    res.render("profile", {
        first_name: result.first_name,
        email: result.email,
        age: result.age
    });
})


usersRouter.get("/login", (req, res) => {

    res.render("login");
});
export default usersRouter