// verify from db whether user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if () {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}
