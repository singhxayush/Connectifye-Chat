import express from 'express';
import protectRoute from '../middlewares/protectRoute.middleware.js';
import { createOrganization, generateInviteLink } from '../controllers/organisation.controller.js';
import isAdmin from '../middlewares/admin.middleware.js';
import { getUserinfo } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/create", protectRoute, createOrganization);
// router.get("/make-admin", isAdmin, makeAdmin); // takes in a list of users from the organisation's user array and moves them to the admin array
router.get("/invite-link", isAdmin, generateInviteLink) // generates an invite link with 24 hours of validity, can also be changed to take admin defined parameters for the validity of 

export default router;