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


*/