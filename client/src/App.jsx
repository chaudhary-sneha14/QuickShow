import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./Component/Navbar"
import Home from "./pages/home"
import Movie from "./pages/Movie"
import MovieDetails from "./pages/MovieDetails"
import MyBooking from "./pages/MyBooking"
import Favorite from "./pages/Favorite"
import SeatLayout from "./pages/SeatLayout"
import  {Toaster} from 'react-hot-toast'
import Footer from "./Component/Footer"
import Layout from "./pages/Admin/Layout"
import AddShows from "./pages/Admin/AddShows"
import ListBooking from "./pages/Admin/ListBooking"
import ListShows from "./pages/Admin/ListShows"
import Dashboard from "./pages/Admin/Dashboard"

export const App=()=>{

    const isAdminRoute = useLocation().pathname.startsWith('/admin')
    return(
      <>
     <Toaster/>
     {!isAdminRoute && <Navbar/>}  {/* // display navbar when we are not on admin path */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/movies" element={<Movie/>}/>
        <Route path="/movies/:id" element={<MovieDetails/>}/> 
        <Route path="/movies/:id/:date" element={<SeatLayout/>}/> 
        <Route path="/my-booking" element={<MyBooking/>}/>
        <Route path="/favorite" element={<Favorite/>}/>
        <Route path="/admin/*" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="add-shows" element={<AddShows/>}/>
        <Route path="list-shows" element={<ListShows/>}/> 
        <Route path="list-bookings" element={<ListBooking/>}/> 

        </Route>
      </Routes>
     {!isAdminRoute && <Footer/>}
      </>
    )
}