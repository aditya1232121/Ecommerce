require("dotenv").config({ path: "./config.env" }); 
const express = require("express");
const database = require("./database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2 ;
const bodyParser = require("body-parser");
//const fileUpload = require("express-fileupload");



const app = express();
const port = process.env.PORT || 4000;

// Connect to database
database();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Fix CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(fileUpload());


// Content Security Policy (CSP) to allow fonts
app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// Import Routes
const Routes = require("./routes/route");
const userRoutes = require("./routes/userroutes");
const orders = require("./routes/orderroutes");

app.use("/api/v1", Routes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orders);

// Catch-all route to prevent 404 errors
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
