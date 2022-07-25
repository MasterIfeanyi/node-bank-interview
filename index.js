const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const colors = require("colors");
const mongoose = require("mongoose");
const verifyJWT = require("./middleware/verifyJWT");

// custom files
const connectDB = require("./config/dbConn")
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const userRoutes = require("./routes/api/user");
const account = require("./routes/api/account");
const history = require("./routes/api/history");
const logout = require("./routes/logout");
const refresh = require("./routes/refresh");
const register = require("./routes/register");
const login = require("./routes/login");



//initialize express app
const app = express();

// port 
const PORT = process.env.PORT || 3500;

// Connect to MongoDb
connectDB();

// built-in middleware for json 
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// add Access-control-allow header
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware for cookies
app.use(cookieParser());


// routes
app.use("/logout", logout);
app.use("/refresh", refresh);
app.use("/register", register);
app.use("/login", login);
app.use(verifyJWT);
app.use("/users", userRoutes);
app.use("/account", account);
app.use("/history", history);

app.listen(PORT, () => console.log(`server is running on ${PORT}`))

// MONGO_URI=mongodb+srv://mongotut:testing123@cluster0.kogqa.mongodb.net/BankDB?retryWrites=true&w=majority