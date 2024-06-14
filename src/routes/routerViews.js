import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import transport from "../config/mailing.js";
import { entorno } from "../config/variables.config.js";
import { createHas } from "../utils.js";

class routerViews extends RouterMain {
    init() {
        this.get("/", this.registerForm)
        this.get("/login", this.loginForm)
        this.get("/perfil", this.getProfile)
        this.get("/user", this.getUser)
        this.get("/restablecer", this.restablecer)
        this.post("/searchEmail", this.findUserEmail)
        this.get("/cambiarPassword", this.renderPagePassword)
        this.post("/cambiarPasswordForm", this.renderPagePasswordForm)
        this.get("/newChance", this.newChance)
        this.post("/giveNewChange", this.giveNewChange)
        this.get("/products", this.renderProducts)
        this.get("/changeRoleRender", this.changeRoleRender)
        this.post("/changeRole", this.changeRole)
    }

    registerForm(req, res) {
        res.render("register")
    }

    loginForm(req, res) {
        console.log(req.session.user)
        if (!req.session.user || !req.cookies.user) return res.render("login")

        return res.redirect("/perfil")
    }

    async renderProducts(req, res) {
        try {
            const products = await users.getAll();
            if (!products) return res.send("error");
    
            const productsJSON = JSON.parse(JSON.stringify(products));
    
            res.render("renderProducts", { products: productsJSON });
        } catch (error) {
            console.error("Error al renderizar los productos:", error);
            res.send("Error al renderizar los productos");
        }
    }


    getProfile(req, res) {
        if (req.session.user) {
            return res.render("perfil", { user: req.session.user })
        } else {
            return res.render("perfil", { user: req.cookies.user })
        }

    }

    async getUser(req, res) {

        const result = await req.session.user
        res.json({ succes: result })
    }


    async restablecer(req, res) {

        res.render("restablecer")
    }

    async findUserEmail(req, res) {
        const result = await users.getOne(req.body.email)
        console.log(result, req.body.email)
        const messageAccept = "Succes"
        const messageDenied = "No"
        if (!result) {
            return console.log(messageDenied)
        } else {

            await transport.sendMail({
                from: `Correo de prueba <${entorno.MAIL_USERNAME}/>`,
                to: req.body.email,
                subject: "Correo para restablecer",
                html: `
                    <div>
                        <h1>Cambiar contraseña</h1>
                        <h3><a href="http://localhost:3030/cambiarPassword">Cambiar contraseña</a></h3>
                    </div>
                `
            })

            await res.cookie("Link", "Cambiar password", { maxAge: 3600000  })

            return res.status(200).send(messageAccept);
        }
    }


    renderPagePassword(req, res) {
        if(req.cookies.Link === undefined && req.cookies.LinkTwo === undefined){
            console.log("Cookie 'Link' no está definida, redirigiendo a /newChance");
            return res.redirect("/newChance");
        }
    
        res.render("cambiarPassword");
    }
    async renderPagePasswordForm(req, res) {
        try {

                const obj = {
                    email: req.body.email,
                    password: createHas(req.body.password)
                }
                await users.updateUser(obj);
                return res.redirect("/login");


        } catch (error) {
            res.status(500).send("Error del servidor");
        }
    }

    newChance(req,res){
        res.render("newChance")
    }

    async giveNewChange(req, res) {
        try {
            res.cookie("LinkTwo", "Cambiar password", { maxAge:  3600000 });
            console.log("otro ola");
    
            res.status(200).send("Cookie 'LinkTwo' creada con éxito");
        } catch (error) {
            console.error("Error al crear la nueva cookie:", error);
            res.status(500).send("Error al crear la nueva cookie");
        }
    }


    changeRoleRender(req,res){

        if(!req.cookies.user || !req.session.user) return res.json({error: "Error"})

  
        const user = req.cookies.user
        const userJson = JSON.parse(user)
        console.log(user)
        if(userJson.role === "Premium") {
            return res.render("changeRole", {role: user})
        }else{
            return res.render("changeRole")
        }


    }
    async changeRole(req,res){
        const body = req.body
        const user = req.cookies.user
        const userJson = JSON.parse(user)

        if(body.value === "buttonUsuario"){

            const obj = {
                first_name: userJson.first_name,
                last_name: userJson.last_name,
                email: userJson.email,
                role: "Usuario",
                id: userJson.id
            }

            await users.updateUser(obj)


            res.clearCookie("user")

            res.cookie("user", JSON.stringify(obj), { maxAge: 3600000  })
            return res.redirect("/perfil")

        }else{

            const obj = {
                first_name: userJson.first_name,
                last_name: userJson.last_name,
                email: userJson.email,
                role: "Premium",
                id: userJson.id
            }

            await users.updateUser(obj)


            res.clearCookie("user")

            res.cookie("user", JSON.stringify(obj), { maxAge: 3600000  })
            return res.redirect("/perfil")
        }
    }
    
}


export default new routerViews()