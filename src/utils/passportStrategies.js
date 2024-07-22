import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import usersModel from "../dal/mongoDB/models/users.model.js";

// configurar passport para usar una estrategia con github (para autenticar usuarios con github)
passport.use(
    "Github",
    new GithubStrategy(
        {
            clientID: "Iv23likFRXkt4MgjnCLN",
            clientSecret: "99a331249020a4964ea45db291c1044bc9355fc6",
            callbackURL: "http://localhost:9090/api/users/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await usersModel.findOne({ email: profile._json.email });
            if (user) {
                return done(null, user);
            }
            const newUser = new usersModel({
                email: profile._json.email,
                password: ' ',
                name: profile._json.name,
                age: 0,
            });
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