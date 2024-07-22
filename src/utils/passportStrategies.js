import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import usersModel from "../dal/mongoDB/models/users.model.js";
import config from "../config/config.js";

// configurar passport para usar una estrategia con github (para autenticar usuarios con github)
passport.use(
    "Github",
    new GithubStrategy(
        {
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await usersModel.findOne({ email: profile._json.email });
            console.log("user; ",user);
            console.log("profile", profile);
            if (user) {
                return done(null, user);
            }
            const newUser = new usersModel({
                name: profile._json.name,
                email: profile._json.email,
                password: "",
                age: 20
            });
            console.log("newuser; ",newUser);
            await newUser.save();
            return done(null, newUser);
        }
    )
);

// serializar el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// deserializar el usuario para obtenerlo de la sesión
passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
});