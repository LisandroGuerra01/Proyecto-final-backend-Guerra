import { verifyToken } from "../utils/jwt.utils.js";
import usersService from "../services/users.service.js";


//Verificar usuarios logueados
export const verifyTokenAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Verificar usuario logueado que es admin o premium
export const verifyTokenAdminPremium = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json("Unauthorized")
        }
        if (decoded.role !== "admin" && decoded.role !== "premium") {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Verificar usuario logueado que es admin
export const verifyTokenAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json("Unauthorized")
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json("Unauthorized")
        }
        if (decoded.role !== "admin") {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Verificar usuario logueado que es user
export const verifyTokenUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json("Unauthorized")
        }
        if (decoded.role == "admin") {
            return res.status(403).json("Forbidden")
        }
        req.user = decoded;
        const userCart = await usersService.findByCartId(req.params.cid);

        if (userCart[0]._id.toString() !== decoded.id) {
            return res.status(403).json("Forbidden")
        }
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Middleware para verificar si el usuario está logueado
export const isLogged = async (req, res, next) => {
    try {
        if (req.session.passport?.user) {
            res.redirect('/profile');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}