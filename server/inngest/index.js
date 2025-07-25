import { Inngest } from "inngest";
import User from "../model/user.js";
import Booking from "../model/Booking.js";
import Show from "../model/Shows.js";
import sendEmail from "../config/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "moving-ticket-booking" });

// inngest function to save user data to database

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// inngest function to delte user data to database

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

// inngest function to update user data to database

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },

  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

//ingest function to cancel booking and release seats of show after 10 min of booking created if payment is not made

const releaseSeatAndDeleteBooking = inngest.createFunction(
  { id: "release-seat-delete-booking" },
  { event: "app/checkpayment" },

  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      //is payment is not made , release seats and delete booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  }
);

//inngest function to send email whhen user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: ` <h2>Hi ${booking.user.name},</h2>
        <p>Your booking for <strong>${
          booking.show.movie.title
        }</strong> is confirmed.</p>
       <p><strong>Date & Time:</strong> ${new Date(
         booking.show.showDateTime
       )}</p>
        <p><strong>Seats:</strong> ${booking.bookedSeats.join(", ")}</p>
        <p>Thank you for booking with us!</p>`,
    });
  }
);

//inngest function to send reminder

const sendShowReminders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8* * *" }, //every 8 hours
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    //prepare reminder tasks
    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate("movie");

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select(
          "name email"
        );

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminder to send" };
    }

    //send remainder email

    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
    <h2 style="color: #333;">🎬 Hello ${task.userName},</h2>
    <p style="font-size: 16px; color: #555;">
      This is a quick reminder that your movie <strong>"${
        task.movieTitle
      }"</strong> will start soon.
    </p>

    <p style="font-size: 16px; color: #555;">
      <strong>Showtime:</strong><br/>
      ${new Date(task.showTime).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      })}
    </p>

    <p style="font-size: 16px; color: #555;">
      Please arrive a few minutes early to find your seat and get settled.
    </p>

    <hr style="margin: 20px 0;" />
    
    <p style="font-size: 14px; color: #999;">
      Thank you for choosing our platform. We hope you enjoy the show!
    </p>
  </div>
`,
          })
        )
      );
    });

    const sent = results.filter(r=>r.status==="fulfilled").length;
    const failed=results.length-sent;

    return{
        sent,failed,message:`Sent ${sent} reminder(s), ${failed} failed`
    }
  }
);



const sendNewShowNotifications = inngest.createFunction(
    {id:"send-new-show-notifications"},
    {event:"app/show.added"},
    async({event})=>{
        const{movieTitle,movieId}=event.data;

        const users = await User.find({})

         for (const user of users) {
            const userEmail= user.email;
            const userName= user.name;
           const subject = `🎬 New Show Added: ${movieTitle}`;
const body = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
    <h2 style="color: #2c3e50;">Hi ${userName},</h2>
    <p style="font-size: 16px; color: #555;">
      Great news! A new show for <strong>"${movieTitle}"</strong> has just been added to our platform.
    </p>

    <p style="font-size: 16px; color: #555;">
      Be among the first to book your seats and enjoy the latest cinematic experience.
    </p>

    <a href="https://yourdomain.com/movie/${movieId}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
      View Showtimes & Book Now
    </a>

    <hr style="margin: 30px 0;" />

    <p style="font-size: 14px; color: #999;">
      Thank you for choosing our platform.<br />
      We’re excited to bring you the best movie experiences!
    </p>
  </div>
`;
 await sendEmail({
            to:userEmail,subject,body,
  })
         }

         return {message:"Notification sent."}

    }
)
// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications
];
