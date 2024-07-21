import { Router } from "express";
import userService from "../services/users.service.js"
import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";
import { verifyTokenAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//Endpoint para chat
router.get('/chat', (req, res) => {
    res.render("chat", {
        title: "Chat",
        StyleSheet: "chat.css"
    })
})

//Endpoint para login de usuario
router.get('/login', (req, res) => {
    res.render("login")
})

//Endpoint para ver el perfil de usuario
router.get("/profile", async (req, res) => {
    res.render("profile");
});

//Endpoint para modificar roles de usuarios y eliminar usuarios, solo accesible para admin
router.get('/modify', verifyTokenAdmin, async (req, res) => {
    const users = await userService.findAllConId()
    res.render("modify", {
        users
    });
});

//Endpoint para ver todos los productos si se está logueado
router.get('/products', async (req, res) => {
    const products = await productsService.findAll();
    const { _id, name, description, price, stock, category } = products
    const uid = await userService.findAllConId();
    const { cart } = uid
    console.log(cart);
    res.render("products", {
        products,
        _id,
        name,
        description,
        price,
        stock,
        category,
    })
})

//Endpoint para visualizar el carrito de compras
router.get('/carts/:id', async (req, res) => {
    const cart = await cartsService.findById(req.params.id);
    const { products } = cart;
    res.render("cart", {
        products,
        pid: products.pid,
        quantity: products.quantity
    })
})

//Endpoint para ver mensaje de compra exitosa
router.get('/purchase', async (req, res) => {
    const purchase = await cartsService.purchase()
    console.log(purchase);
    res.render("purchase")
})




export default router;