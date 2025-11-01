require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const main =  require("./Routes/main")
const news =  require("./Routes/news")
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(cors());
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Mongodb connected")
});
app.use('/news',news)
app.use('/',main)
app.listen(process.env.PORT, () => {
  console.log(`istening on the port ${process.env.PORT}...`);
});
