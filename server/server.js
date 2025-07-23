import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './Routes/showRoutes.js';
import bookingRouter from './Routes/bookingRoutes.js';
import adminRouter from './Routes/adminRoutes.js';
import userRouter from './Routes/userRouter.js';
import { stripeWebhooks } from './Controller/stripeWebhooks.js';

const app= express();
const port=3000;

connectDB()

//stripe webhook route
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)

//middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


//API Route
app.get('/',(req,res)=>{
    res.send("Hello Sneha")
})

app.use("/api/inngest", serve
    ({ client: inngest, functions }));

app.use('/api/show',showRouter)    
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.listen(port,()=> console.log(`server is running on ${port}`))

// export default app;
