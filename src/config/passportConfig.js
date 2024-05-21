import passport from "passport";
import local from "passport-local"
import { createHas, isValidPassword } from "../utils.js";
import { users } from "../dao/factory.js";
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {

                const { first_name, last_name, role, number, age, email } = req.body

                try {

                    const user = await users.getOne(username);
                    console.log(user)
                    if (user) {
                        console.log("ya existe")
                        return done(null, false)
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        role,
                        number,
                        age,
                        email,
                        password: createHas(password)
                    }

                    req.session.user = {
                        first_name: first_name,
                        last_name: last_name,
                        age: age,
                        email: email
                    };

                    const result = await users.createUser(newUser)

                    return done(null, result)
                } catch (error) {
                    return done(error)
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy({ usernameField: "email" },

            async (username, password, done) => {


                try {
                    const user = await users.getOne(username);
                    if (!user) return done(null, false);
                    const valid = isValidPassword(user, password);
                    if (!valid) return done(null, false);

                    return done(null, user);
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await users.getUserById(id)

            done(null, user)
        }

        catch (error) {

            done(error)
        }
    })
}

export default initializePassport