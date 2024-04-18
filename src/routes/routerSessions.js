import { Router } from "express";
import passport from "passport";

const sessionsRouter = Router()

sessionsRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }),
    async (req, res) => {
        console.log(req.user)
        res.status(201).send({ status: "succes", message: "Usuario registrado" })
    }
)

sessionsRouter.get("/failregister", async (req, res) => {
    console.log("error")
    res.send({ error: "Fallo" })
})


sessionsRouter.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/faillogin" }),
    async (req, res) => {
        if (!req.user) return res.status(400).send("error");


        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
        };
        res.status(200).send({ status: "success", payload: req.user });
    }
);


sessionsRouter.get("/faillogin", async (req, res) => {
    console.log("error");
    res.send({ error: "Fallo" });
});



sessionsRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {
        //podemos enviar una respuesta
    }
);
//ruta que nos lleva a github login
sessionsRouter.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        if(req.user){
            req.user = null
        }

        req.session.user = req.user;
        //console.log(req.session.user)
        res.redirect("/"); //ruta a la que redirigimos luego de iniciar sesión
    }
);
export default sessionsRouter