import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app= express();
const port=3000;

//middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
connectDB()

//API Route
app.get('/',(req,res)=>{
    res.send("Hello Sneha")
})

app.use("/api/inngest", serve
    ({ client: inngest, functions }));

app.listen(port,()=> console.log(`server is running on ${port}`))

