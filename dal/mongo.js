const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const categorySchema = require('../models/category.mode');
const productSchema = require('../models/product.model');
const userSchema = require('../models/user.model');
const cartSchema = require('../models/cart.model');
const orderSchema = require('../models/order.model');
const Category = mongoose.model('categories', categorySchema);
const Product = mongoose.model('products', productSchema);
const User = mongoose.model('users', userSchema);
const Cart = mongoose.model('carts', cartSchema);
const Order = mongoose.model('orders', orderSchema);

const errorHandler = (err, res, cb) => {
    if (err) {
        return res.json(err);
    }
    return cb();
}
const successHandler = (req, data, next) => {
    req.data = data;
    return next();
}

const fetchProducts = (req, res, next) => Product.find({}).populate('category').exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const fetchCategory = (req, res, next) => Category.find({}, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const fetchAllCarts = (req, res, next) => Cart.find({}).populate('client').exec((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const fetchUserCart = (req, res, next) => Cart.find({ client: { _id: req.params.id } }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const fetchUserOrder = (req, res, next) => Order.find({ client: { _id: req.params.id } }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const countProducts = (req, res, next) => Product.count({}, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const countOrders = (req, res, next) => Order.count({}, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const addToCart = (req, res, next) => Cart.update({ _id: req.params.id }, { $push: { products: req.body } }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const removeFromCart = (req, res, next) => Cart.update({ _id: req.params.id }, { $pull: { products: req.body } }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const removeAllProducts = (req, res, next) => Cart.update({ _id: req.params.id }, { $pull: { products: { $exists: true } } }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const editProduct = (req, res, next) => Product.update({ _id: req.params.id }, { name: req.body.name, price: req.body.price, img: req.body.img }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
const deleteCart = (req, res, next) => Cart.remove({ _id: req.params.id }, (err, data) => errorHandler(err, res, () => successHandler(req, data, next)));

const startCart = (req, res, next) => {
    const newCart = new Cart(req.body);
    newCart.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
};

const addProduct = (req, res, next) => {
    const newProduct = new Product(req.body);
    newProduct.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
};

let receiptNumber = 1000;
const newOrder = (req, res, next) => {
    const newOrder = new Order(req.body);
    let productArr = [];
    for (let item of newOrder.products) {
        productArr.push(item.name + ':' + item.quantity + 'pcs' + "\r\n");
    }
    receiptNumber++
    const orderFile = {
        orderId: newOrder._id,
        products: productArr,
        price: newOrder.totalprice,
        receipt: receiptNumber
    }
    let orderDetails = `Receipt number: ${orderFile.receipt} \n Products: \n ${orderFile.products} \n  Price is : ${orderFile.price}`;
    fs.writeFile(`orders/${orderFile.orderId}.txt`, orderDetails, 'utf-8', err => {
        if (err) {
            return console.log(err);
        }
    });
    newOrder.save((err, data) => errorHandler(err, res, () => successHandler(req, data, next)));
};

const fetchOrderFile = (req, res, next) => {
    let orderId = req.params.id;
    let receiptPath = path.join(__dirname, `../orders`, `${orderId}.txt`);
    let fileName = 'shop receipt.txt';
    fs.readFile(receiptPath, err => {
        if (err) throw err;
        if (!err) {
            res.download(receiptPath, fileName);
        }
    });
}

const checkShipDate = (req, res, next) => {
    const { deliverydate } = req.body;
    Order.count({ deliverydate }, (err, data) => {
        if (data !== 3) {
            return res.json({ message: 'valid' });
        } else {
            return res.json({ message: 'invalid' })
        }
    });
}

const checkUserId = (req, res) => {
    const { id } = req.body;
    User.find({ id }, (err, user) => {
        if (user.length > 0) {
            return res.json({ message: 'Invalid' });
        } else {
            return res.json({ message: 'Valid' })
        }
    });
}

const uploadImage = (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    const sampleFile = req.files.sampleFile;
    fs.writeFile(path.join(__dirname, `../public/upload/`, sampleFile.name), sampleFile.data, (err) => res.json({ err }));
}



module.exports = {
    fetchProducts,
    fetchCategory,
    fetchAllCarts,
    fetchUserCart,
    fetchUserOrder,
    countProducts,
    countOrders,
    addProduct,
    newOrder,
    uploadImage,
    editProduct,
    checkUserId,
    startCart,
    addToCart,
    removeFromCart,
    removeAllProducts,
    deleteCart,
    fetchOrderFile,
    checkShipDate
};
