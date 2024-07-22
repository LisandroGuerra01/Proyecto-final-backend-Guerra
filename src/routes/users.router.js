import usersController from "../controllers/users.controller.js";
import { Router } from "express";
import { verifyTokenAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import passport from "passport";

const router = Router();



//Endpoint para logear un usuario con github strategy
router.get('/github', passport.authenticate('Github', { scope: ['user:email'] }));

//Endpoint para callback de github strategy
router.get('/github/callback', passport.authenticate('Github', {
    successRedirect: '/products',
    failureRedirect: '/errorRegister',
}), (req, res) => {
    req.session.email = req.user.email;
    req.session.logged = true;
    req.session.userId = req.user._id;
    req.session.isAdmin = false;
    req.session.role = req.user.role;
    res.redirect('/profile');
});

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUsersById);
router.post("/", usersController.createUsers);
router.put("/:id", usersController.updateUsers);
router.post("/update-role", usersController.updateRoleUsers);
router.post("/delete-admin", usersController.deleteUsersByAdmin); //hacer que ande
router.delete("/inactive", usersController.deleteUsersInactive);
router.delete("/soft/:id", usersController.deleteSoftUsers);
router.post("/login", usersController.loginUsers);
router.post("/logout", usersController.logoutUsers);
router.post("/current", verifyTokenAuth, usersController.currentUsers);
router.post("/forgot-password", usersController.forgotPasswordUsers);
router.get("/reset-password/:token", usersController.validateResetPasswordToken);
router.post("/reset-password", usersController.resetPasswordUsers);
router.post('/premium/:uid', upload.fields([
    { name: 'document', maxCount: 3 }
]), usersController.premiumUserRole);

// Endpoint para subir documentos con Multer
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 10 },
    { name: 'document', maxCount: 10 }
]), usersController.uploadDocuments);

export default router;