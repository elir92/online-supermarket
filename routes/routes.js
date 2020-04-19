const express = require('express');
const appRouter = express.Router();
const mongoQuery = require('../dal/mongo');

appRouter.get('/user', (req, res) => res.json({ user: req.session.passport.user }));
appRouter.get('/carts', mongoQuery.fetchAllCarts, (req, res) => { return res.json(req.data) });
appRouter.get('/usercart/:id', mongoQuery.fetchUserCart, (req, res) => { return res.json(req.data) });
appRouter.get('/product', mongoQuery.fetchProducts, (req, res) => { return res.json(req.data) });
appRouter.get('/category', mongoQuery.fetchCategory, (req, res) => { return res.json(req.data) });
appRouter.get('/countproducts', mongoQuery.countProducts, (req, res) => { return res.json(req.data) });
appRouter.get('/countorders', mongoQuery.countOrders, (req, res) => { return res.json(req.data) });
appRouter.get('/clientorder/:id', mongoQuery.fetchUserOrder, (req, res) => { return res.json(req.data) });
appRouter.get('/orderfile/:id', mongoQuery.fetchOrderFile, (req, res) => { return res.json(req.data) });
appRouter.post('/shipdate', mongoQuery.checkShipDate, (req, res) => { return res.json(req.data) });
appRouter.post('/upload', mongoQuery.uploadImage);
appRouter.put('/startcart', mongoQuery.startCart, (req, res) => { return res.json(req.data) });
appRouter.put('/newproduct', mongoQuery.addProduct, (req, res) => { return res.json(req.data) });
appRouter.put('/neworder', mongoQuery.newOrder, (req, res) => { return res.json(req.data) });
appRouter.patch('/addproduct/:id', mongoQuery.addToCart, (req, res) => { return res.json({ success: true }) });
appRouter.patch('/editproduct/:id', mongoQuery.editProduct, (req, res) => { return res.json({ success: true }) });
appRouter.patch('/removeproduct/:id', mongoQuery.removeFromCart, (req, res) => { return res.json({ success: true }) });
appRouter.patch('/removeallpr/:id', mongoQuery.removeAllProducts, (req, res) => { return res.json({ success: true }) });
appRouter.delete('/deletecart/:id', mongoQuery.deleteCart, (req, res) => { return res.json({ success: true }) });


module.exports = appRouter;
