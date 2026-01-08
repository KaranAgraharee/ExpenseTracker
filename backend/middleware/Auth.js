import jwt from "jsonwebtoken";

export const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.Auth_Token;
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
        }
        const userId = req.user._id
        next() 
    } catch (error) {
        return res.status(403).json({
            message: 'unauthorized, JWT token is invalid'
        });
    }
}
 