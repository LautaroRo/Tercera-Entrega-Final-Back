import RouterMain from "./RouterMain.js";


class routerViews extends RouterMain{
    init(){
        this.get("/", this.registerForm)
        this.get("/login", this.loginForm)
        this.get("/profile", this.getProfile)
        this.get("/user", this.getUser)
    }

    registerForm(req,res){
        res.render("register")
    }

    loginForm(req,res){
        console.log(req.session.user)
        if(!req.session.user)return res.render("login")

            return res.redirect("/profile")
    }

    getProfile(req,res){
        res.render("profile", {user: req.session.user})
    }

    async getUser(req,res){

        const result = await req.session.user

        res.json({succes: result})
    }
}


export default new routerViews()