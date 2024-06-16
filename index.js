const express = require("express");
const dotenv = require('dotenv');
const app= express();
const cors =require("cors");
const PORT =process.env.PORT || 5000;

const mongoose = require("mongoose");
const User = require("./models/user")
const jwt = require('jsonwebtoken');
const bcrypt =require("bcrypt");
const nodemailer = require('nodemailer');

//middleWare
app.use(cors());
app.use(express.json());

//connect db
 require("./db/connection")

 //url for testing purposes only
app.get("/", (req,res)=>{
    res.send("Hello World!")
})

app.post("/api/auth/signup",async(req,res)=>{
    console.log(req.body)
    const {userData}= req.body;
    const {username,email,password}=userData
    if (password.length < 10) {
           res.status(400).json({message:"password is too short"})
     }else{
    const hashedPassword=await bcrypt.hash(password,10)
    try{
        const user =await User.create({
            username,
            email,
            password:hashedPassword
        })
        const token=jwt.sign({id:user._id},"your_jwt_token")
        res.status(200).json({status:"ok",token})

    }catch(error){
        console.log(error.message)
        res.status(400).json({message:"server error"})
    }
}
})


app.post("/api/auth/login",async(req,res)=>{
    console.log(req.body)
    const {userData}=req.body
    const {email, password}=userData
    const user = await User.findOne({email:email})
    if(!user){
        res.status(400).json({message:"user not found"})
    }else{
        const isMatchPassword = await bcrypt.compare(password,user.password)
        if(!isMatchPassword){
            res.status(400).json({message:"invalid password"})
        }else{
            const token= jwt.sign({
                id:user._id
                },"your_jwt_token")
            res.json({status:"ok",token})
        }
    }
})

app.post("/api/users/forgot-password",async(req,res)=>{
    const {userData}= req.body;
    const {email}=userData
    console.log(email)
    try{
    const user = await User.findOne({email:email})
    if(!user){
        res.status(400).json({message:"user not registered"})
    }else{
        const token= jwt.sign({id:user._id,},"your_jwt_token",{expiresIn : '1h'})
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'yellapuv23@gmail.com',
            pass: 'fzffonhenvzrlcrk'
            }
        });
  
        const mailOptions = {
            from: 'yellapuv23@gmail.com',
            to: email,
            subject: 'Reset password',
            text: `http://localhost:3000/reset-password/${token}`
        };
        
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message:"user not registered"})
            } else {
                return res.json({ status:"ok", message:"email send"});
            }
        })
    }
    }catch(e){
        console.log(err)
    }
})

app.post("/api/users/reset-password",async(req,res)=>{
    const {token,password} =req.body
    try{
        const decode=jwt.verify(token,"your_jwt_token")
        const id=decode.id
        const hashedPassword=bcrypt.hash(password,10)
        const result= await User.findById({_id:id, password:hashedPassword})
        return res.status(200).json({status:true, message:"updated password"})
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"invalid token"})
    }

})


//start server 

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT} `)
})
