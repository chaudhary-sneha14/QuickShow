import  { useEffect, useState } from 'react'
import Loading from '../Component/Loading';
import BlurCircle from '../Component/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { dateFormat } from '../lib/dateFormat';
import { useAppContext } from '../Context/AppContext';
import { Link } from 'react-router-dom';

const MyBooking = () => {
  const currency= import.meta.env.VITE_CURRENCY

  const[bookings,setBookings]=useState([])
  const[isLoading,setIsLoading]=useState(true);

    const {axios,getToken,user,image_base_url}=useAppContext()
  


  const getMyBooking = async()=>{
    try {
      const {data}= await axios.get("/api/user/bookings",{headers:{Authorization:`Bearer ${await getToken()}`}})
      console.log(data);
      console.log("booking",data.booking);
      
      if(data.success){
        setBookings(data.booking)      
      }
    } catch (error) {
      console.log(error);
      
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
    getMyBooking()
    }
  },[user])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] '>
      <BlurCircle top='100px' right='100px' />
      <div>
      <BlurCircle bottom='0px' left='600px' />
      </div>

      <h1 className='text-lg font-semibold mb-4'>My Booking</h1>

      {bookings.length>0 && bookings.map((item,index)=>(
          <div key={index} className='
          flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
           <div className="flex flex-col md:flex-row">
  <img
    src={image_base_url + item.show.movie.poster_path}
    alt=""
    className="w-full md:w-32 h-32 object-cover object-center rounded-lg"
  />

  <div className="flex flex-col p-4">
    <p className="text-lg font-semibold">{item.show.movie.title}</p>
    <p className="text-gray-400 text-sm">{timeFormat(item.show.movie.runtime)}</p>
    <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
  </div>
</div>


            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                {!item.isPaid && <Link to={item.paymentLink} className='mb-3 gap-2 px-4 py-1.5 text-sm bg-primary 
            hover:bg-primary-dull transition rounded-full font-medium cursor-pointer '>
                  Pay Now</Link >}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span>{item.bookedSeats.length}</p>
                <p><span className='text-gray-400'>Seat Number:</span>{item.bookedSeats.join(",")}</p> 
            </div>
            </div>
          </div>
      ))}      
    </div>
  ):(<Loading/>)
}
export default MyBooking
