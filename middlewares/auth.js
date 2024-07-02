import jwt from 'jsonwebtoken';

const secret = 'votre_secret_jwt';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: 'Access denied, no token provided' });
        }

        const decodedData = jwt.verify(token, secret);
        req.userId = decodedData?.id;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default auth;
