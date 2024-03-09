import Organization from '../models/organisation.model.js';
import User from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrganization = async (req, res) => {
    try {
        console.log("inside try block 1")
        const { name } = req.body; 
        const userId = req.user._id;

        // Create a new organization with the current user as the admin
        const newOrgID = uuidv4();
        const newOrganization = new Organization({
            _id: newOrgID,
            name: name,
            admin: [userId], // Make the user an admin of this organization
            users: [userId], // Add the user to the organization's users array
        });

        const savedOrganization = await newOrganization.save();
        
        console.log(userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { organizations: newOrgID },
                $set: { currentOrganization: newOrgID },
            },
            { new: true } // This option is correct; it returns the updated document
        );

        res.status(201).json(savedOrganization);

    } catch (error) {
        console.error('Create Organization Error:', error);
        res.status(500).send('Server error while creating organization.');
    }
};


export const getOrgInfo = async (req, res) => {
    try {
        // console.log("inside the try block")
        const userId = req.user._id;
        let currOrg = await User.findById(userId).select('currentOrganization');
        currOrg = currOrg.currentOrganization;
        const orgInfo = await Organization.findById(currOrg);
        console.log(orgInfo); // returns all of the org's info, 
        res.status(201).json(orgInfo)

    } catch (error) {
        console.error('Error getting organization users:', error);
        res.status(500).send('Server error while getting users.');
    }
};


export const generateInviteLink = async (req, res) => {
    try {
        const organization = req.organization;
        const inviteCode = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // for 24 hours of validity

        // Update the organization with the new invite code and expiration date
        organization.inviteCode = { code: inviteCode, expiresAt };
        await organization.save();

        // Generate a full URL for the invite code
        // const inviteLink = `${req.protocol}://${req.get('host')}/api/users/join-new-org/${inviteCode}`;

        // res.json({ inviteLink, expiresAt });
        res.status(201).json({ inviteCode, message: "Code expires within 24 hours" });

    } catch (error) {
        console.error('Error generating invite link:', error);
        res.status(500).send('Server error while generating invite link.');
    }
};
