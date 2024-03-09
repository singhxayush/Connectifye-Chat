import express from 'express';
import protectRoute from '../middlewares/protectRoute.middleware.js';
import { getUserOrgs, getUserinfo, getUsersCurrOrg, joinOrganization, switchOrganization } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/info", protectRoute, getUserinfo) // to get the whole of user info 
router.get("/orglist", protectRoute, getUserOrgs)  // to get only the List of orgs
router.get("/currentorg", protectRoute, getUsersCurrOrg)  // to get only the Users cur of orgs
router.post("/join-new-org", protectRoute, joinOrganization)
router.post("/switch/:id", protectRoute, switchOrganization);

export default router;