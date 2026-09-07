const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || !items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data '});
        } else {
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            });
            await order.save();
            await sendEmail(req.user.email, 'Order Created', 'Your order has been created successfully');
            res.status(201).json({ message: 'Order created successfully', order})
        }
    } catch (err) {
        res.status(400).json({ message: err})
    }
}
const myOrders = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user._id}).populate('items.productId', 'name price');
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err})
    }
}
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'id name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders'})
    }
}
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let order = await Order.findById(req.params.id);
        if(order) {
            order.status = status;
            await order.save();
            res.status(201).send({ message:'status of order is changed', order })
        }
    } catch (err) {
        res.status(400).json({ message: err})
    }
}


module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
}