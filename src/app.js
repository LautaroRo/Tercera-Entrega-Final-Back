import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import handlebars from "express-handlebars"
import _dirnamee from "./utils.js"
import passport from "passport"
import nodemailer from "nodemailer"
import initializePassport from "./config/passportConfig.js"
import routerSessions from "./routes/routerSessions.js"
import { entorno } from "./config/variables.config.js"
import routerViews from "./routes/routerViews.js"
import routerProducts from "./routes/routerProducts.js"
import routerCart from "./routes/routerCart.js"
import { Server } from "socket.io"
import { users } from "./dao/factory.js"


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(_dirnamee + "/public"))

app.use(
    session({
        store: new MongoStore({
            mongoUrl: entorno.MONGOURL,
            ttl:3600
        }),
        secret: entorno.SECRETO,
        resave: false,
        saveUninitialized: false
    })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




app.engine("handlebars", handlebars.engine())
app.set("views", _dirnamee + "/views")
app.set("view engine", "handlebars")

app.use("/", routerViews.getRouter())
app.use("/api/sessions", routerSessions.getRouter())
app.use("/api/products", routerProducts.getRouter())
app.use("/api/cart", routerCart.getRouter())

const servidor = app.listen( entorno.PORT, console.log("Corriendo"))

const io = new Server(servidor)
const msg = []
io.on("connection", socket => {

    socket.on("message", (data) => {
        msg.push(data)
        users.createMessage(data)
        io.emit("messageLogs", msg)

    })

})