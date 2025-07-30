import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../Component/Loading';
import Title from './Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const ListBooking = () => {

     const currency = import.meta.env.VITE_CURRENCY 
        const [loading, setLoading] = useState(true)
        const[booking,setBookings]=useState([[]]);

          const{axios,getToken,user,image_base_url}=useAppContext()
        

        const getAllBookings=async()=>{
          try {
      const {data}= await axios.get("/api/admin/all-bookings",{headers:{Authorization:`Bearer ${await getToken()}`}})
      console.log("booking",data);
      
      if(data.success){
       setBookings(data.bookings)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("error in fetching dashboarddata",error)
      
    } 
    setLoading(false)
        }

        useEffect(()=>{
            if(user){getAllBookings()}},
            [user])
            
  return !loading? (
   
   <>
   <Title text1="List" text2="Bookings"/>
     <div className='max-w-4xl mt-6 overflow-x-auto'>
           <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
               <thead>
                   <tr className='bg-primary/20 text-left text-white'>
                   <th className='p-2 font-medium pl-5'>User Name</th>
                   <th className='p-2 font-medium pl-5'>Movie Name</th>
                   <th className='p-2 font-medium pl-5'>Show Time</th>
                   <th className='p-2 font-medium pl-5'>Seat</th>
                   <th className='p-2 font-medium pl-5'>Amount</th>
                   </tr>
               </thead>
   
               <tbody className='text-sm font-light'>
                   {booking.map((item,index)=>(
                       <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                           <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                           <td className='p-2 '>{item.show.movie.title}</td>
                           <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                           <td className='p-2'>{Object.keys(item.bookedSeats || {}).map(seat=> item.bookedSeats[seat]).join(",")}</td>
                           <td className='p-2'>{currency}{item.amount}</td>
                          

                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
   </>
  ):<Loading/>
}

export default ListBooking
