import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// -----------------------[SIGNUP CHECK]-----------------------
export const signup = async (req, res) => {

  try {
    console.log("inside try block - signup");
    // console.log(req);
    console.log(req.body);
    // if(!req.body){ console.log('Invalid') }
    // Check if req.body is undefined or missing properties

    if (!req.body || !req.body.fullName || !req.body.username || !req.body.password || !req.body.confirmPassword || !req.body.gender) {
      return res.status(400).json({ error: "Missing required fields in request body." });
    }

    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match." });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username not available." });
    }

    // HASH password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Profile Avatars
    // Male: https://avatar.iran.liara.run/public/boy
    // Female: https://avatar.iran.liara.run/public/girl
    const MaleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const FemaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // let organization = [];
    // let currentUserOrganization = null;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? MaleProfilePic : FemaleProfilePic,
    });

    if(newUser) {
      // Generate JWT token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({error: "Invalid user data"})
    }

  } catch (error) {
    console.log('Error in signup controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// -----------------------[LOGIN CHECK]-----------------------
export const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user || !isPasswordCorrect) {
      return res.status(400).json({error: "Invalid credentials"})
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      organizations: user.organizations,
      currentOrganization: user.currentOrganization,
    });

    console.log(`logged in as: ${username}`)

  } catch (error) {
    console.log('Error in signup controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// -----------------------[LOGOUT METHOD]-----------------------
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(500).json({message: "Logged Out successfully"})
  } catch (error) {
    console.log('Error in signup controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
