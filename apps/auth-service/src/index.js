require('dotenv').config(); 
const express = require('express');
const UserRouter = require('./routes');
const { errorHandler,sanitizeRequests,createRedisClient } = require('@repo/utils');
const cors = require('cors');
const { startupScript } = require('./scripts');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequests);

app.use('/user',UserRouter);
app.get('/test',(req,res)=>{
    res.send("Hiiii");
})

app.use(errorHandler);


app.listen(process.env.AUTH_SERVICE_PORT,()=>{
    startupScript();
    console.log(`Auth Service Has Successfully Started At ${process.env.AUTH_SERVICE_PORT}`);
})