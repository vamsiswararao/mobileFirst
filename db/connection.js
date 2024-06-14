const mongoose=require("mongoose")


// const url = "mongodb+srv://chat_app_admin:9133584435@cluster0.kxl3855.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbUrl="mongodb+srv://yellapuv23:9133584435@cluster0.fhujozw.mongodb.net/mobileFirst?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connected to the DB")
}).catch((err)=>{
    console.log("error:", err)
})