import express from "express"
import { createBooking, getOccupiedSeats } from "../Controller/bookingController.js"


const bookingRouter= express.Router()

bookingRouter.post('/create',createBooking)
bookingRouter.get('/seats/:showID',getOccupiedSeats)

export default bookingRouter;