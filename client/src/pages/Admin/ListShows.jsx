import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../Component/Loading';
import Title from './Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY

    const [loading, setLoading] = useState(true)
    const[shows,setShows]=useState([]);

      const{axios,getToken,user}=useAppContext()
    

    const getAllShow=async()=>{
        try {
            const {data}= await axios.get("/api/admin/all-shows",{
                headers:{Authorization :`Bearer ${await getToken()}`}
            })
            console.log(data);
            
         if(data.success){
        setShows(data.Shows)
        setLoading(false)
      }
      else{
        toast.error(data.message)
      }
        } catch (error) {
            console.log(error);  
            toast.error("error in fetching list",error)    
        }
    }

    useEffect(()=>{
     if(user)  { getAllShow()}
    },[user])
  
  return !loading?(
    <>
    <Title text1="List" text2="Shows"/>
    <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
            <thead>
                <tr className='bg-primary/20 text-left text-white'>
                <th className='p-2 font-medium pl-5'>Movie Name</th>
                <th className='p-2 font-medium pl-5'>Show Time</th>
                <th className='p-2 font-medium pl-5'>Total Bookings</th>
                <th className='p-2 font-medium pl-5'>Earning</th>
                </tr>
            </thead>

            <tbody className='text-sm fontt-light'>
                {shows.map((show,index)=>(
                    <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                        <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                        <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                        <td className='p-2'>{Object.keys(show.occuipedSeats).length}</td>
                        <td className='p-2'>{currency}{Object.keys(show.occuipedSeats).length*show.showPrice}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </>
  ):(
    <Loading/>
  )
}

export default ListShows
