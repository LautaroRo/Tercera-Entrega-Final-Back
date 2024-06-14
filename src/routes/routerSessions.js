import RouterMain from "./RouterMain.js";
import passport from "passport";


class routeUsers extends RouterMain{
    init(){
        this.get("/Profile", this.traerUsuarios)
        this.post('/register', passport.authenticate('register', { 
            failureRedirect: '/failRegister'
        }), (req, res) => {
            try{

                res.json({status: "succes"})

            }catch(error){
                res.json({status: error})
            }
        });
        

        
        this.post('/login', passport.authenticate('login'), (req, res) => {
            try{
                const objeto = {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    role: req.user.role,
                    id: req.user._id
                };

                req.session.user = objeto

                res.cookie('user', JSON.stringify(objeto), { maxAge: 3600000  });

                res.send("Login exitoso"); 

            }catch{
                res.send("No se logro")
            }
        });
    }


    async traerUsuarios(req,res){
        const nombreUsuario = req.session.user.first_name;
        res.send(`Hola, ${nombreUsuario}!`);
    }

}

export default new routeUsers()