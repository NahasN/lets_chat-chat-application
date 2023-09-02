const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.DB_URI,{},

).then(()=>{
    console.log('Server connected to Database');
}).catch(()=>{
    console.log('Database connection failed')
})