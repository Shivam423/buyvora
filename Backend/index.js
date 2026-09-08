// Use reliable public DNS for MongoDB Atlas SRV resolution
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
connectDB()
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))


app.get('/', (req, res) => {
    res.send('Buyvora Backend is working properly')
})
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port no ${port}`)
})