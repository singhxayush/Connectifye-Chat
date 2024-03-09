import Organization from "../models/organisation.model.js";
import User from "../models/user.model.js";

export const getUserinfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const userInfo = await User.findById(userId).select('-password');
        res.status(201).json(userInfo);

    } catch (error) {
        console.log("Error in getUserinfo controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}


export const getUserOrgs = async (req, res) => {
    try {
        const userId = req.user._id;
        const orgList = await User.findById(userId).select('organizations');
        res.status(201).json({ Organizations: orgList.organizations} );
        
    } catch (error) {
        console.log("Error in getUserOrgs controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}


export const getUsersCurrOrg = async (req, res) => {
    try {
        const userId = req.user._id;
        const currOrg = await User.findById(userId).select('currentOrganization');
        res.status(201).json({ currentOrganization: currOrg.currentOrganization, });
        
    } catch (error) {
        console.log("Error in getUsersCurrOrg controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}


export const joinOrganization = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const organization = await Organization.findOne({
            'inviteCode.code': inviteCode,
            'inviteCode.expiresAt': { $gte: new Date() }, // Checks if the code hasn't expired
        });

        if (!organization) {
            return res.status(404).json({ error: "Invalid or expired invite code." });
        }

        // Now update the user's organization list and organization's users list
        const userId = req.user._id.toString();
        const orgId = organization._id.toString();
        console.log(userId)
        console.log(orgId)

        await User.findByIdAndUpdate(userId, {
            $addToSet: { organizations: orgId },
            $set: { currentOrganization: orgId }
        }, { new: true });

        // Ensure userId is also stored as a string in the organization's users list
        await Organization.findByIdAndUpdate(organization._id, {
            $addToSet: { users: userId } // userId is already a string
        }, { new: true });

        res.status(201).json({ message: "Successfully joined" })

    } catch (error) {
        console.error('Error joining organization:', error);
        res.status(500).send('Server error wchile joining organization.');
    }
};


export const switchOrganization = async (req, res) => {
    try {
        const { id: switchId } = req.params;
        console.log(switchId);
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        const isValidParam = user.organizations.includes(switchId);

        if(!isValidParam) {
            return res.status(403).send('Invalid request')
        }

        await User.findByIdAndUpdate(userId, {
            $set: { currentOrganization: switchId } // Keep as string
        }, { new: true });

        res.status(201).json({ message: "Successfully switched" })

    } catch (error) {
        console.error('Error joining organization:', error);
        res.status(500).send('Internal Server error.');
    }
}