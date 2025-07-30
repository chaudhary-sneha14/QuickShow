import { inngest } from "../inngest/index.js";
import Booking from "../model/Booking.js";
import Show from "../model/Shows.js"
import stripe from "stripe"


//check availability of selected seats of a movie
const checkSeatsAvailability = async (showId, selectedSeat) => {
  try {
    const showData = await Show.findById(showId);

    if (!showData) {
      return false;
    }

    const occupiedSeats  = showData.occupiedSeats ;
    const isAnySeatTaken = selectedSeat.some(seat => occupiedSeats[seat]);
 
    return !isAnySeatTaken;
  } catch (error) {
    console.log("Error checking seat availability:", error);
    return false;
  }
};



export const createBooking = async(req,res)=>{
    try {
        const {userId}=req.auth();
        const{showId,selectedSeat}=req.body;
        const{origin}=req.headers;

        //check seat availabel for selecter show
        const isAvailabel = await checkSeatsAvailability(showId,selectedSeat)

        if(!isAvailabel){
            return res.json({success:false,message:"Selected seats are not availabe"})
        }

        //get the show details
        const showData = await Show.findById(showId).populate('movie')

        //create a new booking

        const booking=await Booking.create({
            user:userId,
            show:showId,
            amount :showData.showPrice* selectedSeat.length,
            bookedSeats:selectedSeat
        })
    
        selectedSeat.map((seat)=> {
            showData.occupiedSeats[seat]=userId
        })

        showData.markModified('occupiedSeats')

         await showData.save();

         //Stripe Gateway Initalize

         const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY)

         //creating line item for stripe

         const line_items = [{
          price_data:{
            currency:'usd',
            product_data:{
              name:showData.movie.title
            },
            unit_amount :Math.floor(booking.amount)*100
          },
          quantity:1
         }]

         const session = await stripeInstance.checkout.sessions.create({
          success_url:`${origin}/loading/my-bookings`,
          cancel_url:`${origin}/my-bookings`,
          line_items:line_items,
          mode:'payment',
          metadata:{
           bookingId:booking._id.toString()
          },
          expires_at:Math.floor(Date.now()/1000)+30*60, // Expire in 30 minutes
         })

         booking.paymentLink=session.url
         await booking.save()

// run inngest schdeuler function to check payment status after 10 min
await inngest.send({
  name:"app/checkpayment",
  data:{
    bookingId:booking._id.toString(),
  }
})

        res.json({success:true,url:session.url})

 console.log(req.body);
 
        
    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})
    }
}


export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
  const showData = await Show.findById(showId);


    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({ success: true, occupiedSeats });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
