const mongoose = require('mongoose');

require("dotenv").config();
const connectString = process.env.MONGODB_URI


const connect = ()=>{
  return mongoose.connect(connectString, { useNewUrlParser: true });
}
module.exports = connect;