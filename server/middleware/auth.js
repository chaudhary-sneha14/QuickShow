import { clerkClient } from "@clerk/express";

export const protectAdmin = async(req,res,next)=>{
    
    // const {userId} = req.body;
     
    try {
        const {userId} = req.auth()
        // const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId)

        if(user.privateMetadata.role!=='admin'){
            return res.json({success:false,message:"Not Authorize"})
        }

        next();
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Not Authorize"})

    }

}