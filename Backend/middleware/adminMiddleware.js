const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(400).send({ message: 'Access denied admin only'});
    }
}

module.exports = {
    admin
}