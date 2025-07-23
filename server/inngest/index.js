
import { Inngest } from "inngest";
import User from "../model/user.js";
import Booking from "../model/Booking.js";
import Show from "../model/Shows.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "moving-ticket-booking" });

// inngest function to save user data to database

const syncUserCreation =inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},

    async({event})=>{
     const {id,first_name,last_name,email_addresses,image_url}=event.data

     const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:first_name + ' ' + last_name,
        image:image_url
     }
     await User.create(userData)
    }
)

// inngest function to delte user data to database

const syncUserDeletion =inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event:'clerk/user.deleted'},

    async({event})=>{
     const {id}=event.data

     await User.findByIdAndDelete(id)
})



// inngest function to update user data to database

const syncUserUpdation =inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},

   async({event})=>{
     const {id,first_name,last_name,email_addresses,image_url}=event.data

     const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:first_name + ' ' + last_name,
        image:image_url
     }
     await User.findByIdAndUpdate(id,userData)
    }
)


//ingest function to cancel booking and release seats of show after 10 min of booking created if payment is not made

const releaseSeatAndDeleteBooking=inngest.createFunction(
    {id:'release-seat-delete-booking'},
    {event:"app/checkpayment"},

    async({event,step})=>{
        const tenMinutesLater=new Date(Date.now()+ 10*60*1000);
        await step.sleepUntil('wait-for-10-minutes',tenMinutesLater);

        await step.run('check-payment-status',async()=>{
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            //is payment is not made , release seats and delete booking
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat)=>{
                    delete show.occupiedSeats[seat]
                })
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)





// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation.releaseSeatAndDeleteBooking];