const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Please Login!" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: "No User Exist!!" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({ message: "ERROR: " + err.message });
    }
};

module.exports = auth;
