import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Organization from '../models/organisation.model.js';

const isAdmin = async (req, res, next) => {

    try {
        // console.log("|Middleware|----> Admin");
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ error: "Unauthorised - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ error: "Unauthorised - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        const organizationId = user.currentOrganization;
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found or You are not part of this organization.' });
        }

        const isAdmin = organization.admin.includes(decoded.userId);

        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied. Not an admin.' });
        }

        req.user = user;
        req.organization = organization;

        next();

    } catch (error) {
        console.log("Error in admin middleware: ", error.message)
        res.status(500).json({ error: "Internal server error" });
    }
}

export default isAdmin;