const mongoose=require("mongoose")
require("dotenv").config()

// const url = "mongodb+srv://chat_app_admin:9133584435@cluster0.kxl3855.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected to the DB")
}).catch((err)=>{
    console.log("error:", err)
})