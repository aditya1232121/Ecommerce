const express = require('express');
const app = express();

app.use(express.json());


// const  Routes = require('./routes/route') ;
// const userRoutes = require('./routes/userroutes')
// const ordering= require("./routes/orderroutes")

// app.use('/api/v1' , Routes);
// app.use('/api/v1' , userRoutes) ;
// app.use('/api/v1' , ordering)

module.exports = app