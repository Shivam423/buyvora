const Product = require('../models/Product')
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(400).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
}
const createProduct = async (req, res) => {
    try {
        // console.log("BODY:", req.body);
        // console.log("FILE:", req.file);
        const { name, description, price, category, stock } = req.body;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct)
    } catch (err) {
        res.status(500).json({ message: err })
    }
}
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id)
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result)
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
    } catch (err) {

    }
}
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}