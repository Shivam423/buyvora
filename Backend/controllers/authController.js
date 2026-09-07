const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'}) 
}

// Register a new User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
           return res.status(400).send({ message: "User already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        if(user){
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Welcome to Buyvora, ${name}! Thank you for registering with us. We are excited Your OTP for Buyvora registration is: ${otp}`
            await sendEmail(email, 'Welcome to Buyvora - Your OTP for Registration', message);
            res.status(201).json({ 
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
        }
       
    } catch (err) {
        res.status(400).json({ message: err})
    }
}

//Login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({ email })
        if(user && (await bcrypt.compare(password, user.password))){
             res.json({ 
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({ message: 'Invalid email or password'})
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error'})
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error'})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers
}