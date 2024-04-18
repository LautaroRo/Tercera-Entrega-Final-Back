import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import _dirnamee from "./utils.js"
import passport from "passport"
import initializePassport from "./config/passportConfig.js"
import usersRouter from "./routes/usersRouter.js"
import sessionsRouter from "./routes/routerSessions.js"

const app = express()



const DBURL =
"mongodb+srv://Lautaro:Ors6E5ixvF0N1pVh@cluster0.beeo5kk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(DBURL); 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(_dirnamee + "/public"))

app.use(
    session({
        store: new MongoStore({
            mongoUrl: DBURL,
            ttl:3600
        }),
        secret: "Secret",
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

app.use("/", usersRouter)
app.use("/api/sessions", sessionsRouter)

app.listen( 4000, console.log("Corriendo"))