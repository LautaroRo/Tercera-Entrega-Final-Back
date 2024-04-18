import passport from "passport";
import local from "passport-local"
import userModel from "../models/usersModels.js";
import GitHubStrategy from "passport-github2";
import { createHas, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {

                const { first_name, last_name, role, number, age, email } = req.body

                try {

                    const user = await userModel.findOne({ email: username });

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

                    const result = await userModel.create(newUser)

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
                    const user = await userModel.findOne({ email: username })
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

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.c4d255aee7c5f460",
                clientSecret: "0f22f2ca40009fec679b410bc8d4a8b5a62433c7",
                callbackURL: "http://localhost:4000/api/sessions/githubcallback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {

                    const user = await userModel.findOne({
                        email: profile._json.email,
                    });
                    if (!user) {

                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 20,
                            email: profile._json.email,
                            password: "",
                        };

                        let createdUser = await userModel.create(newUser);
                        done(null, createdUser);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id)

            done(null, user)
        }

        catch (error) {

            done(error)
        }
    })
}

export default initializePassport