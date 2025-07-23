// Api to check if user is admin or not


import { populate } from "dotenv"
import Booking from "../model/Booking.js"
import Show from "../model/Shows.js"
import User from "../model/user.js"

export const isAdmin = async(req,res)=>{
    res.json({success:true,isAdmin:true})
}

//Api to  get Dashboard data

export const getDashboardData= async(req,res)=>{
    try {
        const bookings= await Booking.find({isPaid:true})
        const activeShows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie');
        const totalUser = await User.countDocuments();

        const dashboardData= {
            totalBookings:bookings.length,
            totalReveue:bookings.reduce((acc,booking)=>acc+booking.amount,0),
            activeShows,
            totalUser
        }

        res.json({success:true,dashboardData})

    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Api to get all Show


export const getAlShow = async(req,res)=>{
    try {
        const Shows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1});
        res.json({success:true,Shows})

        
    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})
    }

}

//Api to get All booking

export const getAllBookings = async(req,res)=>{
    try {
     
        const bookings= await Booking.find({}).populate('user').populate({path:"show", populate:{path:"movie"}})
        .sort({createdAt:-1})
        res.json({success:true,bookings})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}