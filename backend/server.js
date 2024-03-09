import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import organizationRoute from "./routes/organisation.route.js";
import userRoutes from "./routes/user.route.js";

import connectToMongoDB from "./database/connectToMongoDB.js";

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

// ---------[MIDDLEWARES]---------

// A middlware to extract these fields {fullName, userName, password, confirmPassword, gender...} from req.body under auth.controller.js
app.use(express.json()); // to parse the incoming request with the JSON payload (req.body)

app.use(cookieParser());

// Authentication Routes MiddleWare
app.use("/api/auth", authRoutes);

// Message and Conv Routes Middleware
app.use("/api/messages", messageRoutes);

// User Info Routes Middleware
app.use("/api/users", userRoutes);

// Oranization related info Routes Middleware
app.use("/api/organisation", organizationRoute);

// -------------------------------


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`http://localhost:${PORT}`);
});


/*

Developers Guide:

>> Routing API's

> Auth API's

  SIGNUP | REQUEST TYPE: POST
  - http://localhost:5000/api/auth/signup
    Json REQUEST Body:

          {
            "fullName",
            "username",
            "password",
            "confirmPassword",
            "gender",
          }

    **All fields are unique and username is Unique**

  LOGIN | REQUEST TYPE: POST
  - http://localhost:5000/api/auth/login
      Json REQUEST Body:
          {
            "username",
            "password",
          }

  LOGOUT | REQUEST TYPE: POST
  - http://localhost:5000/api/auth/logout
    

> Organisation API's

  CREATE NEW ORGANISATION | REQUEST TYPE: POST
  - http://localhost:5000/api/organisation/create
    Json REQUEST Body:

          {
            "name" : "org2"
          }

  GENERATE INVITE CODE | REQUEST TYPE: POST
  - http://localhost:5000/api/organisation/invite-link

  MAKE OTHER USERS ADMIN | REQUEST TYPE: POST
  - http://localhost:5000/api/organisation/make-admin/{UserId}
  - http://localhost:5000/api/organisation/make-admin/


> User's API's

  GET USER INFO | REQUEST TYPE: GET
  - http://localhost:5000/api/users/info
    
  GET USER's CURRENT ORGANISATION | REQUEST TYPE: GET
  - http://localhost:5000/api/users/currentorg

  GET USER's ALL LIST OF ORGANISATION | REQUEST TYPE: GET
  - http://localhost:5000/api/users/orglist

  USER JOINS NEW ORGANISATION VIA CODE | REQUEST TYPE: POST
  - http://localhost:5000/api/users/join-new-org
    Json REQUEST Body:

          {
            "inviteCode": "de821d81-242a-4885-93f9-c4eee6c1df5a"
          }

  USER SWITCH ORGANISATIONS | REQUEST TYPE: POST
  - http://localhost:5000/api/users/switch/{OrganisationId}
    example: http://localhost:5000/api/users/switch/17a32425-8dc8-4ad7-abe0-47056a994280


> Conversation API's

  USER GETS MESSAGE WITH OTHER USER/GROUP | REQUEST TYPE: GET
  - http://localhost:5000/api/messages/:ReceiverId
    example: http://localhost:5000/api/messages/65d7e08bb740808eb746d21a

  USER SENDS MESSAGE TO OTHER USER/GROUP | REQUEST TYPE: GET
  - http://localhost:5000/api/messages/send/:ReceiverId
    example: http://localhost:5000/api/messages/send/65d7e08bb740808eb746d21a



Response status codes, messages and error messages

> For Auth

  Signup:

    when missing any fields: res.status(400).json({ error: "Missing required fields in request body." }

      example:
      {
        "error": "Missing required fields in request body."
      }

    when password !== confirmPassword
    res.status(400).json({ error: "Passwords don't match." }

      example:
      {
        "error": "Passwords don't match."
      }

    res.status(400).json({ error: "Username not available." }
    
      example:
      {
        "error": "Username not available."
      }

    When successfully created:

      res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
      });

      example:
      {
        "_id": "65ec9747c31f90aa1a23728c",
        "fullName": "John Doe",
        "username": "johndoe",
        "profilePic": "https://avatar.iran.liara.run/public/boy?username=johndoe"
      }

    otherwise:
    status(500).json({ error: 'Internal Server Error' })

  Signin:

    when infalid credentials
    res.status(400).json({error: "Invalid credentials"}

    otherwise
    res.status(500).json({ error: 'Internal Server Error' }

  Logout:

    on successful logout:
    res.status(500).json({message: "Logged Out successfully"}


> For Organisations:

  Create new organisation:

    when succesfull:
    res.status(201).json(savedOrganization)

      example:
      {
        "_id": "4b3fbc83-ed0f-43ab-8775-6f5257fe7301",
        "name": "spaceX",
        "users": [
            "65ec9747c31f90aa1a23728c"
        ],
        "admin": [
            "65ec9747c31f90aa1a23728c"
        ],
        "createdAt": "2024-03-09T17:11:53.737Z",
        "updatedAt": "2024-03-09T17:11:53.737Z",
        "__v": 0
      }

    otherwise:
    res.status(500).send('Server error while creating organization.')
  
  Get organisation's info:

    When successful: returns all of the organisations info
    res.status(201).json(orgInfo)

      example:
      {
        "inviteCode": {
          "code": "b611ac3d-11f5-41bd-a967-2a83a96d6481",
          "expiresAt": "2024-03-10T14:33:48.262Z"
        },
        "_id": "6b0821de-d586-4cc7-b5e4-aad81cf9f849",
        "name": "org2",
        "users": [
          "65eba9d4b91eb869282e149c",
          "65ebaa30a4192f198348da79"
        ],
        "admin": [
          "65eba9d4b91eb869282e149c"
        ],
        "createdAt": "2024-03-09T14:33:29.275Z",
        "updatedAt": "2024-03-09T14:35:10.062Z",
        "__v": 0
      }

      otherwise:
      res.status(500).send('Server error while getting users.')


  Generate Invite code:

    When successful:
    res.status.json({ inviteCode, message: "Code expires within 24 hours" });

      example:
      {
        "inviteCode": "b321b7e5-074b-4050-829a-95894c0698ae",
        "message": "Code expires within 24 hours"
      }

    otherwise:
    res.status(500).send('Server error while generating invite link.')

> For Users:

  Get user's info:

    when successful:
    res.status(201).json(userInfo)

      example:
      {
        "_id": "65eba9d4b91eb869282e149c",
        "fullName": "Elon Musk",
        "username": "elon_musk",
        "gender": "male",
        "profilePic": "https://avatar.iran.liara.run/public/boy?username=ayush",
        "organizations": [
          "530f5bfd-4c6a-4ad5-8d7c-2991fc2ce072",
          "17a32425-8dc8-4ad7-abe0-47056a994280",
          "6b0821de-d586-4cc7-b5e4-aad81cf9f849"
        ],
        "currentOrganization": "6b0821de-d586-4cc7-b5e4-aad81cf9f849",
        "createdAt": "2024-03-09T00:14:12.772Z",
        "updatedAt": "2024-03-09T14:33:29.316Z",
        "__v": 0
      }

    otherwise:
    res.status(500).json({ error: "Internal server error"})

  Get User's Orgs:

    when successful: it will return JSON containing list ID's of organisation the user belongs to
    res.status(201).json(orgList)

      example:

      {
        "Organizations": [
          "530f5bfd-4c6a-4ad5-8d7c-2991fc2ce072",
          "17a32425-8dc8-4ad7-abe0-47056a994280",
          "6b0821de-d586-4cc7-b5e4-aad81cf9f849"
        ]
      }

      otherwise:
      res.status(500).json({ error: "Internal server error"})

  User Joining a new organisation via invite code:

    when invite code is expired:
    return res.status(404).json({ error: "Invalid or expired invite code." })

    When successful:
    res.status(201).json({ message: "Successfully joined" })

    otherwise:
    res.status(201).json({ message: "Successfully joined" })

  When the User tries to switch to a different organisation:

    when successful:
    res.status(201).json({ message: "Successfully switched" })

    otherwise:
    res.status(500).send('Internal Server error.');


> Middleware status codes, messages and error messages :

  when the user is not logged in:
  return res.status(401).json({ error: "Unauthorised - No token provided" });

  when the jwt token provided by the user is wrong/invalid
  return res.status(401).json({ error: "Unauthorised - Invalid token" });

  when the organisation is not found or the requesting user is not the part of the organisation:
  return res.status(404).json({ error: 'Organization not found or You are not part of this organization.' });

  when the request is of admin type and the user requesting is not an admin:
  return res.status(403).json({ error: 'Access denied. Not an admin.' });[]

  otherwise:
  res.status(500).json({ error: "Internal server error" });

*/